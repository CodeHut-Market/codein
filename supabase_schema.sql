-- Supabase / Postgres schema for CodeHut core features

-- NOTE: Canonical schema now uses snake_case column names. Migration helpers below
create table if not exists public.snippets (
    id uuid primary key,
    title text not null,
    code text not null,
    description text default '' not null,
    price numeric default 0 not null,
    rating int default 0 not null,
    author text not null,
    author_id text not null,
    tags text[] default '{}'::text[] not null,
    language text not null,
    framework text,
    downloads int default 0 not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- New canonical indexes
create index if not exists idx_snippets_created_at on public.snippets(created_at desc);
create index if not exists idx_snippets_language on public.snippets(language);
-- Trigram extension (safe if already installed) needed for title gin_trgm_ops
create extension if not exists pg_trgm;
create index if not exists idx_snippets_title_trgm on public.snippets using gin (title gin_trgm_ops);

create table if not exists public.notifications (
    id uuid primary key,
    title text not null,
    message text not null,
    read boolean default false not null,
    createdAt timestamptz default now() not null,
    userId text default 'public'
);

create index if not exists idx_notifications_user on public.notifications(userId, createdAt desc);

Optional: Row Level Security enablement (remove if not using auth yet)
alter table public.snippets enable row level security;
alter table public.notifications enable row level security;
Example permissive policies:
create policy "public read snippets" on public.snippets for select using (true);
create policy "public read notifications" on public.notifications for select using (true);

-- To apply: run in Supabase SQL editor or psql client.

--------------------------------------------------------------------------------
-- Migration Section: Standardize existing camelCase columns to snake_case (idempotent)
-- Run AFTER existing data creation if your earlier schema used camelCase names.
-- Each RENAME only executes if the camelCase column still exists.
--------------------------------------------------------------------------------
do $$ begin
    -- Snippets table column renames
    if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name='snippets' and column_name='createdAt') then
        execute 'alter table public.snippets rename column "createdAt" to created_at';
    end if;
    if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name='snippets' and column_name='updatedAt') then
        execute 'alter table public.snippets rename column "updatedAt" to updated_at';
    end if;
    if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name='snippets' and column_name='authorId') then
        execute 'alter table public.snippets rename column "authorId" to author_id';
    end if;
end $$;

-- Ensure downloads column exists (legacy tables might have lacked it)
alter table public.snippets add column if not exists downloads int default 0 not null;

-- Replace old createdAt index if it exists (legacy name)
drop index if exists idx_snippets_createdat; -- old index on createdAt
create index if not exists idx_snippets_created_at on public.snippets(created_at desc);

-- (Optional) Recreate trigram index (safe / idempotent)
create extension if not exists pg_trgm;
create index if not exists idx_snippets_title_trgm on public.snippets using gin (title gin_trgm_ops);

-- End migration section
--------------------------------------------------------------------------------
-- Notifications table migration: normalize columns to snake_case (idempotent)
--------------------------------------------------------------------------------
do $$ begin
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='notifications' and column_name='createdAt') then
        execute 'alter table public.notifications rename column "createdAt" to created_at';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='notifications' and column_name='userId') then
        execute 'alter table public.notifications rename column "userId" to user_id';
    end if;
end $$;

-- Recreate user index with new names; drop legacy if present
drop index if exists idx_notifications_user; -- old camelCase version
create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);
