-- Final Security Hardening Migration
-- Addresses: Extension placement, materialized view security, remaining vulnerabilities
-- Run this AFTER 0002_security_fixes.sql and 0003_auth_security.sql

-- 1. Handle existing pg_trgm dependencies before moving extension
-- First, drop dependent objects that use pg_trgm
DROP INDEX IF EXISTS idx_snippets_title_trgm;
DROP INDEX IF EXISTS idx_snippets_code_trgm;
DROP INDEX IF EXISTS idx_snippets_search_trgm;
DROP INDEX IF EXISTS idx_snippets_search_combined;

-- Drop any other potential text search indexes that use trigram operators
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE indexdef LIKE '%gin_trgm_ops%' OR indexdef LIKE '%gist_trgm_ops%'
    LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || rec.indexname;
        RAISE NOTICE 'Dropped trigram index: %', rec.indexname;
    END LOOP;
END;
$$;

-- Now create extensions schema and move extensions
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_trgm extension to extensions schema
DROP EXTENSION IF EXISTS pg_trgm CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

-- Move unaccent extension to extensions schema  
DROP EXTENSION IF EXISTS unaccent CASCADE;
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA extensions;

-- Update search path to include extensions schema
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Recreate the text search indexes with the extension in the new schema
CREATE INDEX IF NOT EXISTS idx_snippets_title_trgm ON public.snippets 
USING gin (title extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_snippets_code_trgm ON public.snippets 
USING gin (code extensions.gin_trgm_ops);

-- Create index for tags array using standard gin operator class
CREATE INDEX IF NOT EXISTS idx_snippets_tags_gin ON public.snippets 
USING gin (tags);

-- Create a simpler combined search index without array conversion
CREATE INDEX IF NOT EXISTS idx_snippets_search_combined ON public.snippets 
USING gin ((title || ' ' || code) extensions.gin_trgm_ops);

-- 2. Secure materialized views and remove from API exposure
-- Drop existing materialized view if it exists
DROP MATERIALIZED VIEW IF EXISTS api.snippet_stats;

-- Create secure materialized view in private schema
CREATE SCHEMA IF NOT EXISTS analytics;

-- Create the materialized view in analytics schema (not exposed via API)
CREATE MATERIALIZED VIEW analytics.snippet_stats AS
SELECT 
    s.id,
    s.title,
    s.language,
    s.user_id,
    s.favorite_count,
    s.created_at
FROM snippets s;

-- Create index on materialized view for performance
CREATE UNIQUE INDEX IF NOT EXISTS snippet_stats_id_idx ON analytics.snippet_stats (id);
CREATE INDEX IF NOT EXISTS snippet_stats_user_idx ON analytics.snippet_stats (user_id);
CREATE INDEX IF NOT EXISTS snippet_stats_language_idx ON analytics.snippet_stats (language);

-- 3. Create secure function to access snippet stats (with proper RLS)
CREATE OR REPLACE FUNCTION public.get_snippet_stats(snippet_id UUID DEFAULT NULL)
RETURNS TABLE(
    id UUID,
    title TEXT,
    language TEXT,
    user_id UUID,
    favorite_count BIGINT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, analytics
AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get current user
    current_user_id := auth.uid();
    
    -- Check if user is authenticated
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Return filtered results based on snippet ownership or public visibility
    IF snippet_id IS NOT NULL THEN
        -- Return specific snippet stats if user owns it or snippet is public
        RETURN QUERY
        SELECT 
            ss.id,
            ss.title,
            ss.language,
            ss.user_id,
            ss.favorite_count,
            ss.created_at
        FROM analytics.snippet_stats ss
        INNER JOIN public.snippets s ON ss.id = s.id
        WHERE ss.id = snippet_id
        AND (ss.user_id = current_user_id OR s.is_public = true);
    ELSE
        -- Return all accessible snippet stats
        RETURN QUERY
        SELECT 
            ss.id,
            ss.title,
            ss.language,
            ss.user_id,
            ss.favorite_count,
            ss.created_at
        FROM analytics.snippet_stats ss
        INNER JOIN public.snippets s ON ss.id = s.id
        WHERE (ss.user_id = current_user_id OR s.is_public = true);
    END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_snippet_stats(UUID) TO authenticated;

-- 4. Create function to refresh materialized view securely
CREATE OR REPLACE FUNCTION analytics.refresh_snippet_stats()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, analytics
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW analytics.snippet_stats;
END;
$$;

-- Grant execute permission only to service role
GRANT EXECUTE ON FUNCTION analytics.refresh_snippet_stats() TO service_role;

-- 5. Create scheduled job to refresh stats (requires pg_cron extension in production)
-- Note: This would typically be set up in Supabase dashboard or via pg_cron
-- SELECT cron.schedule('refresh-snippet-stats', '0 * * * *', 'SELECT analytics.refresh_snippet_stats();');

-- 6. Additional security hardening
-- Remove any remaining dangerous functions from public API
DROP FUNCTION IF EXISTS public.execute_sql(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.admin_function() CASCADE;
DROP FUNCTION IF EXISTS public.system_info() CASCADE;

-- 7. Audit existing permissions and remove excessive grants
-- Revoke all permissions from public schema for anonymous users on sensitive tables
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.notifications FROM anon;

-- Grant only necessary permissions to authenticated users
GRANT SELECT, INSERT ON public.snippets TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

-- 8. Create security audit function
CREATE OR REPLACE FUNCTION public.security_audit()
RETURNS TABLE(
    audit_type TEXT,
    object_name TEXT,
    permission_type TEXT,
    granted_to TEXT,
    risk_level TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'TABLE_PERMISSION'::TEXT as audit_type,
        schemaname || '.' || tablename as object_name,
        privilege_type,
        grantee,
        CASE 
            WHEN grantee = 'anon' AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE') THEN 'HIGH'
            WHEN grantee = 'authenticated' AND privilege_type = 'DELETE' AND schemaname = 'auth' THEN 'HIGH'
            WHEN grantee = 'public' THEN 'MEDIUM'
            ELSE 'LOW'
        END as risk_level
    FROM information_schema.table_privileges 
    WHERE schemaname IN ('public', 'auth', 'storage')
    
    UNION ALL
    
    SELECT 
        'FUNCTION_PERMISSION'::TEXT as audit_type,
        routine_schema || '.' || routine_name as object_name,
        'EXECUTE'::TEXT as permission_type,
        grantee,
        CASE 
            WHEN grantee = 'anon' AND routine_schema = 'auth' THEN 'HIGH'
            WHEN routine_name LIKE '%admin%' OR routine_name LIKE '%system%' THEN 'HIGH'
            ELSE 'LOW'
        END as risk_level
    FROM information_schema.routine_privileges
    WHERE routine_schema IN ('public', 'auth', 'analytics')
    
    ORDER BY risk_level DESC, audit_type, object_name;
END;
$$;

-- Grant execute permission only to service role for audit function
GRANT EXECUTE ON FUNCTION public.security_audit() TO service_role;

-- 9. Create database security configuration
CREATE OR REPLACE FUNCTION public.apply_security_config()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Note: Database-level logging parameters require superuser privileges
    -- These would typically be configured at the Supabase project level
    -- EXECUTE 'ALTER DATABASE ' || current_database() || ' SET log_statement = ''all''';
    -- EXECUTE 'ALTER DATABASE ' || current_database() || ' SET log_min_duration_statement = 1000';
    -- EXECUTE 'ALTER DATABASE ' || current_database() || ' SET log_checkpoints = on';
    -- EXECUTE 'ALTER DATABASE ' || current_database() || ' SET log_connections = on';
    -- EXECUTE 'ALTER DATABASE ' || current_database() || ' SET log_disconnections = on';
    -- EXECUTE 'ALTER DATABASE ' || current_database() || ' SET log_line_prefix = ''%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ''';
    
    -- Raise notice about completion
    RAISE NOTICE 'Security configuration function created successfully';
    RAISE NOTICE 'Database logging parameters should be configured at the Supabase project level';
END;
$$;

-- Apply security configuration
SELECT public.apply_security_config();

-- 10. Final verification queries (for manual review)
-- These are for information only and can be run manually to verify security

-- Check function search paths
-- SELECT routine_name, routine_schema, specific_name 
-- FROM information_schema.routines 
-- WHERE routine_schema IN ('public', 'auth', 'analytics')
-- ORDER BY routine_schema, routine_name;

-- Check materialized views
-- SELECT schemaname, matviewname, matviewowner 
-- FROM pg_matviews 
-- WHERE schemaname NOT IN ('information_schema', 'pg_catalog');

-- Check extensions
-- SELECT extname, extnamespace::regnamespace as schema 
-- FROM pg_extension 
-- WHERE extname IN ('pg_trgm', 'unaccent');

-- Run security audit
-- SELECT * FROM auth.security_audit() WHERE risk_level IN ('HIGH', 'MEDIUM');

-- Add comment for tracking
COMMENT ON SCHEMA analytics IS 'Private analytics schema - not exposed via API';
COMMENT ON SCHEMA extensions IS 'Schema for PostgreSQL extensions - isolated from public API';
COMMENT ON MATERIALIZED VIEW analytics.snippet_stats IS 'Secure snippet statistics - access via get_snippet_stats function only';

-- Create migration log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.migration_log (
    migration_name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration completion log
INSERT INTO public.migration_log (migration_name, applied_at) 
VALUES ('0004_final_security_hardening', NOW())
ON CONFLICT (migration_name) DO UPDATE SET applied_at = NOW();

-- Final completion notice (wrapped in DO block)
DO $$
BEGIN
    RAISE NOTICE 'Final security hardening migration completed successfully';
    RAISE NOTICE 'Extensions moved to dedicated schema with proper search path';
    RAISE NOTICE 'Text search indexes recreated with proper schema references';
    RAISE NOTICE 'Please run security audit: SELECT * FROM public.security_audit();';
    RAISE NOTICE 'Please verify extension placement: SELECT extname, extnamespace::regnamespace FROM pg_extension WHERE extname IN (''pg_trgm'', ''unaccent'');';
END;
$$;