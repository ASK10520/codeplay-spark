import { supabase } from "@/integrations/supabase/client";

export interface PaymentSubmission {
  id: string;
  user_id: string;
  course_id: string;
  student_name: string;
  phone_number: string | null;
  payment_method: string;
  transaction_id: string | null;
  slip_url: string;
  course_fee: number;
  status: string;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentSubmissionWithCourse extends PaymentSubmission {
  courses: {
    id: string;
    title: string;
    thumbnail: string | null;
  };
}

export async function uploadPaymentSlip(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("payment-slips")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("payment-slips")
    .getPublicUrl(path);

  return path;
}

export async function getSignedSlipUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("payment-slips")
    .createSignedUrl(path, 3600);

  if (error) throw error;
  return data.signedUrl;
}

export async function submitPayment(submission: {
  user_id: string;
  course_id: string;
  student_name: string;
  phone_number?: string;
  payment_method: string;
  transaction_id?: string;
  slip_url: string;
  course_fee: number;
}) {
  const { data, error } = await supabase
    .from("payment_submissions")
    .insert(submission)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserPaymentStatus(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from("payment_submissions")
    .select("id, status, rejection_reason")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAllPaymentSubmissions() {
  const { data, error } = await supabase
    .from("payment_submissions")
    .select(`*, courses (id, title, thumbnail)`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as PaymentSubmissionWithCourse[];
}

export async function approvePayment(submissionId: string, adminId: string) {
  // Update submission status
  const { error: updateError } = await supabase
    .from("payment_submissions")
    .update({
      status: "approved",
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (updateError) throw updateError;

  // Get submission details to create enrollment
  const { data: submission, error: fetchError } = await supabase
    .from("payment_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (fetchError) throw fetchError;

  // Create enrollment record
  const { error: enrollError } = await supabase
    .from("enrollments")
    .insert({
      user_id: submission.user_id,
      course_id: submission.course_id,
      child_name: submission.student_name,
      child_age: 0,
      parent_name: submission.student_name,
      parent_email: "",
      payment_status: "paid",
    });

  if (enrollError) throw enrollError;

  // Audit log
  const { error: auditError } = await supabase
    .from("payment_audit_log")
    .insert({
      payment_submission_id: submissionId,
      action: "approved",
      performed_by: adminId,
      details: `Payment approved for course ${submission.course_id}`,
    });

  if (auditError) console.error("Audit log error:", auditError);
}

export async function rejectPayment(submissionId: string, adminId: string, reason?: string) {
  const { error: updateError } = await supabase
    .from("payment_submissions")
    .update({
      status: "rejected",
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason || null,
    })
    .eq("id", submissionId);

  if (updateError) throw updateError;

  // Audit log
  const { error: auditError } = await supabase
    .from("payment_audit_log")
    .insert({
      payment_submission_id: submissionId,
      action: "rejected",
      performed_by: adminId,
      details: reason || "Payment rejected",
    });

  if (auditError) console.error("Audit log error:", auditError);
}
