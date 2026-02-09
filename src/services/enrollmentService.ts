import { supabase } from "@/integrations/supabase/client";

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  child_name: string;
  child_age: number;
  parent_name: string;
  parent_email: string;
  payment_status: string;
  completed_lessons: number | null;
  stars_earned: number | null;
  enrolled_at: string;
}

export interface EnrollmentWithCourse extends Enrollment {
  courses: {
    id: string;
    title: string;
    thumbnail: string | null;
    total_lessons: number;
    category: string;
    difficulty: string;
  };
}

export async function enrollUser(enrollment: Omit<Enrollment, "id" | "enrolled_at" | "completed_lessons" | "stars_earned">) {
  const { data, error } = await supabase
    .from("enrollments")
    .insert(enrollment)
    .select()
    .single();

  if (error) throw error;
  return data as Enrollment;
}

export async function getEnrolledCourses(userId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      courses (
        id,
        title,
        thumbnail,
        total_lessons,
        category,
        difficulty
      )
    `)
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });

  if (error) throw error;
  return data as EnrollmentWithCourse[];
}

export async function updateEnrollmentProgress(id: string, completedLessons: number, starsEarned: number) {
  const { data, error } = await supabase
    .from("enrollments")
    .update({
      completed_lessons: completedLessons,
      stars_earned: starsEarned,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Enrollment;
}

export async function isUserEnrolled(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}
