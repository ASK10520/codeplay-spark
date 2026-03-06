import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  TrendingUp,
  UserPlus,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Stats {
  totalCourses: number;
  totalStudents: number;
  totalPayments: number;
  pendingPayments: number;
  approvedPayments: number;
  totalRevenue: number;
  activeEnrollments: number;
}

// Mock chart data
const studentGrowthData = [
  { month: "Jan", students: 12 },
  { month: "Feb", students: 19 },
  { month: "Mar", students: 28 },
  { month: "Apr", students: 35 },
  { month: "May", students: 48 },
  { month: "Jun", students: 62 },
];

const revenueData = [
  { month: "Jan", revenue: 150000 },
  { month: "Feb", revenue: 280000 },
  { month: "Mar", revenue: 350000 },
  { month: "Apr", revenue: 420000 },
  { month: "May", revenue: 580000 },
  { month: "Jun", revenue: 720000 },
];

const coursePopularityData = [
  { name: "Scratch", value: 35, color: "hsl(16, 90%, 60%)" },
  { name: "Python", value: 25, color: "hsl(200, 85%, 60%)" },
  { name: "Web Dev", value: 20, color: "hsl(145, 70%, 50%)" },
  { name: "Robotics", value: 12, color: "hsl(280, 70%, 60%)" },
  { name: "Other", value: 8, color: "hsl(45, 100%, 55%)" },
];

const recentActivities = [
  { type: "student", message: "New student registered: Aung Min Thu", time: "2 min ago", icon: UserPlus },
  { type: "course", message: "Course published: Python for Kids", time: "15 min ago", icon: BookOpen },
  { type: "payment", message: "Payment approved: 25,000 MMK", time: "30 min ago", icon: CheckCircle },
  { type: "enroll", message: "New enrollment in Scratch Basics", time: "1h ago", icon: TrendingUp },
  { type: "payment", message: "Payment pending review: 50,000 MMK", time: "2h ago", icon: Clock },
];

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalStudents: 0,
    totalPayments: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [courses, enrollments, payments] = await Promise.all([
          supabase.from("courses").select("id", { count: "exact", head: true }),
          supabase.from("enrollments").select("id", { count: "exact", head: true }),
          supabase.from("payment_submissions").select("*"),
        ]);

        const paymentData = payments.data || [];
        setStats({
          totalCourses: courses.count || 0,
          totalStudents: enrollments.count || 0,
          totalPayments: paymentData.length,
          pendingPayments: paymentData.filter((p) => p.status === "pending").length,
          approvedPayments: paymentData.filter((p) => p.status === "approved").length,
          totalRevenue: paymentData
            .filter((p) => p.status === "approved")
            .reduce((sum, p) => sum + Number(p.course_fee), 0),
          activeEnrollments: enrollments.count || 0,
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metricCards = [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "bg-secondary/10 text-secondary", trend: "+12%" },
    { label: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "bg-primary/10 text-primary", trend: "+3" },
    { label: "Active Enrollments", value: stats.activeEnrollments, icon: TrendingUp, color: "bg-accent/10 text-accent", trend: "+8%" },
    { label: "Total Revenue", value: `${new Intl.NumberFormat("my-MM").format(stats.totalRevenue)} MMK`, icon: DollarSign, color: "bg-badge/10 text-badge", trend: "+22%" },
    { label: "Pending Payments", value: stats.pendingPayments, icon: Clock, color: "bg-star/20 text-star", trend: "" },
    { label: "Approved Payments", value: stats.approvedPayments, icon: CheckCircle, color: "bg-success/10 text-success", trend: "" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-nunito">
            Welcome back! Here's your platform overview.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {metricCards.map((m) => (
                <Card key={m.label} className="border-0 shadow-card hover:shadow-hover transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-xl ${m.color}`}>
                        <m.icon className="w-4 h-4" />
                      </div>
                      {m.trend && (
                        <Badge variant="outline" className="text-[10px] text-success border-success/30 bg-success/5 font-semibold">
                          {m.trend}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xl font-fredoka font-bold text-foreground leading-tight">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-nunito mt-0.5">
                      {m.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Student Growth */}
              <Card className="border-0 shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-nunito font-semibold text-foreground">
                    Student Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={studentGrowthData}>
                      <defs>
                        <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(200, 85%, 60%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(200, 85%, 60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(45, 30%, 88%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="students"
                        stroke="hsl(200, 85%, 60%)"
                        strokeWidth={2}
                        fill="url(#studentGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue */}
              <Card className="border-0 shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-nunito font-semibold text-foreground">
                    Revenue (MMK)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(45, 30%, 88%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                      <Tooltip formatter={(v: number) => `${new Intl.NumberFormat().format(v)} MMK`} />
                      <Bar dataKey="revenue" fill="hsl(16, 90%, 60%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Course Popularity */}
              <Card className="border-0 shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-nunito font-semibold text-foreground">
                    Course Popularity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={coursePopularityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {coursePopularityData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span className="text-xs font-nunito text-muted-foreground">{value}</span>
                        )}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-0 shadow-card lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-nunito font-semibold text-foreground">
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <a.icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-nunito text-foreground truncate">
                            {a.message}
                          </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {a.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
