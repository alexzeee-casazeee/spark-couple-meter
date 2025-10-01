-- Add communication_desire column to daily_entries table
ALTER TABLE public.daily_entries 
ADD COLUMN IF NOT EXISTS communication_desire integer;

COMMENT ON COLUMN public.daily_entries.communication_desire IS 'User desire for communication level (0-100)';