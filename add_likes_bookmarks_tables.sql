-- Add missing snippet_likes and user_bookmarks tables
-- Run this separately to add the new tables to your existing database

-- Create snippet_likes table if it doesn't exist
create table if not exists public.snippet_likes (
    id uuid primary key default gen_random_uuid(),
    snippet_id uuid not null,
    user_id uuid not null,
    created_at timestamptz default now() not null,
    unique(snippet_id, user_id)
);

-- Add foreign key constraint if table was just created
do $$ 
begin
    if not exists (
        select 1 from information_schema.table_constraints 
        where constraint_name = 'snippet_likes_snippet_id_fkey'
        and table_name = 'snippet_likes'
    ) then
        alter table public.snippet_likes 
        add constraint snippet_likes_snippet_id_fkey 
        foreign key (snippet_id) references public.snippets(id) on delete cascade;
    end if;
end $$;

-- Create indexes for snippet_likes
create index if not exists idx_snippet_likes_snippet on public.snippet_likes(snippet_id);
create index if not exists idx_snippet_likes_user on public.snippet_likes(user_id);

-- Create user_bookmarks table if it doesn't exist
create table if not exists public.user_bookmarks (
    id uuid primary key default gen_random_uuid(),
    snippet_id uuid not null,
    user_id uuid not null,
    created_at timestamptz default now() not null,
    unique(snippet_id, user_id)
);

-- Add foreign key constraint if table was just created
do $$ 
begin
    if not exists (
        select 1 from information_schema.table_constraints 
        where constraint_name = 'user_bookmarks_snippet_id_fkey'
        and table_name = 'user_bookmarks'
    ) then
        alter table public.user_bookmarks 
        add constraint user_bookmarks_snippet_id_fkey 
        foreign key (snippet_id) references public.snippets(id) on delete cascade;
    end if;
end $$;

-- Create indexes for user_bookmarks
create index if not exists idx_user_bookmarks_snippet on public.user_bookmarks(snippet_id);
create index if not exists idx_user_bookmarks_user on public.user_bookmarks(user_id);

-- Enable Row Level Security
alter table public.snippet_likes enable row level security;
alter table public.user_bookmarks enable row level security;

-- Drop and recreate policies to avoid conflicts
drop policy if exists "public read snippet_likes" on public.snippet_likes;
create policy "public read snippet_likes" on public.snippet_likes for select using (true);

drop policy if exists "users can manage their own likes" on public.snippet_likes;
create policy "users can manage their own likes" on public.snippet_likes for all using (auth.uid() = user_id);

drop policy if exists "public read user_bookmarks" on public.user_bookmarks;
create policy "public read user_bookmarks" on public.user_bookmarks for select using (true);

drop policy if exists "users can manage their own bookmarks" on public.user_bookmarks;
create policy "users can manage their own bookmarks" on public.user_bookmarks for all using (auth.uid() = user_id);

-- Success message
do $$
begin
    raise notice 'Tables snippet_likes and user_bookmarks created successfully!';
end $$;
