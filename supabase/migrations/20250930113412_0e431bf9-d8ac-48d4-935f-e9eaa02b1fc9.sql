-- Fix the INSERT policy for daily_entries
DROP POLICY IF EXISTS "Users can create their own entries" ON public.daily_entries;

CREATE POLICY "Users can create their own entries"
  ON public.daily_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = daily_entries.user_id
      AND profiles.user_id = auth.uid()
    )
  );