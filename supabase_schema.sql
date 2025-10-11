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
    updated_at timestamptz default now() not null,
    -- Additional columns for advanced features
    category text,
    visibility text default 'public' not null,
    allow_comments boolean default true not null,
    featured boolean default false not null
);

-- New canonical indexes
create index if not exists idx_snippets_created_at on public.snippets(created_at desc);
create index if not exists idx_snippets_language on public.snippets(language);
create index if not exists idx_snippets_category on public.snippets(category);
create index if not exists idx_snippets_visibility on public.snippets(visibility);
create index if not exists idx_snippets_featured on public.snippets(featured);
-- Trigram extension (safe if already installed) needed for title gin_trgm_ops
create extension if not exists pg_trgm;
create index if not exists idx_snippets_title_trgm on public.snippets using gin (title gin_trgm_ops);

create table if not exists public.notifications (
    id uuid primary key,
    title text not null,
    message text not null,
    read boolean default false not null,
    created_at timestamptz default now() not null,
    user_id text default 'public'
);

create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);

-- Snippet likes table for tracking user likes
create table if not exists public.snippet_likes (
    id uuid primary key default gen_random_uuid(),
    snippet_id uuid not null references public.snippets(id) on delete cascade,
    user_id uuid not null,
    created_at timestamptz default now() not null,
    unique(snippet_id, user_id)
);

create index if not exists idx_snippet_likes_snippet on public.snippet_likes(snippet_id);
create index if not exists idx_snippet_likes_user on public.snippet_likes(user_id);

-- User bookmarks table for saving favorite snippets
create table if not exists public.user_bookmarks (
    id uuid primary key default gen_random_uuid(),
    snippet_id uuid not null references public.snippets(id) on delete cascade,
    user_id uuid not null,
    created_at timestamptz default now() not null,
    unique(snippet_id, user_id)
);

create index if not exists idx_user_bookmarks_snippet on public.user_bookmarks(snippet_id);
create index if not exists idx_user_bookmarks_user on public.user_bookmarks(user_id);

-- Optional: Row Level Security enablement (remove if not using auth yet)
alter table public.snippets enable row level security;
alter table public.notifications enable row level security;
alter table public.snippet_likes enable row level security;
alter table public.user_bookmarks enable row level security;

-- Example permissive policies (drop existing first to avoid conflicts):
drop policy if exists "public read snippets" on public.snippets;
create policy "public read snippets" on public.snippets for select using (true);

drop policy if exists "public read notifications" on public.notifications;
create policy "public read notifications" on public.notifications for select using (true);

drop policy if exists "public read snippet_likes" on public.snippet_likes;
create policy "public read snippet_likes" on public.snippet_likes for select using (true);

drop policy if exists "users can manage their own likes" on public.snippet_likes;
create policy "users can manage their own likes" on public.snippet_likes for all using (auth.uid() = user_id);

drop policy if exists "public read user_bookmarks" on public.user_bookmarks;
create policy "public read user_bookmarks" on public.user_bookmarks for select using (true);

drop policy if exists "users can manage their own bookmarks" on public.user_bookmarks;
create policy "users can manage their own bookmarks" on public.user_bookmarks for all using (auth.uid() = user_id);

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

-- Add new columns if they don't exist (for existing databases)
alter table public.snippets add column if not exists category text;
alter table public.snippets add column if not exists visibility text default 'public' not null;
alter table public.snippets add column if not exists allow_comments boolean default true not null;
alter table public.snippets add column if not exists featured boolean default false not null;

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
