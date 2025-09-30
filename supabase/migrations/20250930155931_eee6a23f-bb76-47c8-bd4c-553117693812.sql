-- Create pokes table to track when users poke their partner
CREATE TABLE public.pokes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  poker_id UUID NOT NULL REFERENCES public.profiles(id),
  poked_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pokes
ALTER TABLE public.pokes ENABLE ROW LEVEL SECURITY;

-- RLS policies for pokes
CREATE POLICY "Users can view pokes they're involved in"
ON public.pokes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE (profiles.id = pokes.poker_id OR profiles.id = pokes.poked_id)
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create pokes for their partner"
ON public.pokes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.couples
    JOIN public.profiles p ON p.id = pokes.poker_id
    WHERE couples.id = pokes.couple_id
    AND p.user_id = auth.uid()
    AND (couples.husband_id = pokes.poker_id OR couples.wife_id = pokes.poker_id)
    AND (couples.husband_id = pokes.poked_id OR couples.wife_id = pokes.poked_id)
    AND couples.is_active = true
  )
);