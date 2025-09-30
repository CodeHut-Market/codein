-- Enhanced Code Snippets Table Schema for Supabase
-- This creates all necessary tables and relationships for the code snippet sharing platform

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

-- Create snippets table with all required fields
CREATE TABLE IF NOT EXISTS public.snippets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    framework VARCHAR(50),
    category VARCHAR(50),
    tags TEXT[] DEFAULT '{}',
    
    -- Author information
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    
    -- Pricing and visibility
    price DECIMAL(10,2) DEFAULT 0.00,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    allow_comments BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    
    -- Stats and engagement
    downloads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    favorite_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table for user bookmarks
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, snippet_id)
);

-- Create snippet_views table for tracking views
CREATE TABLE IF NOT EXISTS public.snippet_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create snippet_likes table for tracking likes
CREATE TABLE IF NOT EXISTS public.snippet_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, snippet_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.snippet_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.snippet_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create downloads table for tracking purchases/downloads
CREATE TABLE IF NOT EXISTS public.snippet_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    price_paid DECIMAL(10,2) DEFAULT 0.00,
    download_type VARCHAR(20) DEFAULT 'free' CHECK (download_type IN ('free', 'paid')),
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200),
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    avatar_url VARCHAR(500),
    
    -- Coding preferences
    primary_language VARCHAR(50),
    interests TEXT[],
    experience_level VARCHAR(20),
    goals TEXT[],
    
    -- Privacy and notification settings
    email_notifications BOOLEAN DEFAULT true,
    browser_notifications BOOLEAN DEFAULT true,
    weekly_digest BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private')),
    show_email BOOLEAN DEFAULT false,
    
    -- Stats
    total_snippets INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    reputation_score INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_snippets_author_id ON public.snippets(author_id);
