
-- Create payment_submissions table
CREATE TABLE public.payment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  phone_number text,
  payment_method text NOT NULL DEFAULT 'kbz_pay',
  transaction_id text,
  slip_url text NOT NULL,
  course_fee numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  rejection_reason text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own payment submissions"
ON public.payment_submissions FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own submissions
CREATE POLICY "Users can create payment submissions"
ON public.payment_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all submissions
CREATE POLICY "Admins can view all payment submissions"
ON public.payment_submissions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update submissions (approve/reject)
CREATE POLICY "Admins can update payment submissions"
ON public.payment_submissions FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_payment_submissions_updated_at
BEFORE UPDATE ON public.payment_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create payment_audit_log table
CREATE TABLE public.payment_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_submission_id uuid NOT NULL REFERENCES public.payment_submissions(id) ON DELETE CASCADE,
  action text NOT NULL,
  performed_by uuid NOT NULL,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.payment_audit_log FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create audit logs"
ON public.payment_audit_log FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for payment slips
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-slips', 'payment-slips', false);

-- Storage policies for payment slips
CREATE POLICY "Users can upload payment slips"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own payment slips"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all payment slips"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-slips' AND has_role(auth.uid(), 'admin'::app_role));

-- Add price_mmk to courses for Myanmar Kyat pricing
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS price_mmk numeric DEFAULT 0;
