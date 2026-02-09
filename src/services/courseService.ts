import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  age_group: string;
  difficulty: string;
  total_lessons: number;
  is_premium: boolean | null;
  price: number | null;
  thumbnail: string | null;
  grade: string | null;
  created_by: string | null;
  created_at: string;
}

export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Course[];
}

export async function getCourseById(id: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Course;
}

export async function createCourse(course: Omit<Course, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("courses")
    .insert(course)
    .select()
    .single();

  if (error) throw error;
  return data as Course;
}

export async function updateCourse(id: string, updates: Partial<Course>) {
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Course;
}

export async function deleteCourse(id: string) {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}

export async function getCoursesByTeacher(teacherId: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("created_by", teacherId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Course[];
}
