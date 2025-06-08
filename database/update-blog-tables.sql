-- Add published column to blog_posts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name = 'published'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN published BOOLEAN DEFAULT true;
    END IF;
END $$;
