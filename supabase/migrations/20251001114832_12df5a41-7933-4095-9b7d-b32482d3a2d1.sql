-- Add trial and subscription tracking to profiles
ALTER TABLE public.profiles
ADD COLUMN trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN subscription_status TEXT DEFAULT 'trial',
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT;

-- Create index for faster lookups
CREATE INDEX idx_profiles_subscription_status ON public.profiles(subscription_status);

COMMENT ON COLUMN public.profiles.trial_start_date IS 'Date when user trial started';
COMMENT ON COLUMN public.profiles.subscription_status IS 'Subscription status: trial, active, canceled, expired';
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe customer ID';
COMMENT ON COLUMN public.profiles.stripe_subscription_id IS 'Stripe subscription ID';