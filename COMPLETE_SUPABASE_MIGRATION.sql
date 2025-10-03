-- COMPLETE MIGRATION SCRIPT FOR SUPABASE
-- Run this in Supabase SQL Editor
-- This script is idempotent and safe to run multiple times

-- ============================================
-- PART 1: Create Additional Tables
-- ============================================

-- Create snippet_likes table
CREATE TABLE IF NOT EXISTS snippet_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(snippet_id, user_id)
);

-- Create snippet_comments table
CREATE TABLE IF NOT EXISTS snippet_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES snippet_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL,
  followed_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, followed_id),
  CHECK (follower_id != followed_id)
);

-- ============================================
-- PART 2: Add Missing Columns to Snippets
-- ============================================

DO $$ 
BEGIN
  -- Add views column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='snippets' AND column_name='views') THEN
    ALTER TABLE snippets ADD COLUMN views BIGINT DEFAULT 0;
  END IF;
  
  -- Add likes column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='snippets' AND column_name='likes') THEN
    ALTER TABLE snippets ADD COLUMN likes BIGINT DEFAULT 0;
  END IF;
  
  -- Add user_id column if using different name
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='snippets' AND column_name='user_id') THEN
    -- Only add if author_id doesn't exist either
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='snippets' AND column_name='author_id') THEN
      ALTER TABLE snippets ADD COLUMN user_id UUID;
    END IF;
  END IF;
  
  -- Add is_public column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='snippets' AND column_name='is_public') THEN
    ALTER TABLE snippets ADD COLUMN is_public BOOLEAN DEFAULT true;
  END IF;
END $$;

-- ============================================
-- PART 3: Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_snippet_likes_snippet_id ON snippet_likes(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_likes_user_id ON snippet_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_snippet_comments_snippet_id ON snippet_comments(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_comments_user_id ON snippet_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_snippet_comments_parent_id ON snippet_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followed_id ON follows(followed_id);
CREATE INDEX IF NOT EXISTS idx_snippets_views ON snippets(views);
CREATE INDEX IF NOT EXISTS idx_snippets_likes ON snippets(likes);

-- ============================================
-- PART 4: Update Existing Data
-- ============================================

UPDATE snippets SET views = 0 WHERE views IS NULL;
UPDATE snippets SET likes = 0 WHERE likes IS NULL;
UPDATE snippets SET downloads = 0 WHERE downloads IS NULL;
UPDATE snippets SET is_public = true WHERE is_public IS NULL;

-- ============================================
-- PART 5: Create Functions
-- ============================================

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

-- ============================================
-- PART 6: Enable Row Level Security
-- ============================================

ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 7: Drop Old Policies (if they exist)
-- ============================================

DROP POLICY IF EXISTS "Users can view snippets for real-time" ON snippets;
DROP POLICY IF EXISTS "Users can view snippet likes for real-time" ON snippet_likes;
DROP POLICY IF EXISTS "Users can view snippet comments for real-time" ON snippet_comments;
DROP POLICY IF EXISTS "Users can view follows for real-time" ON follows;
DROP POLICY IF EXISTS "Users can manage their own likes" ON snippet_likes;
DROP POLICY IF EXISTS "Users can manage their own follows" ON follows;
DROP POLICY IF EXISTS "Users can insert their own comments" ON snippet_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON snippet_comments;

-- ============================================
-- PART 8: Create RLS Policies
-- ============================================

-- Policy for viewing snippets (public or owned)
CREATE POLICY "Users can view snippets for real-time" ON snippets
  FOR SELECT USING (
    visibility = 'public' OR 
    COALESCE(author_id::text, user_id::text) = auth.uid()::text
  );

-- Policy for viewing snippet likes
CREATE POLICY "Users can view snippet likes for real-time" ON snippet_likes
  FOR SELECT USING (true);

-- Policy for managing own likes
CREATE POLICY "Users can manage their own likes" ON snippet_likes
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Policy for viewing snippet comments
CREATE POLICY "Users can view snippet comments for real-time" ON snippet_comments
  FOR SELECT USING (true);

-- Policy for inserting own comments
CREATE POLICY "Users can insert their own comments" ON snippet_comments
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- Policy for deleting own comments
CREATE POLICY "Users can delete their own comments" ON snippet_comments
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- Policy for viewing follows
CREATE POLICY "Users can view follows for real-time" ON follows
  FOR SELECT USING (true);

-- Policy for managing own follows
CREATE POLICY "Users can manage their own follows" ON follows
  FOR ALL USING (follower_id::text = auth.uid()::text);

-- ============================================
-- PART 9: Grant Permissions
-- ============================================

GRANT EXECUTE ON FUNCTION increment_snippet_views TO authenticated;
GRANT EXECUTE ON FUNCTION increment_snippet_likes TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_snippet_likes TO authenticated;
GRANT EXECUTE ON FUNCTION increment_snippet_downloads TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify the migration worked:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'snippets';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'snippet_likes';
