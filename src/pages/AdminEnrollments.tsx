import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Search, ClipboardList, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EnrollmentRow {
  id: string;
  user_id: string;
  child_name: string;
  parent_name: string;
  parent_email: string;
  payment_status: string;
  completed_lessons: number | null;
  enrolled_at: string;
  courses: { title: string; total_lessons: number } | null;
}

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetch = () => {
    setLoading(true);
    supabase
      .from("enrollments")
      .select("*, courses(title, total_lessons)")
      .order("enrolled_at", { ascending: false })
      .then(({ data }) => {
        setEnrollments((data as unknown as EnrollmentRow[]) || []);
        setLoading(false);
      });
  };

  useEffect(fetch, []);

  const filtered = enrollments.filter(
    (e) =>
      !search ||
      e.child_name.toLowerCase().includes(search.toLowerCase()) ||
      (e.courses?.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => {
    if (s === "approved" || s === "paid") return "bg-success/10 text-success border-success/20";
    if (s === "pending") return "bg-star/10 text-star border-star/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-7 h-7" /> Enrollments
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-nunito">
            {enrollments.length} total enrollments
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search enrollments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-card border-border/50 font-nunito"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="p-12 text-center text-muted-foreground font-nunito">
              No enrollments found.
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-nunito text-xs font-semibold">Student</TableHead>
                    <TableHead className="font-nunito text-xs font-semibold">Course</TableHead>
                    <TableHead className="font-nunito text-xs font-semibold">Progress</TableHead>
                    <TableHead className="font-nunito text-xs font-semibold">Status</TableHead>
                    <TableHead className="font-nunito text-xs font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => {
                    const total = e.courses?.total_lessons || 1;
                    const pct = Math.round(((e.completed_lessons || 0) / total) * 100);
                    return (
                      <TableRow key={e.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <p className="text-sm font-nunito font-semibold text-foreground">{e.child_name}</p>
                          <p className="text-[11px] text-muted-foreground">{e.parent_email}</p>
                        </TableCell>
                        <TableCell className="text-sm font-nunito text-foreground">
                          {e.courses?.title || "—"}
                        </TableCell>
                        <TableCell className="text-sm font-nunito">
                          {e.completed_lessons || 0}/{total} ({pct}%)
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] border ${statusColor(e.payment_status)}`}>
                            {e.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(e.enrolled_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEnrollments;
