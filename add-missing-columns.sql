-- Migration: Add missing columns to snippets table
-- Run this in your Supabase SQL Editor

-- Add missing columns (safe if they already exist)
ALTER TABLE public.snippets 
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' NOT NULL,
  ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false NOT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_snippets_category ON public.snippets(category);
CREATE INDEX IF NOT EXISTS idx_snippets_visibility ON public.snippets(visibility);
CREATE INDEX IF NOT EXISTS idx_snippets_featured ON public.snippets(featured);

-- Update existing rows to have default values (if any null values exist)
UPDATE public.snippets 
SET 
  visibility = COALESCE(visibility, 'public'),
  allow_comments = COALESCE(allow_comments, true),
  featured = COALESCE(featured, false)
WHERE visibility IS NULL OR allow_comments IS NULL OR featured IS NULL;

-- Verify the migration
SELECT 
  column_name, 
  data_type, 
  column_default, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'snippets'
ORDER BY ordinal_position;

-- Expected output should include:
-- category (text, nullable)
-- visibility (text, default 'public', not null)
-- allow_comments (boolean, default true, not null)
-- featured (boolean, default false, not null)
