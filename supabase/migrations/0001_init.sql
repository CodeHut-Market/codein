-- Consolidated initial Supabase schema & policies
-- Generated on: 2025-09-24

-- 1. Extensions
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- 2. Tables
create table if not exists public.snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  code text not null,
  language text default 'plaintext',
  tags text[] default '{}',
  favorite_count integer not null default 0,
  search tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid references auth.users(id) on delete cascade,
  snippet_id uuid references public.snippets(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, snippet_id)
);

-- 3. Functions
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.snippets_search_tsvector()
returns trigger language plpgsql as $$
begin
  new.search :=
    setweight(to_tsvector('simple', coalesce(new.title,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.language,'')), 'C') ||
    setweight(to_tsvector('simple', array_to_string(new.tags,' ')), 'D');
  return new;
end;
$$;

create or replace function public.recalc_favorite_count(p_snippet uuid)
returns void language sql as $$
  update public.snippets s
     set favorite_count = coalesce(f.cnt, 0)
    from (
      select snippet_id, count(*) cnt
      from public.favorites
      where snippet_id = p_snippet
      group by snippet_id
    ) f
   where s.id = p_snippet;
$$;

create or replace function public.favorites_after_change()
returns trigger language plpgsql as $$
begin
  perform public.recalc_favorite_count(coalesce(new.snippet_id, old.snippet_id));
  return null;
end;
$$;

create or replace function public.snippet_with_favorite(p_snippet uuid, p_user uuid)
returns table (
  id uuid, title text, code text, language text, tags text[], favorite_count int,
  created_at timestamptz, updated_at timestamptz, is_favorite boolean
) language sql stable as $$
  select s.id, s.title, s.code, s.language, s.tags, s.favorite_count,
         s.created_at, s.updated_at,
         exists(
           select 1 from public.favorites f
           where f.snippet_id = s.id and f.user_id = p_user
         ) as is_favorite
  from public.snippets s
  where s.id = p_snippet;
$$;

-- 4. Triggers
-- Re-create triggers idempotently (use DROP IF EXISTS then CREATE TRIGGER)
drop trigger if exists trg_snippets_updated_at on public.snippets;
create trigger trg_snippets_updated_at
before update on public.snippets
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_snippets_search on public.snippets;
create trigger trg_snippets_search
before insert or update on public.snippets
for each row execute procedure public.snippets_search_tsvector();

drop trigger if exists trg_favorites_after on public.favorites;
create trigger trg_favorites_after
after insert or delete on public.favorites
for each row execute procedure public.favorites_after_change();

-- 5. Indexes
create index if not exists snippets_created_at_idx on public.snippets (created_at desc);
create index if not exists snippets_user_created_idx on public.snippets (user_id, created_at desc);
create index if not exists snippets_favcount_idx on public.snippets (favorite_count desc);
create index if not exists snippets_search_idx on public.snippets using gin (search);
create index if not exists favorites_snippet_idx on public.favorites (snippet_id);

-- 6. RLS
alter table public.snippets enable row level security;
alter table public.favorites enable row level security;

-- Policies: drop first because CREATE POLICY lacks IF NOT EXISTS
drop policy if exists "snippets_select_all" on public.snippets;
create policy "snippets_select_all"
  on public.snippets for select using ( true );
drop policy if exists "snippets_insert_auth" on public.snippets;
create policy "snippets_insert_auth"
  on public.snippets for insert with check ( auth.role() = 'authenticated' );
drop policy if exists "snippets_update_owner" on public.snippets;
create policy "snippets_update_owner"
  on public.snippets for update using ( auth.uid() = user_id ) with check ( auth.uid() = user_id );
drop policy if exists "snippets_delete_owner" on public.snippets;
create policy "snippets_delete_owner"
  on public.snippets for delete using ( auth.uid() = user_id );

drop policy if exists "favorites_select_all" on public.favorites;
create policy "favorites_select_all"
  on public.favorites for select using ( true );
drop policy if exists "favorites_insert_auth" on public.favorites;
create policy "favorites_insert_auth"
  on public.favorites for insert with check ( auth.role() = 'authenticated' );
drop policy if exists "favorites_delete_owner" on public.favorites;
create policy "favorites_delete_owner"
  on public.favorites for delete using ( auth.uid() = user_id );

-- 7. Optional daily counts objects
-- Materialized view: drop and recreate (IF NOT EXISTS not universally supported in older versions)
drop materialized view if exists public.snippet_daily_counts;
create materialized view public.snippet_daily_counts as
select date_trunc('day', created_at) as day, count(*) as count
from public.snippets group by 1 order by 1 desc;
create index if not exists snippet_daily_counts_day_idx on public.snippet_daily_counts(day desc);
create or replace function public.refresh_snippet_daily_counts()
returns void language sql security definer set search_path = public as $$
  refresh materialized view concurrently public.snippet_daily_counts;
$$;

-- End migration
