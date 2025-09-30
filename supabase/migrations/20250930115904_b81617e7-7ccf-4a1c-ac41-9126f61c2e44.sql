-- Update the handle_new_user function to better handle role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role user_role;
  user_display_name text;
BEGIN
  -- Extract role from metadata, default to 'husband' if not provided
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'husband');
  
  -- Extract display name from metadata, or use email prefix as fallback
  user_display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Insert the profile
  INSERT INTO public.profiles (user_id, role, display_name)
  VALUES (NEW.id, user_role, user_display_name);
  
  RETURN NEW;
END;
$function$;