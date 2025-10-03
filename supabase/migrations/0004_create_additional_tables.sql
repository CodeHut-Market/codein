-- Create additional tables for real-time features
-- This migration should run BEFORE 0005_realtime_functions.sql

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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_snippet_likes_snippet_id ON snippet_likes(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_likes_user_id ON snippet_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_snippet_comments_snippet_id ON snippet_comments(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_comments_user_id ON snippet_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_snippet_comments_parent_id ON snippet_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followed_id ON follows(followed_id);

-- Add views, likes, downloads columns to snippets if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='snippets' AND column_name='views') THEN
    ALTER TABLE snippets ADD COLUMN views BIGINT DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='snippets' AND column_name='likes') THEN
    ALTER TABLE snippets ADD COLUMN likes BIGINT DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='snippets' AND column_name='downloads') THEN
    ALTER TABLE snippets ADD COLUMN downloads BIGINT DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='snippets' AND column_name='user_id') THEN
    ALTER TABLE snippets ADD COLUMN user_id UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='snippets' AND column_name='is_public') THEN
    ALTER TABLE snippets ADD COLUMN is_public BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Create indexes on new columns
CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_is_public ON snippets(is_public);
CREATE INDEX IF NOT EXISTS idx_snippets_views ON snippets(views);
CREATE INDEX IF NOT EXISTS idx_snippets_likes ON snippets(likes);
CREATE INDEX IF NOT EXISTS idx_snippets_downloads ON snippets(downloads);

-- Update existing snippets to have default values
UPDATE snippets SET views = 0 WHERE views IS NULL;
UPDATE snippets SET likes = 0 WHERE likes IS NULL;
UPDATE snippets SET downloads = 0 WHERE downloads IS NULL;
UPDATE snippets SET is_public = true WHERE is_public IS NULL;
