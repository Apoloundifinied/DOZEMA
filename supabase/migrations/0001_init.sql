-- Dozena · migration 0001 (Supabase / Postgres)
-- Datas em UTC. RLS em todas as tabelas. Escrita sensível só por RPC (security definer).
-- ATENÇÃO: validar em um Supabase local/novo ANTES de usar em produção.

create extension if not exists pgcrypto;

create type app_role           as enum ('user','admin');
create type queue_role         as enum ('owner','helper');
create type queue_status       as enum ('waiting','placed','left');
create type round_status       as enum ('setup','testing','buffer','finished','cancelled');
create type participant_status as enum ('active','dropped');
create type assignment_status  as enum ('pending','joined','active','completed','dropped','flagged');
create type report_status      as enum ('open','reviewing','resolved','dismissed');

-- ============ Tabelas ============
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  handle       text unique check (handle is null or handle ~ '^[a-z0-9_]{3,24}$'),
  display_name text,
  country      char(2),
  locale       text not null default 'pt-BR' check (locale in ('pt-BR','en')),
  needs_rule   boolean not null default false,        -- precisa cumprir a regra 12/14
  role         app_role not null default 'user',
  reliability  numeric(4,3) not null default 0.5 check (reliability between 0 and 1),
  banned_at    timestamptz,
  created_at   timestamptz not null default now()
);

create table apps (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references profiles(id) on delete cascade,
  name         text not null check (char_length(name) between 2 and 60),
  package_name text not null check (package_name ~ '^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)+$'),
  optin_url    text not null check (optin_url ~ '^https://play\.google\.com/apps/testing/[A-Za-z0-9._]+$'),
  group_url    text not null check (group_url ~ '^https://groups\.google\.com/(g|u/[0-9]+/g)/[A-Za-z0-9._-]+$'),
  description  text check (char_length(description) <= 500),
  test_focus   text check (char_length(test_focus) <= 300),
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  unique (owner_id, package_name)
);

create table rounds (
  id             uuid primary key default gen_random_uuid(),
  status         round_status not null default 'setup',
  started_at     timestamptz not null default now(),
  setup_ends_at  timestamptz not null,
  test_ends_at   timestamptz not null,
  buffer_ends_at timestamptz not null,
  finished_at    timestamptz
);

create table queue_entries (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  role            queue_role not null,
  app_id          uuid references apps(id) on delete cascade,
  needs_rule      boolean not null default false,
  status          queue_status not null default 'waiting',
  placed_round_id uuid references rounds(id) on delete set null,
  created_at      timestamptz not null default now(),
  check ((role = 'owner' and app_id is not null) or (role = 'helper' and app_id is null))
);
create unique index queue_one_waiting_per_profile on queue_entries (profile_id) where status = 'waiting';

create table round_participants (
  round_id   uuid not null references rounds(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role       queue_role not null,
  app_id     uuid references apps(id),
  needs_rule boolean not null default false,
  status     participant_status not null default 'active',
  joined_at  timestamptz not null default now(),
  primary key (round_id, profile_id)
);
create unique index participants_one_app_per_round on round_participants (round_id, app_id) where app_id is not null;

create table assignments (
  id              uuid primary key default gen_random_uuid(),
  round_id        uuid not null references rounds(id) on delete cascade,
  tester_id       uuid not null references profiles(id) on delete cascade,
  app_id          uuid not null references apps(id) on delete cascade,
  status          assignment_status not null default 'pending',
  joined_group_at timestamptz,
  opted_in_at     timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  unique (round_id, tester_id, app_id)
);
create index assignments_tester_idx on assignments (tester_id);
create index assignments_app_idx    on assignments (app_id);

create table checkins (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  day           date not null,
  created_at    timestamptz not null default now(),
  unique (assignment_id, day)
);

create table feedback (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null unique references assignments(id) on delete cascade,
  rating        smallint not null check (rating between 1 and 5),
  body          text not null check (char_length(body) between 80 and 2000),  -- MIN_FEEDBACK_CHARS
  created_at    timestamptz not null default now()
);

create table reports (
  id                uuid primary key default gen_random_uuid(),
  reporter_id       uuid not null references profiles(id) on delete cascade,
  target_app_id     uuid references apps(id) on delete set null,
  target_profile_id uuid references profiles(id) on delete set null,
  reason            text not null check (char_length(reason) between 10 and 1000),
  status            report_status not null default 'open',
  created_at        timestamptz not null default now(),
  check (target_app_id is not null or target_profile_id is not null)
);

create table event_log (
  id         bigint generated always as identity primary key,
  kind       text not null,
  actor_id   uuid,
  ref        text,
  payload    jsonb,
  created_at timestamptz not null default now()
);

-- ============ Trigger: criar perfil ao cadastrar ============
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

-- ============ Regra: ninguém testa o próprio app ============
create or replace function prevent_self_test() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from apps where id = new.app_id and owner_id = new.tester_id) then
    raise exception 'self_test_not_allowed';
  end if;
  return new;
