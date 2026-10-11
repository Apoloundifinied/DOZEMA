-- Dozena · migration 0003_events (Supabase / Postgres)
-- Analítico próprio da Fase 0: visitas e cliques no CTA.
-- Para medir o funil de validação (ADR-013): visitas → cliques → waitlist.
-- Apenas insert público, sem read. RLS habilitado. Sem cookies, sem IP salvo.

create table events (
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('page_view', 'cta_click')),
  locale     text check (locale in ('pt-BR', 'en')),
  path       text check (char_length(path) <= 200),
  referrer   text check (char_length(referrer) <= 500),
  ua         text check (char_length(ua) <= 300),
  created_at timestamptz not null default now()
);

-- Habilita RLS
alter table events enable row level security;

-- Política: qualquer um (anon) pode inserir
create policy events_insert on events
  for insert to anon
  with check (true);

-- NINGUÉM lê via API pública. Leitura via service role / dashboard / SQL.

-- Índices para o funil de validação
create index events_created_at_idx on events (created_at desc);
create index events_type_created_at_idx on events (type, created_at desc);

comment on table events is 'Analítico próprio Fase 0: page_view e cta_click (sem cookies)';
comment on column events.referrer is 'Referer da visita (origem do tráfego)';
comment on column events.ua is 'User-Agent (p/ separar dispositivo; bots filtrados no relatório)';