CREATE INDEX IF NOT EXISTS idx_snippets_language ON public.snippets(language);
CREATE INDEX IF NOT EXISTS idx_snippets_category ON public.snippets(category);
CREATE INDEX IF NOT EXISTS idx_snippets_visibility ON public.snippets(visibility);
CREATE INDEX IF NOT EXISTS idx_snippets_created_at ON public.snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_downloads ON public.snippets(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_likes ON public.snippets(likes DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_rating ON public.snippets(rating DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_featured ON public.snippets(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_snippets_tags ON public.snippets USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_snippet_id ON public.favorites(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_views_snippet_id ON public.snippet_views(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_likes_snippet_id ON public.snippet_likes(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_likes_user_id ON public.snippet_likes(user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_snippets_updated_at 
    BEFORE UPDATE ON public.snippets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snippet_comments_updated_at 
    BEFORE UPDATE ON public.snippet_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions to update snippet stats
CREATE OR REPLACE FUNCTION update_snippet_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update likes count
        IF TG_TABLE_NAME = 'snippet_likes' THEN
            UPDATE public.snippets 
            SET likes = likes + 1 
            WHERE id = NEW.snippet_id;
        END IF;
        
        -- Update favorite count
        IF TG_TABLE_NAME = 'favorites' THEN
            UPDATE public.snippets 
            SET favorite_count = favorite_count + 1 
            WHERE id = NEW.snippet_id;
        END IF;
        
        -- Update download count
        IF TG_TABLE_NAME = 'snippet_downloads' THEN
            UPDATE public.snippets 
            SET downloads = downloads + 1 
            WHERE id = NEW.snippet_id;
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update likes count
        IF TG_TABLE_NAME = 'snippet_likes' THEN
            UPDATE public.snippets 
            SET likes = likes - 1 
            WHERE id = OLD.snippet_id;
        END IF;
        
        -- Update favorite count  
        IF TG_TABLE_NAME = 'favorites' THEN
            UPDATE public.snippets 
            SET favorite_count = favorite_count - 1 
            WHERE id = OLD.snippet_id;
        END IF;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for automatic stats updates
CREATE TRIGGER snippet_likes_stats_trigger
    AFTER INSERT OR DELETE ON public.snippet_likes
    FOR EACH ROW EXECUTE FUNCTION update_snippet_stats();

CREATE TRIGGER favorites_stats_trigger
    AFTER INSERT OR DELETE ON public.favorites
    FOR EACH ROW EXECUTE FUNCTION update_snippet_stats();

CREATE TRIGGER downloads_stats_trigger
    AFTER INSERT ON public.snippet_downloads
    FOR EACH ROW EXECUTE FUNCTION update_snippet_stats();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Snippets policies
CREATE POLICY "Public snippets are viewable by everyone" ON public.snippets
    FOR SELECT USING (visibility = 'public' OR visibility = 'unlisted');

CREATE POLICY "Users can view their own snippets" ON public.snippets
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can insert their own snippets" ON public.snippets
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own snippets" ON public.snippets
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own snippets" ON public.snippets
    FOR DELETE USING (auth.uid() = author_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Snippet likes policies
CREATE POLICY "Anyone can view snippet likes" ON public.snippet_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON public.snippet_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON public.snippet_likes
    FOR DELETE USING (auth.uid() = user_id);

-- User profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
    FOR SELECT USING (profile_visibility = 'public');

CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Comments policies
CREATE POLICY "Anyone can view comments on public snippets" ON public.snippet_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.snippets 
            WHERE snippets.id = snippet_comments.snippet_id 
            AND (snippets.visibility = 'public' OR snippets.author_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert comments on public snippets" ON public.snippet_comments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.snippets 
            WHERE snippets.id = snippet_comments.snippet_id 
            AND snippets.visibility = 'public'
            AND snippets.allow_comments = true
        )
    );

CREATE POLICY "Users can update their own comments" ON public.snippet_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.snippet_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Views policies (allow all for analytics)
CREATE POLICY "Anyone can insert views" ON public.snippet_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Snippet owners can view their snippet views" ON public.snippet_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.snippets 
            WHERE snippets.id = snippet_views.snippet_id 
            AND snippets.author_id = auth.uid()
        )
    );

-- Downloads policies
CREATE POLICY "Users can view their own downloads" ON public.snippet_downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own downloads" ON public.snippet_downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (
        id, 
        username, 
        first_name, 
        last_name, 
        full_name,
        bio,
        location,
        website,
        primary_language,
        interests,
        experience_level,
        goals,
        email_notifications,
        browser_notifications,
        weekly_digest,
        marketing_emails,
        profile_visibility,
        show_email
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'bio',
        NEW.raw_user_meta_data->>'location',
        NEW.raw_user_meta_data->>'website',
        NEW.raw_user_meta_data->>'primary_language',
        CASE 
            WHEN NEW.raw_user_meta_data->>'interests' IS NOT NULL 
            THEN string_to_array(NEW.raw_user_meta_data->>'interests', ',')
            ELSE '{}'::text[]
        END,
        NEW.raw_user_meta_data->>'experience_level',
        CASE 
            WHEN NEW.raw_user_meta_data->>'goals' IS NOT NULL 
            THEN string_to_array(NEW.raw_user_meta_data->>'goals', ',')
            ELSE '{}'::text[]
        END,
        COALESCE((NEW.raw_user_meta_data->>'emailNotifications')::boolean, true),
        COALESCE((NEW.raw_user_meta_data->>'browserNotifications')::boolean, true),
        COALESCE((NEW.raw_user_meta_data->>'weeklyDigest')::boolean, true),
        COALESCE((NEW.raw_user_meta_data->>'marketingEmails')::boolean, false),
        COALESCE(NEW.raw_user_meta_data->>'profileVisibility', 'public'),
        COALESCE((NEW.raw_user_meta_data->>'showEmail')::boolean, false)
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create helpful views for common queries
CREATE OR REPLACE VIEW public.snippets_with_stats AS
SELECT 
    s.*,
    up.username as author_username,
    up.avatar_url as author_avatar,
    up.reputation_score as author_reputation,
    COUNT(DISTINCT sl.id) as total_likes,
    COUNT(DISTINCT f.id) as total_favorites,
    COUNT(DISTINCT sv.id) as total_views,
    COUNT(DISTINCT sd.id) as total_downloads
FROM public.snippets s
LEFT JOIN public.user_profiles up ON s.author_id = up.id
LEFT JOIN public.snippet_likes sl ON s.id = sl.snippet_id
LEFT JOIN public.favorites f ON s.id = f.snippet_id
LEFT JOIN public.snippet_views sv ON s.id = sv.snippet_id
LEFT JOIN public.snippet_downloads sd ON s.id = sd.snippet_id
GROUP BY s.id, up.username, up.avatar_url, up.reputation_score;

-- Create view for trending snippets
CREATE OR REPLACE VIEW public.trending_snippets AS
SELECT 
    *,
    (likes * 2 + downloads * 3 + views * 0.1 + favorite_count * 1.5) as trending_score
FROM public.snippets_with_stats
WHERE visibility = 'public'
    AND created_at > NOW() - INTERVAL '30 days'
ORDER BY trending_score DESC;

-- Create comprehensive search function
CREATE OR REPLACE FUNCTION search_snippets(
    search_query TEXT DEFAULT NULL,
    filter_language TEXT DEFAULT NULL,
    filter_category TEXT DEFAULT NULL,
    filter_tags TEXT[] DEFAULT NULL,
    sort_by TEXT DEFAULT 'created_at',
    sort_order TEXT DEFAULT 'DESC',
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    code TEXT,
    language VARCHAR(50),
    framework VARCHAR(50),
    category VARCHAR(50),
    tags TEXT[],
    author VARCHAR(100),
    author_id UUID,
    price DECIMAL(10,2),
    visibility VARCHAR(20),
    downloads INTEGER,
    likes INTEGER,
    views INTEGER,
    rating DECIMAL(3,2),
    favorite_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    author_username VARCHAR(50),
    author_avatar VARCHAR(500),
    total_likes BIGINT,
    total_favorites BIGINT,
    total_views BIGINT,
    total_downloads BIGINT,
    trending_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.snippets_with_stats s
    WHERE s.visibility = 'public'
        AND (search_query IS NULL OR (
            s.title ILIKE '%' || search_query || '%' OR
            s.description ILIKE '%' || search_query || '%' OR
            s.author ILIKE '%' || search_query || '%' OR
            EXISTS (SELECT 1 FROM unnest(s.tags) tag WHERE tag ILIKE '%' || search_query || '%')
        ))
        AND (filter_language IS NULL OR s.language = filter_language)
        AND (filter_category IS NULL OR s.category = filter_category)
        AND (filter_tags IS NULL OR s.tags && filter_tags)
    ORDER BY 
        CASE WHEN sort_by = 'created_at' AND sort_order = 'DESC' THEN s.created_at END DESC,
        CASE WHEN sort_by = 'created_at' AND sort_order = 'ASC' THEN s.created_at END ASC,
        CASE WHEN sort_by = 'downloads' AND sort_order = 'DESC' THEN s.downloads END DESC,
        CASE WHEN sort_by = 'downloads' AND sort_order = 'ASC' THEN s.downloads END ASC,
        CASE WHEN sort_by = 'likes' AND sort_order = 'DESC' THEN s.likes END DESC,
        CASE WHEN sort_by = 'likes' AND sort_order = 'ASC' THEN s.likes END ASC,
        CASE WHEN sort_by = 'rating' AND sort_order = 'DESC' THEN s.rating END DESC,
        CASE WHEN sort_by = 'rating' AND sort_order = 'ASC' THEN s.rating END ASC,
        CASE WHEN sort_by = 'trending' THEN (s.likes * 2 + s.downloads * 3 + s.views * 0.1 + s.favorite_count * 1.5) END DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;