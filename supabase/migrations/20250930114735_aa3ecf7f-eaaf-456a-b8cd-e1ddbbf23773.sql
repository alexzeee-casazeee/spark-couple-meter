-- Add notification frequency enum
CREATE TYPE public.notification_frequency AS ENUM ('once', 'twice', 'three_times');

-- Add notification frequency and additional time columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN notification_frequency notification_frequency DEFAULT 'once',
ADD COLUMN notification_time_2 time without time zone,
ADD COLUMN notification_time_3 time without time zone;