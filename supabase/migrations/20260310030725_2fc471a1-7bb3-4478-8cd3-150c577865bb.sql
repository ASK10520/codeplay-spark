
CREATE TABLE public.student_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  language text NOT NULL DEFAULT 'scratch',
  code_snippet text,
  screenshot_url text,
  demo_link text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON public.student_projects
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.student_projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.student_projects
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.student_projects
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published projects" ON public.student_projects
  FOR SELECT TO public USING (is_published = true);

CREATE POLICY "Admins can view all projects" ON public.student_projects
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}';

CREATE TRIGGER update_student_projects_updated_at
  BEFORE UPDATE ON public.student_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
