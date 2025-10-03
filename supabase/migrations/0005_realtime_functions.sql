-- Real-time optimistic update functions for Supabase
-- These functions help maintain data consistency for real-time updates

-- Function to increment snippet views
CREATE OR REPLACE FUNCTION increment_snippet_views(snippet_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE snippets 
  SET views = COALESCE(views, 0) + 1,
      updated_at = NOW()
  WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment snippet likes
CREATE OR REPLACE FUNCTION increment_snippet_likes(snippet_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE snippets 
  SET likes = COALESCE(likes, 0) + 1,
      updated_at = NOW()
  WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement snippet likes
CREATE OR REPLACE FUNCTION decrement_snippet_likes(snippet_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE snippets 
  SET likes = GREATEST(COALESCE(likes, 0) - 1, 0),
      updated_at = NOW()
  WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment snippet downloads
CREATE OR REPLACE FUNCTION increment_snippet_downloads(snippet_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE snippets 
  SET downloads = COALESCE(downloads, 0) + 1,
      updated_at = NOW()
  WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics with real-time data
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE(
  total_snippets BIGINT,
  total_views BIGINT,
  total_likes BIGINT,
  total_downloads BIGINT,
  total_followers BIGINT,
  avg_views_per_snippet NUMERIC,
  engagement_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(s.id) as total_snippets,
    COALESCE(SUM(s.views), 0) as total_views,
    COALESCE(SUM(s.likes), 0) as total_likes,
    COALESCE(SUM(s.downloads), 0) as total_downloads,
    (SELECT COUNT(*) FROM follows WHERE followed_id = user_id) as total_followers,
    CASE 
      WHEN COUNT(s.id) > 0 THEN ROUND(COALESCE(SUM(s.views), 0)::NUMERIC / COUNT(s.id), 2)
      ELSE 0 
    END as avg_views_per_snippet,
    CASE 
      WHEN COALESCE(SUM(s.views), 0) > 0 THEN ROUND((COALESCE(SUM(s.likes), 0)::NUMERIC / COALESCE(SUM(s.views), 0)) * 100, 2)
      ELSE 0 
    END as engagement_rate
  FROM snippets s
  WHERE s.user_id = get_user_stats.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security for real-time tables (only if tables exist)
DO $$ 
BEGIN
  -- Enable RLS on snippets
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'snippets') THEN
    ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on snippet_likes
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'snippet_likes') THEN
    ALTER TABLE snippet_likes ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on snippet_comments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'snippet_comments') THEN
    ALTER TABLE snippet_comments ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on follows
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'follows') THEN
    ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view snippets for real-time" ON snippets;
DROP POLICY IF EXISTS "Users can view snippet likes for real-time" ON snippet_likes;
DROP POLICY IF EXISTS "Users can view snippet comments for real-time" ON snippet_comments;
DROP POLICY IF EXISTS "Users can view follows for real-time" ON follows;
DROP POLICY IF EXISTS "Users can manage their own likes" ON snippet_likes;
DROP POLICY IF EXISTS "Users can manage their own follows" ON follows;
DROP POLICY IF EXISTS "Users can insert their own comments" ON snippet_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON snippet_comments;

-- Policies for real-time subscriptions (only create if tables exist)
DO $$ 
BEGIN
  -- Policy for viewing snippets
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'snippets') THEN
    EXECUTE 'CREATE POLICY "Users can view snippets for real-time" ON snippets
      FOR SELECT USING (
        visibility = ''public'' OR 
        author_id::text = auth.uid()::text
      )';
  END IF;
  
  -- Policy for viewing snippet likes
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'snippet_likes') THEN
    EXECUTE 'CREATE POLICY "Users can view snippet likes for real-time" ON snippet_likes
      FOR SELECT USING (true)';
    
    EXECUTE 'CREATE POLICY "Users can manage their own likes" ON snippet_likes
      FOR ALL USING (user_id::text = auth.uid()::text)';
  END IF;
  
  -- Policy for viewing snippet comments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'snippet_comments') THEN
    EXECUTE 'CREATE POLICY "Users can view snippet comments for real-time" ON snippet_comments
      FOR SELECT USING (true)';
    
    EXECUTE 'CREATE POLICY "Users can insert their own comments" ON snippet_comments
      FOR INSERT WITH CHECK (user_id::text = auth.uid()::text)';
    
    EXECUTE 'CREATE POLICY "Users can delete their own comments" ON snippet_comments
      FOR DELETE USING (user_id::text = auth.uid()::text)';
  END IF;
  
  -- Policy for viewing follows
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'follows') THEN
    EXECUTE 'CREATE POLICY "Users can view follows for real-time" ON follows
      FOR SELECT USING (true)';
    
    EXECUTE 'CREATE POLICY "Users can manage their own follows" ON follows
      FOR ALL USING (follower_id::text = auth.uid()::text)';
  END IF;
END $$;

-- Function to clean up old optimistic updates (can be called via cron)
CREATE OR REPLACE FUNCTION cleanup_optimistic_updates()
RETURNS VOID AS $$
BEGIN
  -- This is a placeholder for any cleanup logic needed
  -- Currently, optimistic updates are handled client-side
  -- But this function can be extended for server-side cleanup if needed
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_snippet_views TO authenticated;
GRANT EXECUTE ON FUNCTION increment_snippet_likes TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_snippet_likes TO authenticated;
GRANT EXECUTE ON FUNCTION increment_snippet_downloads TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_optimistic_updates TO authenticated;