end $$;

create trigger assignments_no_self_test
  before insert on assignments for each row execute function prevent_self_test();

-- ============ Funções auxiliares (security definer evita recursão de RLS) ============
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin' and banned_at is null);
$$;

create or replace function is_app_owner(p_app uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from apps where id = p_app and owner_id = auth.uid());
$$;

create or replace function is_assigned_tester(p_app uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from assignments where app_id = p_app and tester_id = auth.uid());
$$;

create or replace function in_round(p_round uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from round_participants where round_id = p_round and profile_id = auth.uid());
$$;

-- ============ RLS ============
alter table profiles           enable row level security;
alter table apps               enable row level security;
alter table rounds             enable row level security;
alter table queue_entries      enable row level security;
alter table round_participants enable row level security;
alter table assignments        enable row level security;
alter table checkins           enable row level security;
alter table feedback           enable row level security;
alter table reports            enable row level security;
alter table event_log          enable row level security;

-- profiles: leitura para logados; update só em colunas liberadas
create policy profiles_read on profiles for select to authenticated using (true);
create policy profiles_update_self on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
revoke update on profiles from authenticated;
grant update (handle, display_name, country, locale, needs_rule) on profiles to authenticated;

-- apps: links só para dono, testers atribuídos e admin
create policy apps_read on apps for select to authenticated
  using (owner_id = auth.uid() or is_assigned_tester(id) or is_admin());
create policy apps_insert on apps for insert to authenticated with check (owner_id = auth.uid());
create policy apps_update on apps for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy apps_delete on apps for delete to authenticated using (owner_id = auth.uid());

-- fila
create policy queue_read on queue_entries for select to authenticated
  using (profile_id = auth.uid() or is_admin());
create policy queue_insert on queue_entries for insert to authenticated
  with check (
    profile_id = auth.uid() and status = 'waiting'
    and (role = 'helper' or is_app_owner(app_id))
    and not exists (select 1 from profiles where id = auth.uid() and banned_at is not null)
  );
create policy queue_leave on queue_entries for update to authenticated
  using (profile_id = auth.uid() and status = 'waiting')
  with check (profile_id = auth.uid() and status in ('waiting','left'));

-- rodadas (escrita só pelo servidor com service role)
create policy rounds_read on rounds for select to authenticated using (in_round(id) or is_admin());
create policy participants_read on round_participants for select to authenticated
  using (in_round(round_id) or is_admin());

-- atribuições, check-ins, feedback (escrita só por RPC)
create policy assignments_read on assignments for select to authenticated
  using (tester_id = auth.uid() or is_app_owner(app_id) or is_admin());
create policy checkins_read on checkins for select to authenticated
  using (is_admin() or exists (select 1 from assignments a where a.id = assignment_id
         and (a.tester_id = auth.uid() or is_app_owner(a.app_id))));
create policy feedback_read on feedback for select to authenticated
  using (is_admin() or exists (select 1 from assignments a where a.id = assignment_id
         and (a.tester_id = auth.uid() or is_app_owner(a.app_id))));

-- denúncias e log
create policy reports_insert on reports for insert to authenticated with check (reporter_id = auth.uid());
create policy reports_admin_read on reports for select to authenticated using (is_admin());
create policy reports_admin_update on reports for update to authenticated using (is_admin()) with check (is_admin());
create policy event_log_admin_read on event_log for select to authenticated using (is_admin());

-- ============ RPCs ============
-- Constantes espelhadas de lib/config.ts: MIN_CHECKINS_PER_APP = 2

create or replace function confirm_step(p_assignment uuid, p_step text) returns void
language plpgsql security definer set search_path = public as $$
declare v_a assignments%rowtype; v_status round_status;
begin
  select * into v_a from assignments where id = p_assignment and tester_id = auth.uid();
  if not found then raise exception 'not_found'; end if;
  select status into v_status from rounds where id = v_a.round_id;
  if v_status not in ('setup','testing') then raise exception 'round_not_open'; end if;
  if v_a.status in ('dropped','flagged') then raise exception 'assignment_closed'; end if;

  if p_step = 'joined_group' then
    update assignments
       set joined_group_at = coalesce(joined_group_at, now()),
           status = case when status = 'pending' then 'joined'::assignment_status else status end
     where id = p_assignment;
  elsif p_step = 'opted_in' then
    update assignments
       set opted_in_at = coalesce(opted_in_at, now()),
           joined_group_at = coalesce(joined_group_at, now()),
           status = case when status in ('pending','joined') then 'active'::assignment_status else status end
     where id = p_assignment;
  else
    raise exception 'invalid_step';
  end if;
