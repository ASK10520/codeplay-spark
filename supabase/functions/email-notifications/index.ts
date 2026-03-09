import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type NotificationRequest =
  | {
      type: "announcement_published";
      announcementId?: string;
      announcementTitle?: string;
      announcementContent?: string;
    }
  | {
      type: "enrollment_confirmed";
      userId?: string;
      courseId?: string;
      studentName?: string;
    };

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");

if (!SUPABASE_URL) throw new Error("SUPABASE_URL is not configured");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
if (!RESEND_FROM_EMAIL) throw new Error("RESEND_FROM_EMAIL is not configured");

const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function sendEmail(to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API failed [${response.status}]: ${errorText}`);
  }
}

function chunkEmails(emails: string[], chunkSize = 50) {
  const chunks: string[][] = [];
  for (let i = 0; i < emails.length; i += chunkSize) {
    chunks.push(emails.slice(i, i + chunkSize));
  }
  return chunks;
}

async function resolveEmailsFromUserIds(userIds: string[]) {
  const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));

  const users = await Promise.all(
    uniqueIds.map(async (userId) => {
      const { data, error } = await serviceClient.auth.admin.getUserById(userId);
      if (error || !data.user?.email) return null;
      return data.user.email;
    }),
  );

  return Array.from(new Set(users.filter((email): email is string => Boolean(email))));
}

async function isAdmin(userId: string) {
  const { data, error } = await serviceClient
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) return false;
  return Boolean(data);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = (await req.json()) as NotificationRequest;

    if (payload.type === "announcement_published") {
      const callerIsAdmin = await isAdmin(user.id);
      if (!callerIsAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: enrollments, error: enrollmentError } = await serviceClient
        .from("enrollments")
        .select("user_id");

      if (enrollmentError) throw enrollmentError;

      const emails = await resolveEmailsFromUserIds((enrollments ?? []).map((row) => row.user_id));

      if (emails.length === 0) {
        return new Response(JSON.stringify({ success: true, sent: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const subject = `New announcement: ${payload.announcementTitle ?? "Update"}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="margin-bottom: 8px;">${payload.announcementTitle ?? "New announcement"}</h2>
          <p style="margin-top: 0; color: #6b7280;">A new update has been published.</p>
          <div style="padding: 16px; border-radius: 8px; background: #f8fafc; color: #111827; line-height: 1.6;">
            ${payload.announcementContent ?? ""}
          </div>
        </div>
      `;

      const chunks = chunkEmails(emails, 50);
      for (const group of chunks) {
        await sendEmail(group, subject, html);
      }

      return new Response(JSON.stringify({ success: true, sent: emails.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (payload.type === "enrollment_confirmed") {
      if (!payload.userId || !payload.courseId) {
        return new Response(JSON.stringify({ error: "Missing userId or courseId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const callerIsAdmin = await isAdmin(user.id);
      if (!callerIsAdmin && user.id !== payload.userId) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: courseData } = await serviceClient
        .from("courses")
        .select("title")
        .eq("id", payload.courseId)
        .maybeSingle();

      const emails = await resolveEmailsFromUserIds([payload.userId]);
      if (emails.length === 0) {
        return new Response(JSON.stringify({ success: true, sent: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const courseTitle = courseData?.title ?? "your course";
      const subject = `Enrollment confirmed: ${courseTitle}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="margin-bottom: 8px;">You're enrolled in ${courseTitle}</h2>
          <p style="color: #111827; line-height: 1.6;">
            Hi${payload.studentName ? ` ${payload.studentName}` : ""}, your enrollment has been confirmed. You can now access lessons from your dashboard.
          </p>
        </div>
      `;

      await sendEmail(emails, subject, html);

      return new Response(JSON.stringify({ success: true, sent: emails.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported notification type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("email-notifications error:", message);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
