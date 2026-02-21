import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Users, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";

interface Stats {
  totalCourses: number;
  totalStudents: number;
  totalPayments: number;
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
  totalRevenue: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalStudents: 0,
    totalPayments: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    rejectedPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [courses, students, payments] = await Promise.all([
          supabase.from("courses").select("id", { count: "exact", head: true }),
          supabase.from("enrollments").select("id", { count: "exact", head: true }),
          supabase.from("payment_submissions").select("*"),
        ]);

        const paymentData = payments.data || [];
        setStats({
          totalCourses: courses.count || 0,
          totalStudents: students.count || 0,
          totalPayments: paymentData.length,
          pendingPayments: paymentData.filter((p) => p.status === "pending").length,
          approvedPayments: paymentData.filter((p) => p.status === "approved").length,
          rejectedPayments: paymentData.filter((p) => p.status === "rejected").length,
          totalRevenue: paymentData
            .filter((p) => p.status === "approved")
            .reduce((sum, p) => sum + Number(p.course_fee), 0),
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "text-primary" },
    { label: "Enrolled Students", value: stats.totalStudents, icon: Users, color: "text-secondary" },
    { label: "Total Payments", value: stats.totalPayments, icon: CreditCard, color: "text-accent" },
    { label: "Pending", value: stats.pendingPayments, icon: Clock, color: "text-star" },
    { label: "Approved", value: stats.approvedPayments, icon: CheckCircle, color: "text-success" },
    { label: "Rejected", value: stats.rejectedPayments, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-fredoka font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Platform statistics at a glance</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {statCards.map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-muted ${s.color}`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-2xl font-fredoka font-bold text-foreground">{s.value}</div>
                        <div className="text-xs text-muted-foreground">{s.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Revenue Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Revenue (Approved)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-fredoka font-bold text-primary">
                  {new Intl.NumberFormat("my-MM").format(stats.totalRevenue)} MMK
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
