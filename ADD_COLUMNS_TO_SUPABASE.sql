-- SQL script to add missing columns to the snippets table in Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/lapgjnimnkyyxeltzcxw/sql

-- Add visibility column
ALTER TABLE snippets 
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private'));

-- Add allow_comments column
ALTER TABLE snippets 
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true;

-- Add featured column (optional, but will stop the 400 errors for featured queries)
ALTER TABLE snippets 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_snippets_visibility ON snippets(visibility);
CREATE INDEX IF NOT EXISTS idx_snippets_featured ON snippets(featured);

-- Verify the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'snippets' 
AND column_name IN ('visibility', 'allow_comments', 'featured')
ORDER BY column_name;
