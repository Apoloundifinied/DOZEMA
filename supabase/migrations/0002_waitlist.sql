-- Dozena · migration 0002_waitlist (Supabase / Postgres)
-- Tabela de lista de espera (Fase 0 - validação)
-- Apenas insert público, sem read. RLS habilitado.

create table waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  created_at timestamptz not null default now(),
  unique (email)
);

-- Habilita RLS
alter table waitlist enable row level security;

-- Política: qualquer um (anon) pode inserir
create policy waitlist_insert on waitlist
  for insert to anon
  with check (true);

-- Política: NINGUÉM pode ler (nem admin via API pública)
-- Admin acessa via service role (bypass RLS) ou dashboard

-- Índice para consultas admin futuras
create index waitlist_created_at_idx on waitlist (created_at desc);

-- Comentários
comment on table waitlist is 'Lista de espera Fase 0 - apenas insert público';
comment on column waitlist.email is 'E-mail do interessado (único)';