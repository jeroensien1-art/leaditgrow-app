-- E-maillijst met tags per gedownloade freebie.
-- Idempotent: veilig meerdere keren te draaien. Raakt `leads` en `diagnostics` niet aan.

create table if not exists public.email_list (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  tags text[] not null default '{}',
  source text not null default 'freebie',
  lang text not null default 'nl',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- één rij per e-mailadres, zodat een tweede download een tag toevoegt
-- in plaats van een dubbele inschrijving aan te maken
create unique index if not exists email_list_email_key
  on public.email_list (lower(email));

create index if not exists email_list_tags_idx
  on public.email_list using gin (tags);

alter table public.email_list enable row level security;

-- geen policies: enkel de service role (server-side) schrijft en leest.
-- De anon key krijgt hierdoor [] terug, dat is de bedoeling.

comment on table public.email_list is
  'E-maillijst uit freebie-opt-ins. tags[] bevat de freebie-ids die iemand downloadde.';

-- Verificatie, verwacht: 1 tabel, 2 indexen, rowsecurity = true
select
  (select count(*) from information_schema.tables
     where table_schema = 'public' and table_name = 'email_list') as tabel,
  (select count(*) from pg_indexes
     where schemaname = 'public' and tablename = 'email_list'
       and indexname in ('email_list_email_key', 'email_list_tags_idx')) as indexen,
  (select relrowsecurity from pg_class
     where oid = 'public.email_list'::regclass) as rls_aan;
