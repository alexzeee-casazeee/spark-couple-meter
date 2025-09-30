-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('husband', 'wife');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role user_role NOT NULL,
  display_name TEXT NOT NULL,
  notification_time TIME DEFAULT '20:00:00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create couples table
CREATE TABLE public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  husband_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  wife_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(husband_id, wife_id)
);

-- Create invitations table
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  used_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily entries table
CREATE TABLE public.daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  horniness_level INTEGER CHECK (horniness_level >= 0 AND horniness_level <= 100),
  general_feeling INTEGER CHECK (general_feeling >= 0 AND general_feeling <= 100),
  sleep_quality INTEGER CHECK (sleep_quality >= 0 AND sleep_quality <= 100),
  emotional_state INTEGER CHECK (emotional_state >= 0 AND emotional_state <= 100),
  voice_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Couples policies
CREATE POLICY "Users can view couples they're part of"
  ON public.couples FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id IN (couples.husband_id, couples.wife_id)
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create couple records"
  ON public.couples FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id IN (husband_id, wife_id)
      AND profiles.user_id = auth.uid()
    )
  );

-- Invitations policies
CREATE POLICY "Users can view invitations they sent"
  ON public.invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = invitations.sender_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view valid invitations by token"
  ON public.invitations FOR SELECT
  USING (used_at IS NULL AND expires_at > NOW());

CREATE POLICY "Users can create invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = sender_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invitations they created"
  ON public.invitations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = invitations.sender_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Daily entries policies
CREATE POLICY "Users can view their own entries"
  ON public.daily_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = daily_entries.user_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can view each other's entries"
  ON public.daily_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.couples
      JOIN public.profiles p1 ON p1.id IN (couples.husband_id, couples.wife_id)
      JOIN public.profiles p2 ON p2.id IN (couples.husband_id, couples.wife_id)
      WHERE p1.id = daily_entries.user_id
      AND p2.user_id = auth.uid()
      AND couples.is_active = true
    )
  );

CREATE POLICY "Users can create their own entries"
  ON public.daily_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own entries"
  ON public.daily_entries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = daily_entries.user_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for daily_entries
CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON public.daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, display_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'husband'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();