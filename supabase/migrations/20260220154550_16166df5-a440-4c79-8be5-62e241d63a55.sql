
-- Add expires_at column for draft expiration (24h cleanup)
ALTER TABLE public.gift_pages 
ADD COLUMN IF NOT EXISTS expires_at timestamptz DEFAULT (now() + interval '24 hours');

-- Add stripe_payment_intent_id for payment tracking
ALTER TABLE public.gift_pages 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

-- Add paid_at for tracking when payment was made
ALTER TABLE public.gift_pages 
ADD COLUMN IF NOT EXISTS paid_at timestamptz;
