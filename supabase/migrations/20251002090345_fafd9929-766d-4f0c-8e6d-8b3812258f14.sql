-- Allow users to delete their own daily entries
CREATE POLICY "Users can delete their own entries"
ON public.daily_entries
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = daily_entries.user_id
    AND profiles.user_id = auth.uid()
  )
);