-- Create olive_branch_messages table
CREATE TABLE public.olive_branch_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.olive_branch_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create messages for their partner
CREATE POLICY "Users can create messages for their partner"
ON public.olive_branch_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM couples c
    JOIN profiles p ON (p.id = sender_id)
    WHERE c.id = couple_id
      AND p.user_id = auth.uid()
      AND c.is_active = true
      AND ((c.husband_id = sender_id AND c.wife_id = recipient_id) 
        OR (c.wife_id = sender_id AND c.husband_id = recipient_id))
  )
);

-- Policy: Users can view messages they sent or received
CREATE POLICY "Users can view their messages"
ON public.olive_branch_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles p
    WHERE (p.id = sender_id OR p.id = recipient_id)
      AND p.user_id = auth.uid()
  )
);

-- Policy: Recipients can mark messages as read
CREATE POLICY "Recipients can mark messages as read"
ON public.olive_branch_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.id = recipient_id
      AND p.user_id = auth.uid()
  )
);

-- Enable realtime for olive_branch_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.olive_branch_messages;