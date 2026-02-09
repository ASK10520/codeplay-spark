
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- 2. Create user_roles table (roles MUST be separate per security policy)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function for role checks (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Add missing columns to courses table
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS grade text,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- 6. Create lessons table
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  video_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lessons_order ON public.lessons(course_id, order_index);

-- 7. Lessons RLS policies
CREATE POLICY "Anyone can view lessons"
  ON public.lessons FOR SELECT
  USING (true);

CREATE POLICY "Teachers can manage lessons for own courses"
  ON public.lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_id
        AND courses.created_by = auth.uid()
    )
  );

CREATE POLICY "Teachers can update lessons for own courses"
  ON public.lessons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_id
        AND courses.created_by = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete lessons for own courses"
  ON public.lessons FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_id
        AND courses.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all lessons"
  ON public.lessons FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. Create teachers table (public team display)
CREATE TABLE public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_mm text,
  role text NOT NULL DEFAULT 'Instructor',
  photo_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teachers"
  ON public.teachers FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage teachers"
  ON public.teachers FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 9. Update courses RLS: allow teachers/admins to manage courses
CREATE POLICY "Teachers can create courses"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Teachers can update own courses"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 10. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON public.courses(created_by);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- 11. Auto-assign 'student' role on new profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- 12. Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_emoji)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '🦊')
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();
