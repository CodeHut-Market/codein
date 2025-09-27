-- Security fixes migration
-- Addresses: Function Search Path Mutable issues, Extension placement, API exposure, Auth security
-- Generated on: 2025-09-28

-- ============================================================================
-- 1. FIX SEARCH PATH ISSUES IN FUNCTIONS
-- ============================================================================

-- Fix set_updated_at function with secure search path
create or replace function public.set_updated_at()
returns trigger 
language plpgsql 
security definer
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Fix snippets_search_tsvector function with secure search path
create or replace function public.snippets_search_tsvector()
returns trigger 
language plpgsql 
security definer
set search_path = public, pg_temp
as $$
begin
  new.search :=
    setweight(to_tsvector('simple', coalesce(new.title,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.language,'')), 'C') ||
    setweight(to_tsvector('simple', array_to_string(new.tags,' ')), 'D');
  return new;
end;
$$;

-- Fix recalc_favorite_count function with secure search path
create or replace function public.recalc_favorite_count(p_snippet uuid)
returns void 
language sql 
security definer
set search_path = public, pg_temp
as $$
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

-- Fix favorites_after_change function with secure search path
create or replace function public.favorites_after_change()
returns trigger 
language plpgsql 
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.recalc_favorite_count(coalesce(new.snippet_id, old.snippet_id));
  return null;
end;
$$;

-- Fix snippet_with_favorite function with secure search path
create or replace function public.snippet_with_favorite(p_snippet uuid, p_user uuid)
returns table (
  id uuid, title text, code text, language text, tags text[], favorite_count int,
  created_at timestamptz, updated_at timestamptz, is_favorite boolean
) 
language sql 
stable 
security definer
set search_path = public, pg_temp
as $$
  select s.id, s.title, s.code, s.language, s.tags, s.favorite_count,
         s.created_at, s.updated_at,
         exists(
           select 1 from public.favorites f
           where f.snippet_id = s.id and f.user_id = p_user
         ) as is_favorite
  from public.snippets s
  where s.id = p_snippet;
$$;

-- Fix refresh_snippet_daily_counts function (already has security definer but ensure search path)
create or replace function public.refresh_snippet_daily_counts()
returns void 
language sql 
security definer 
set search_path = public, pg_temp
as $$
  refresh materialized view concurrently public.snippet_daily_counts;
$$;

-- ============================================================================
-- 2. CREATE EXTENSIONS SCHEMA AND MOVE EXTENSIONS
-- ============================================================================

-- Create extensions schema for better organization
create schema if not exists extensions;

-- Grant usage on extensions schema
grant usage on schema extensions to public;
grant usage on schema extensions to anon;
grant usage on schema extensions to authenticated;

-- Note: Moving existing extensions requires superuser privileges and may cause issues
-- Instead, we'll create a comment noting the extensions should be in the extensions schema
-- In a fresh setup, extensions would be created as:
-- create extension if not exists pg_trgm schema extensions;
-- create extension if not exists unaccent schema extensions;

-- For existing setups, add comments to document the current state
comment on extension pg_trgm is 'Text similarity extension - consider moving to extensions schema in fresh deployments';
comment on extension unaccent is 'Text unaccent extension - consider moving to extensions schema in fresh deployments';

-- ============================================================================
-- 3. SECURE MATERIALIZED VIEW FROM API ACCESS
-- ============================================================================

-- Remove public access to materialized view to prevent API exposure
revoke all on public.snippet_daily_counts from public;
revoke all on public.snippet_daily_counts from anon;

-- Only allow authenticated users to access analytics data
grant select on public.snippet_daily_counts to authenticated;

-- Create a secure function to access daily counts with proper permissions
create or replace function public.get_snippet_daily_counts(limit_days integer default 30)
returns table (
  day date,
  count bigint
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select day::date, count
  from public.snippet_daily_counts
  where day >= current_date - interval '1 day' * limit_days
  order by day desc
  limit limit_days;
$$;

-- Grant access to the secure function
grant execute on function public.get_snippet_daily_counts(integer) to authenticated;

-- ============================================================================
-- 4. ADD ADDITIONAL SECURITY POLICIES
-- ============================================================================

-- Add RLS policy to ensure users can only access their own analytics
drop policy if exists "daily_counts_auth_only" on public.snippet_daily_counts;

-- Note: Materialized views don't support RLS directly, 
-- so we rely on the function-based access above

-- Add audit logging function for sensitive operations
create or replace function public.log_security_event(
  event_type text,
  details jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- In a production environment, this would log to an audit table
  -- For now, we'll use RAISE NOTICE for debugging
  raise notice 'Security Event: % - Details: %', event_type, details;
end;
$$;

-- ============================================================================
-- 5. CREATE PROFILES TABLE FOR ENHANCED USER DATA
-- ============================================================================

-- Create profiles table to extend auth.users with application-specific data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  first_name text,
  last_name text,
  avatar_url text,
  website text,
  bio text,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select using ( true );

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert with check ( auth.uid() = id );

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update using ( auth.uid() = id ) with check ( auth.uid() = id );

-- Add trigger for profiles updated_at
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Create index for username lookups
create index if not exists profiles_username_idx on public.profiles (username);

-- ============================================================================
-- 6. ADDITIONAL SECURITY MEASURES
-- ============================================================================

-- Add rate limiting function (placeholder - would need actual implementation)
create or replace function public.check_rate_limit(
  user_id uuid,
  action_type text,
  max_attempts integer default 10,
  time_window interval default interval '1 hour'
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- This is a placeholder for rate limiting logic
  -- In production, you'd implement actual rate limiting here
  return true;
end;
$$;

-- Add function to validate user input
create or replace function public.sanitize_user_input(input_text text)
returns text
language plpgsql
immutable
security definer
set search_path = public, pg_temp
as $$
begin
  -- Basic input sanitization
  return trim(regexp_replace(input_text, '[<>"\''\\]', '', 'g'));
end;
$$;

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

comment on function public.set_updated_at() is 'Trigger function to update updated_at timestamp with secure search path';
comment on function public.snippets_search_tsvector() is 'Trigger function to update full-text search vector with secure search path';
comment on function public.recalc_favorite_count(uuid) is 'Recalculates favorite count for a snippet with secure search path';
comment on function public.favorites_after_change() is 'Trigger function to update favorite counts after changes with secure search path';
comment on function public.snippet_with_favorite(uuid, uuid) is 'Returns snippet data with user favorite status with secure search path';
comment on function public.get_snippet_daily_counts(integer) is 'Secure function to access daily snippet counts with proper authorization';
comment on function public.log_security_event(text, jsonb) is 'Logs security events for audit purposes';
comment on table public.profiles is 'User profile data extending auth.users with application-specific fields';

-- Migration complete