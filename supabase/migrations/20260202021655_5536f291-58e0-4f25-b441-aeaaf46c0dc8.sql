-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_emoji TEXT DEFAULT '🦊',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL,
  price_yearly NUMERIC(10,2) NOT NULL,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view plans" ON public.subscription_plans FOR SELECT USING (true);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, is_popular) VALUES
('Free Trial', '7-day free access to starter courses', 0, 0, '["Access to 3 starter courses", "Basic progress tracking", "5 lessons per day limit"]', false),
('Explorer', 'Perfect for beginners starting their coding journey', 9.99, 99.99, '["Access to all beginner courses", "Unlimited lessons", "Progress tracking", "Parent dashboard", "5 child profiles"]', false),
('Champion', 'Full access for serious young coders', 19.99, 199.99, '["Access to ALL courses", "Unlimited lessons", "Advanced progress analytics", "Parent dashboard", "10 child profiles", "Priority support", "Downloadable certificates"]', true),
('School', 'For teachers and educational institutions', 49.99, 499.99, '["Unlimited students", "Teacher dashboard", "Class management", "Curriculum integration", "Progress reports", "Dedicated support"]', false);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own subscription" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription" ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  age_group TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  thumbnail TEXT,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  price NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);

-- Insert sample courses
INSERT INTO public.courses (title, description, category, age_group, difficulty, thumbnail, total_lessons, is_premium, price) VALUES
('Block Coding Adventure', 'Learn to code with colorful blocks! Perfect for beginners.', 'coding', '6-8', 'beginner', '🧩', 12, false, 0),
('Color Magic Studio', 'Discover the magic of colors and create beautiful designs!', 'uiux', '6-8', 'beginner', '🎨', 8, false, 0),
('Puzzle Master', 'Solve fun puzzles and train your brain like a champion!', 'logic', '9-11', 'intermediate', '🧠', 15, true, 14.99),
('Game Designer Jr.', 'Create your own games and become a game designer!', 'games', '9-11', 'intermediate', '🎮', 20, true, 19.99),
('App Builder Pro', 'Build real apps and learn professional coding skills!', 'coding', '12-14', 'advanced', '📱', 25, true, 24.99),
('UX Hero Academy', 'Learn how to design apps that everyone loves!', 'uiux', '12-14', 'advanced', '✨', 18, true, 19.99);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  completed_lessons INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();