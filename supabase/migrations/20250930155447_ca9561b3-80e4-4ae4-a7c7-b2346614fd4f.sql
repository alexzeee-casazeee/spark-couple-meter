-- Create custom_dimensions table for couples to define their own tracking dimensions
CREATE TABLE public.custom_dimensions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  dimension_name TEXT NOT NULL,
  created_by_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_dimension_per_couple UNIQUE(couple_id, dimension_name)
);

-- Create custom_dimension_entries table to store values for custom dimensions
CREATE TABLE public.custom_dimension_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID NOT NULL REFERENCES public.daily_entries(id) ON DELETE CASCADE,
  dimension_id UUID NOT NULL REFERENCES public.custom_dimensions(id) ON DELETE CASCADE,
  value INTEGER CHECK (value >= 1 AND value <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_dimension_per_entry UNIQUE(entry_id, dimension_id)
);

-- Enable RLS on custom_dimensions
ALTER TABLE public.custom_dimensions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on custom_dimension_entries
ALTER TABLE public.custom_dimension_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies for custom_dimensions
CREATE POLICY "Couples can view their custom dimensions"
ON public.custom_dimensions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couples
    JOIN public.profiles p ON (p.id = couples.husband_id OR p.id = couples.wife_id)
    WHERE couples.id = custom_dimensions.couple_id
    AND p.user_id = auth.uid()
    AND couples.is_active = true
  )
);

CREATE POLICY "Couples can create custom dimensions"
ON public.custom_dimensions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.couples
    JOIN public.profiles p ON (p.id = couples.husband_id OR p.id = couples.wife_id)
    WHERE couples.id = custom_dimensions.couple_id
    AND p.user_id = auth.uid()
    AND couples.is_active = true
  )
);

CREATE POLICY "Couples can delete their custom dimensions"
ON public.custom_dimensions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.couples
    JOIN public.profiles p ON (p.id = couples.husband_id OR p.id = couples.wife_id)
    WHERE couples.id = custom_dimensions.couple_id
    AND p.user_id = auth.uid()
    AND couples.is_active = true
  )
);

-- RLS policies for custom_dimension_entries
CREATE POLICY "Users can view custom dimension entries for their entries"
ON public.custom_dimension_entries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.daily_entries de
    JOIN public.profiles p ON p.id = de.user_id
    WHERE de.id = custom_dimension_entries.entry_id
    AND p.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.daily_entries de
    JOIN public.profiles p1 ON p1.id = de.user_id
    JOIN public.couples ON (couples.husband_id = p1.id OR couples.wife_id = p1.id)
    JOIN public.profiles p2 ON (couples.husband_id = p2.id OR couples.wife_id = p2.id)
    WHERE de.id = custom_dimension_entries.entry_id
    AND p2.user_id = auth.uid()
    AND couples.is_active = true
  )
);

CREATE POLICY "Users can create custom dimension entries for their own entries"
ON public.custom_dimension_entries
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.daily_entries de
    JOIN public.profiles p ON p.id = de.user_id
    WHERE de.id = custom_dimension_entries.entry_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update custom dimension entries for their own entries"
ON public.custom_dimension_entries
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.daily_entries de
    JOIN public.profiles p ON p.id = de.user_id
    WHERE de.id = custom_dimension_entries.entry_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete custom dimension entries for their own entries"
ON public.custom_dimension_entries
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.daily_entries de
    JOIN public.profiles p ON p.id = de.user_id
    WHERE de.id = custom_dimension_entries.entry_id
    AND p.user_id = auth.uid()
  )
);