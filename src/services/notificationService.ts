import { supabase } from "@/integrations/supabase/client";

interface AnnouncementNotificationPayload {
  announcementId: string;
  title: string;
  content: string;
}

interface EnrollmentNotificationPayload {
  userId: string;
  courseId: string;
  studentName: string;
}

export async function sendAnnouncementPublishedNotification(payload: AnnouncementNotificationPayload) {
  const { error } = await supabase.functions.invoke("email-notifications", {
    body: {
      type: "announcement_published",
      announcementId: payload.announcementId,
      announcementTitle: payload.title,
      announcementContent: payload.content,
    },
  });

  if (error) throw error;
}

export async function sendEnrollmentConfirmedNotification(payload: EnrollmentNotificationPayload) {
  const { error } = await supabase.functions.invoke("email-notifications", {
    body: {
      type: "enrollment_confirmed",
      userId: payload.userId,
      courseId: payload.courseId,
      studentName: payload.studentName,
    },
  });

  if (error) throw error;
}
