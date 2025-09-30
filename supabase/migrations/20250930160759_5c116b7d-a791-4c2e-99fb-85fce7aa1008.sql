
-- Add RLS policy to allow partners to view each other's profiles
CREATE POLICY "Partners can view each other's profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM couples
    JOIN profiles p1 ON (p1.id = couples.husband_id OR p1.id = couples.wife_id)
    JOIN profiles p2 ON (p2.id = couples.husband_id OR p2.id = couples.wife_id)
    WHERE p1.id = profiles.id
      AND p2.user_id = auth.uid()
      AND couples.is_active = true
  )
);