end $$;

create or replace function check_in(p_assignment uuid) returns int
language plpgsql security definer set search_path = public as $$
declare v_a assignments%rowtype; v_status round_status; v_days int;
begin
  select * into v_a from assignments where id = p_assignment and tester_id = auth.uid();
  if not found then raise exception 'not_found'; end if;
  select status into v_status from rounds where id = v_a.round_id;
  if v_status <> 'testing' then raise exception 'round_not_testing'; end if;
  if v_a.status not in ('active','completed') then raise exception 'optin_required'; end if;

  insert into checkins (assignment_id, day)
  values (p_assignment, (now() at time zone 'utc')::date)
  on conflict (assignment_id, day) do nothing;

  select count(*) into v_days from checkins where assignment_id = p_assignment;
  if v_days >= 2 and v_a.status = 'active' then
    update assignments set status = 'completed', completed_at = now() where id = p_assignment;
  end if;
  return v_days;
end $$;

create or replace function submit_feedback(p_assignment uuid, p_rating smallint, p_body text) returns void
language plpgsql security definer set search_path = public as $$
declare v_a assignments%rowtype; v_status round_status;
begin
  select * into v_a from assignments where id = p_assignment and tester_id = auth.uid();
  if not found then raise exception 'not_found'; end if;
  select status into v_status from rounds where id = v_a.round_id;
  if v_status not in ('testing','buffer') then raise exception 'round_not_open'; end if;
  if v_a.status not in ('active','completed') then raise exception 'optin_required'; end if;
  if not exists (select 1 from checkins where assignment_id = p_assignment) then
    raise exception 'checkin_required';
  end if;

  insert into feedback (assignment_id, rating, body) values (p_assignment, p_rating, p_body)
  on conflict (assignment_id) do update set rating = excluded.rating, body = excluded.body;
end $$;

-- Painel admin (P2)
create or replace function admin_stats() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  return jsonb_build_object(
    'users_total',           (select count(*) from profiles),
    'users_7d',              (select count(*) from profiles where created_at > now() - interval '7 days'),
    'users_with_app',        (select count(distinct owner_id) from apps),
    'apps_total',            (select count(*) from apps),
    'queue_owners',          (select count(*) from queue_entries where status = 'waiting' and role = 'owner'),
    'queue_helpers',         (select count(*) from queue_entries where status = 'waiting' and role = 'helper'),
    'rounds_by_status',      (select coalesce(jsonb_object_agg(s.status::text, s.n), '{}'::jsonb)
                                from (select status, count(*) as n from rounds group by status) s),
    'assignments_total',     (select count(*) from assignments),
    'assignments_completed', (select count(*) from assignments where status = 'completed'),
    'feedback_total',        (select count(*) from feedback),
    'reports_open',          (select count(*) from reports where status = 'open')
  );
end $$;

revoke all on function confirm_step(uuid, text)                  from public;
revoke all on function check_in(uuid)                            from public;
revoke all on function submit_feedback(uuid, smallint, text)     from public;
revoke all on function admin_stats()                             from public;
grant execute on function confirm_step(uuid, text)               to authenticated;
grant execute on function check_in(uuid)                         to authenticated;
grant execute on function submit_feedback(uuid, smallint, text)  to authenticated;
grant execute on function admin_stats()                          to authenticated;

-- ============ Views públicas (sem links) ============
create view app_cards as
  select a.id, a.name, a.description, p.handle as owner_handle
  from apps a join profiles p on p.id = a.owner_id
  where a.is_active;

create view app_ranking as
  select a.id as app_id, a.name, p.handle as owner_handle,
         round(avg(f.rating)::numeric, 2) as avg_rating,
         count(f.id) as feedback_count,
         count(distinct case when asg.status = 'completed' then asg.id end) as completed_tests
  from apps a
  join profiles p on p.id = a.owner_id
  left join assignments asg on asg.app_id = a.id
  left join feedback f on f.assignment_id = asg.id
  where a.is_active
  group by a.id, a.name, p.handle
  having count(f.id) >= 5;

create view tester_ranking as
  select p.id as profile_id, p.handle, p.reliability,
         count(*) filter (where asg.status = 'completed') as completed_tests
  from profiles p
  left join assignments asg on asg.tester_id = p.id
  where p.banned_at is null and p.handle is not null
  group by p.id, p.handle, p.reliability;

revoke all on app_cards, app_ranking, tester_ranking from anon;
grant select on app_cards, app_ranking, tester_ranking to authenticated;
