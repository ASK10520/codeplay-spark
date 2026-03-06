import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/admin/curriculum": "Curriculum Builder",
  "/admin/certificates": "Certificates",
  "/admin/announcements": "Announcements",
  "/admin/messages": "Messages",
  "/admin/reviews": "Reviews",
  "/admin/content": "Content Manager",
  "/admin/roles": "Admins / Roles",
  "/admin/settings": "Settings",
  "/admin/activity-logs": "Activity Logs",
};

const AdminPlaceholder = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Coming Soon";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-foreground">
          {title}
        </h1>
        <Card className="border-0 shadow-card">
          <CardContent className="p-16 text-center">
            <Construction className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-fredoka font-bold text-lg text-foreground mb-2">
              Coming Soon
            </h2>
            <p className="text-sm text-muted-foreground font-nunito max-w-md mx-auto">
              This module is under development. Check back soon for the full {title.toLowerCase()} experience.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPlaceholder;
