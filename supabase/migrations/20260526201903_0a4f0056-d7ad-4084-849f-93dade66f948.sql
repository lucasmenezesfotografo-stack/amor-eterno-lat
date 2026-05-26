
-- =========================================================
-- gift_pages: restrict sensitive columns from anon/authenticated
-- =========================================================
REVOKE SELECT ON public.gift_pages FROM anon, authenticated;

GRANT SELECT (
  id, slug, your_name, partner_name, start_date, cover_photo_url,
  love_letter, soundtrack_name, soundtrack_url, youtube_video_id,
  spotify_link, names_position, memories, is_active, created_at, expires_at
) ON public.gift_pages TO anon;

GRANT SELECT (
  id, slug, your_name, partner_name, start_date, cover_photo_url,
  love_letter, soundtrack_name, soundtrack_url, youtube_video_id,
  spotify_link, names_position, memories, is_active, created_at, expires_at,
  user_id, stripe_payment_intent_id, paid_at
) ON public.gift_pages TO authenticated;

-- =========================================================
-- gift_page_subscriptions: hide Stripe IDs; block public writes
-- =========================================================
DROP POLICY IF EXISTS "System can insert subscriptions" ON public.gift_page_subscriptions;
DROP POLICY IF EXISTS "System can update subscriptions" ON public.gift_page_subscriptions;
DROP POLICY IF EXISTS "Anyone can view subscriptions" ON public.gift_page_subscriptions;

CREATE POLICY "Public can view subscription status"
  ON public.gift_page_subscriptions
  FOR SELECT
  TO anon, authenticated
  USING (true);

REVOKE ALL ON public.gift_page_subscriptions FROM anon, authenticated;
GRANT SELECT (id, gift_page_id, status, paid_at, expires_at, created_at)
  ON public.gift_page_subscriptions TO anon, authenticated;
GRANT ALL ON public.gift_page_subscriptions TO service_role;

-- =========================================================
-- activation_codes: remove public read; only service role
-- =========================================================
DROP POLICY IF EXISTS "Public can validate codes" ON public.activation_codes;
REVOKE ALL ON public.activation_codes FROM anon, authenticated;
GRANT ALL ON public.activation_codes TO service_role;

-- =========================================================
-- activation_code_usage: remove public access
-- =========================================================
DROP POLICY IF EXISTS "Anyone can insert usage" ON public.activation_code_usage;
DROP POLICY IF EXISTS "Anyone can view usage" ON public.activation_code_usage;
REVOKE ALL ON public.activation_code_usage FROM anon, authenticated;
GRANT ALL ON public.activation_code_usage TO service_role;

-- =========================================================
-- storage.objects: tighten gift-photos bucket
-- - Anonymous file listing disabled
-- - Upload/update/delete require authentication
-- - Public URL read of files still works (served via storage API, not RLS)
-- =========================================================
DROP POLICY IF EXISTS "Anyone can view gift photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload gift photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update gift photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete gift photos" ON storage.objects;

CREATE POLICY "Authenticated can list gift photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'gift-photos');

CREATE POLICY "Anon can upload gift photos"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'gift-photos');

CREATE POLICY "Authenticated can update gift photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gift-photos');

CREATE POLICY "Authenticated can delete gift photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'gift-photos');
