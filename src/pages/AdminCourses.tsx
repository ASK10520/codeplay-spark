import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, BookOpen } from "lucide-react";

interface CourseRow {
  id: string;
  title: string;
  category: string;
  age_group: string;
  difficulty: string;
  total_lessons: number;
  price_mmk: number | null;
  is_premium: boolean | null;
  created_at: string;
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCourses((data as CourseRow[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = courses.filter(
    (c) =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-fredoka font-bold text-foreground">
            <BookOpen className="w-7 h-7 inline mr-2" />Manage Courses
          </h1>
          <p className="text-muted-foreground mt-1">View and manage all courses</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
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
              No courses found.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-fredoka font-bold text-foreground truncate">{c.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline">{c.category}</Badge>
                      <Badge variant="outline">{c.age_group}</Badge>
                      <Badge variant="outline">{c.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-foreground">
                      {c.total_lessons} lessons
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.price_mmk ? `${new Intl.NumberFormat("my-MM").format(c.price_mmk)} MMK` : "Free"}
                    </div>
                    {c.is_premium && (
                      <Badge className="mt-1 bg-star/20 text-star border-star/30 text-xs">Premium</Badge>
                    )}
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

export default AdminCourses;
