-- Create table for gift pages
CREATE TABLE public.gift_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  your_name TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  cover_photo_url TEXT,
  love_letter TEXT,
  soundtrack_name TEXT,
  soundtrack_url TEXT,
  spotify_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gift_pages ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone with the link can view)
CREATE POLICY "Anyone can view gift pages" 
ON public.gift_pages 
FOR SELECT 
USING (true);

-- Anyone can create gift pages (no auth required)
CREATE POLICY "Anyone can create gift pages" 
ON public.gift_pages 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster slug lookups
CREATE INDEX idx_gift_pages_slug ON public.gift_pages(slug);