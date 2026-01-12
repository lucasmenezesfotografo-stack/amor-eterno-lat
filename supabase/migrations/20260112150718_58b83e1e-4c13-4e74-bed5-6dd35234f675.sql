-- Add youtube_video_id column to gift_pages table
ALTER TABLE public.gift_pages 
ADD COLUMN youtube_video_id TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.gift_pages.youtube_video_id IS 'YouTube video ID for the soundtrack';