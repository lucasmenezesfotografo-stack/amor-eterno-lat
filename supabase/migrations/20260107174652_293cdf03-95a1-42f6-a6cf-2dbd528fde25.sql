-- Create storage bucket for gift photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-photos', 'gift-photos', true);

-- Allow anyone to view gift photos (public bucket)
CREATE POLICY "Anyone can view gift photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gift-photos');

-- Allow anyone to upload gift photos (for creation flow)
CREATE POLICY "Anyone can upload gift photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'gift-photos');

-- Allow anyone to update their uploaded photos
CREATE POLICY "Anyone can update gift photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'gift-photos');

-- Allow anyone to delete gift photos
CREATE POLICY "Anyone can delete gift photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'gift-photos');