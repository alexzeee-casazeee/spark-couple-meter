-- Security-definer helper to check partnership without RLS recursion
CREATE OR REPLACE FUNCTION public.are_partners(target_profile_id uuid, requester_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM couples c
    JOIN profiles p1 ON (p1.id = c.husband_id OR p1.id = c.wife_id)
    JOIN profiles p2 ON (p2.id = c.husband_id OR p2.id = c.wife_id)
    WHERE c.is_active = true
      AND p1.id = target_profile_id
      AND p2.user_id = requester_user_id
  );
$$;

-- Replace profiles policy to avoid self-referencing recursion
DROP POLICY IF EXISTS "Partners can view each other's profiles" ON public.profiles;
CREATE POLICY "Partners can view each other's profiles"
ON public.profiles
FOR SELECT
USING (public.are_partners(profiles.id, auth.uid()));

-- Helper for entries visibility
CREATE OR REPLACE FUNCTION public.can_view_partner_entry(entry_user_profile_id uuid, requester_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.are_partners(entry_user_profile_id, requester_user_id);
$$;

-- Replace daily_entries partner visibility policy to use helper
DROP POLICY IF EXISTS "Partners can view each other's entries" ON public.daily_entries;
CREATE POLICY "Partners can view each other's entries"
ON public.daily_entries
FOR SELECT
USING (public.can_view_partner_entry(daily_entries.user_id, auth.uid()));