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

-- Enable Row Level Security for real-time tables
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Policies for real-time subscriptions
-- Allow users to read all public snippets and their own snippets
CREATE POLICY "Users can view snippets for real-time" ON snippets
  FOR SELECT USING (
    is_public = true OR 
    auth.uid() = user_id OR
    auth.uid() IN (SELECT follower_id FROM follows WHERE followed_id = user_id)
  );

-- Allow users to read snippet likes for real-time updates
CREATE POLICY "Users can view snippet likes for real-time" ON snippet_likes
  FOR SELECT USING (true);

-- Allow users to read snippet comments for real-time updates  
CREATE POLICY "Users can view snippet comments for real-time" ON snippet_comments
  FOR SELECT USING (true);

-- Allow users to read follows for real-time updates
CREATE POLICY "Users can view follows for real-time" ON follows
  FOR SELECT USING (true);

-- Allow users to insert/delete their own likes
CREATE POLICY "Users can manage their own likes" ON snippet_likes
  FOR ALL USING (auth.uid() = user_id);

-- Allow users to insert/delete their own follows
CREATE POLICY "Users can manage their own follows" ON follows
  FOR ALL USING (auth.uid() = follower_id);

-- Allow users to insert their own comments
CREATE POLICY "Users can insert their own comments" ON snippet_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments" ON snippet_comments
  FOR DELETE USING (auth.uid() = user_id);

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