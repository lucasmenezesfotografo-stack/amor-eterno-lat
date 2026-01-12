-- Add memories column to gift_pages table
ALTER TABLE public.gift_pages 
ADD COLUMN memories jsonb DEFAULT '[]'::jsonb;

-- Add a check constraint to limit to 4 memories
ALTER TABLE public.gift_pages 
ADD CONSTRAINT memories_max_4 CHECK (jsonb_array_length(COALESCE(memories, '[]'::jsonb)) <= 4);