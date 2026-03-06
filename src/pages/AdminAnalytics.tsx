import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const weeklyData = [
  { day: "Mon", students: 5, revenue: 75000 },
  { day: "Tue", students: 8, revenue: 120000 },
  { day: "Wed", students: 3, revenue: 45000 },
  { day: "Thu", students: 12, revenue: 180000 },
  { day: "Fri", students: 7, revenue: 105000 },
  { day: "Sat", students: 15, revenue: 225000 },
  { day: "Sun", students: 10, revenue: 150000 },
];

const monthlyData = [
  { month: "Jan", students: 30, revenue: 450000, completions: 12 },
  { month: "Feb", students: 45, revenue: 675000, completions: 18 },
  { month: "Mar", students: 62, revenue: 930000, completions: 25 },
  { month: "Apr", students: 78, revenue: 1170000, completions: 35 },
  { month: "May", students: 95, revenue: 1425000, completions: 42 },
  { month: "Jun", students: 110, revenue: 1650000, completions: 55 },
];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState("monthly");
  const data = period === "weekly" ? weeklyData : monthlyData;
  const xKey = period === "weekly" ? "day" : "month";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-7 h-7" /> Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-nunito">
              Platform insights & performance metrics
            </p>
          </div>
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="rounded-xl">
              <TabsTrigger value="weekly" className="text-xs rounded-lg">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs rounded-lg">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-nunito font-semibold">Student Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="sgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(200, 85%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(200, 85%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(45, 30%, 88%)" />
                  <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="students" stroke="hsl(200, 85%, 60%)" strokeWidth={2} fill="url(#sgGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-nunito font-semibold">Revenue (MMK)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(45, 30%, 88%)" />
                  <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => `${new Intl.NumberFormat().format(v)} MMK`} />
                  <Bar dataKey="revenue" fill="hsl(16, 90%, 60%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {period === "monthly" && (
            <Card className="border-0 shadow-card lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-nunito font-semibold">Course Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(45, 30%, 88%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completions" stroke="hsl(145, 70%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="students" stroke="hsl(200, 85%, 60%)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
