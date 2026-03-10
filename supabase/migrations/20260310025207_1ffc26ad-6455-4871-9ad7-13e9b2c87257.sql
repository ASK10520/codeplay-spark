
-- Create notifications table for admin
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage notifications
CREATE POLICY "Admins can view notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'avatars');

-- Trigger to create notification on new user signup
CREATE OR REPLACE FUNCTION public.notify_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (title, message, type)
  VALUES (
    'New User Registration',
    'A new user has registered: ' || COALESCE(NEW.display_name, 'Unknown'),
    'user'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_profile_notify
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_user();

-- Trigger to create notification on new enrollment
CREATE OR REPLACE FUNCTION public.notify_new_enrollment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (title, message, type)
  VALUES (
    'New Enrollment',
    NEW.child_name || ' has enrolled in a course',
    'enrollment'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_enrollment_notify
  AFTER INSERT ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_enrollment();

-- Trigger for new payment
CREATE OR REPLACE FUNCTION public.notify_new_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (title, message, type)
  VALUES (
    'New Payment Submission',
    NEW.student_name || ' submitted a payment of ' || NEW.course_fee || ' MMK',
    'payment'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_payment_notify
  AFTER INSERT ON public.payment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_payment();
