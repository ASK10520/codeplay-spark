import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Users } from "lucide-react";

interface EnrollmentRow {
  id: string;
  child_name: string;
  parent_name: string;
  parent_email: string;
  child_age: number;
  payment_status: string;
  enrolled_at: string;
  completed_lessons: number | null;
  stars_earned: number | null;
  courses: { title: string } | null;
}

const AdminStudents = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("enrollments")
      .select("*, courses(title)")
      .order("enrolled_at", { ascending: false })
      .then(({ data }) => {
        setEnrollments((data as unknown as EnrollmentRow[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = enrollments.filter(
    (e) =>
      !search ||
      e.child_name.toLowerCase().includes(search.toLowerCase()) ||
      e.parent_name.toLowerCase().includes(search.toLowerCase()) ||
      e.parent_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-fredoka font-bold text-foreground">
            <Users className="w-7 h-7 inline mr-2" />Enrolled Students
          </h1>
          <p className="text-muted-foreground mt-1">View all student enrollments</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No enrollments found.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((e) => (
              <Card key={e.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-fredoka font-bold text-foreground">{e.child_name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {e.courses?.title || "Unknown Course"} • Age {e.child_age}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Parent: {e.parent_name} ({e.parent_email})
                    </p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <Badge
                      className={
                        e.payment_status === "paid"
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-star/20 text-star border-star/30"
                      }
                    >
                      {e.payment_status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      ⭐ {e.stars_earned || 0} • 📖 {e.completed_lessons || 0} lessons
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(e.enrolled_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStudents;
