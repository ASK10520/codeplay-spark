import { supabase } from "@/integrations/supabase/client";

export interface Teacher {
  id: string;
  name: string;
  name_mm: string | null;
  role: string;
  photo_url: string | null;
  bio: string | null;
  created_at: string;
}

export async function getTeachers() {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Teacher[];
}

export async function getTeacherById(id: string) {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Teacher;
}

export async function createTeacher(teacher: Omit<Teacher, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("teachers")
    .insert(teacher)
    .select()
    .single();

  if (error) throw error;
  return data as Teacher;
}

export async function updateTeacher(id: string, updates: Partial<Teacher>) {
  const { data, error } = await supabase
    .from("teachers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Teacher;
}

export async function deleteTeacher(id: string) {
  const { error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) throw error;
}
