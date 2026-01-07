-- Add user_id to gift_pages to link pages to their creators
ALTER TABLE public.gift_pages 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_gift_pages_user_id ON public.gift_pages(user_id);

-- Add policy for users to update their own pages
CREATE POLICY "Users can update their own gift pages"
ON public.gift_pages
FOR UPDATE
USING (auth.uid() = user_id);

-- Add policy for users to delete their own pages
CREATE POLICY "Users can delete their own gift pages"
ON public.gift_pages
FOR DELETE
USING (auth.uid() = user_id);