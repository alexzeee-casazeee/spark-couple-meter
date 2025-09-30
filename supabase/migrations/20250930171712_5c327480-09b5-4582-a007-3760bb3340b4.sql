-- Allow multiple entries per day by removing unique constraint on (user_id, entry_date)
ALTER TABLE public.daily_entries
  DROP CONSTRAINT IF EXISTS daily_entries_user_id_entry_date_key;

-- Optional: add a helpful index for querying latest entries per day
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date_created_at
  ON public.daily_entries (user_id, entry_date, created_at DESC);