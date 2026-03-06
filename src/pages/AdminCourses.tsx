import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, Pencil, Trash2, Eye, Copy, Users, Star } from "lucide-react";
import { toast } from "sonner";
import { CourseFormDialog, CourseFormData } from "@/components/admin/CourseFormDialog";

interface CourseRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  age_group: string;
  difficulty: string;
  total_lessons: number;
  price_mmk: number | null;
  is_premium: boolean | null;
  thumbnail: string | null;
  grade: string | null;
  created_at: string;
}

const AdminCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCourse, setEditingCourse] = useState<CourseRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = () => {
    setLoading(true);
    supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCourses((data as CourseRow[]) || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const categories = [...new Set(courses.map((c) => c.category))];

  const filtered = courses.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || c.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleCreate = () => {
    setEditingCourse(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (course: CourseRow) => {
    setEditingCourse(course);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    if (formMode === "create") {
      const { error } = await supabase.from("courses").insert({
        title: data.title,
        description: data.description || null,
        category: data.category,
        age_group: data.age_group,
        difficulty: data.difficulty,
        total_lessons: data.total_lessons,
        price_mmk: data.price_mmk,
        is_premium: data.is_premium,
        thumbnail: data.thumbnail || null,
        grade: data.grade || null,
        created_by: user?.id,
      });
      if (error) { toast.error("Failed: " + error.message); throw error; }
      toast.success("Course created!");
    } else if (editingCourse) {
      const { error } = await supabase
        .from("courses")
        .update({
          title: data.title,
          description: data.description || null,
          category: data.category,
          age_group: data.age_group,
          difficulty: data.difficulty,
          total_lessons: data.total_lessons,
          price_mmk: data.price_mmk,
          is_premium: data.is_premium,
          thumbnail: data.thumbnail || null,
          grade: data.grade || null,
        })
        .eq("id", editingCourse.id);
      if (error) { toast.error("Failed: " + error.message); throw error; }
      toast.success("Course updated!");
    }
    fetchCourses();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("courses").delete().eq("id", deleteTarget.id);
    if (error) toast.error("Failed: " + error.message);
    else { toast.success("Deleted."); fetchCourses(); }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const handleDuplicate = async (course: CourseRow) => {
    const { error } = await supabase.from("courses").insert({
      title: course.title + " (Copy)",
      description: course.description,
      category: course.category,
      age_group: course.age_group,
      difficulty: course.difficulty,
      total_lessons: course.total_lessons,
      price_mmk: course.price_mmk,
      is_premium: course.is_premium,
      thumbnail: course.thumbnail,
      grade: course.grade,
      created_by: user?.id,
    });
    if (error) toast.error("Failed: " + error.message);
    else { toast.success("Course duplicated!"); fetchCourses(); }
  };

  const toFormData = (c: CourseRow): CourseFormData => ({
    title: c.title,
    description: c.description || "",
    category: c.category,
    age_group: c.age_group,
    difficulty: c.difficulty,
    total_lessons: c.total_lessons,
    price_mmk: c.price_mmk,
    is_premium: c.is_premium ?? false,
    thumbnail: c.thumbnail || "",
    grade: c.grade || "",
  });

  const difficultyColor = (d: string) => {
    if (d === "beginner") return "bg-success/10 text-success border-success/20";
    if (d === "intermediate") return "bg-star/10 text-star border-star/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-foreground">
              Courses
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-nunito">
              {courses.length} total courses
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2 gradient-primary text-primary-foreground rounded-xl shadow-button">
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl bg-card border-border/50 font-nunito"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="p-12 text-center text-muted-foreground font-nunito">
              No courses found.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <Card key={c.id} className="border-0 shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden group">
                {/* Thumbnail */}
                <div className="h-36 bg-muted relative overflow-hidden">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full gradient-secondary flex items-center justify-center">
                      <span className="text-3xl">📚</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {c.is_premium && (
                      <Badge className="bg-star/90 text-foreground border-0 text-[10px] font-semibold">
                        <Star className="w-3 h-3 mr-0.5" /> Premium
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-fredoka font-bold text-foreground text-sm mb-2 line-clamp-1">
                    {c.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="outline" className="text-[10px] rounded-lg">{c.category}</Badge>
                    <Badge variant="outline" className="text-[10px] rounded-lg">{c.age_group}</Badge>
                    <Badge className={`text-[10px] rounded-lg border ${difficultyColor(c.difficulty)}`}>
                      {c.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {c.total_lessons} lessons
                    </span>
                    <span className="font-semibold text-foreground">
                      {c.price_mmk ? `${new Intl.NumberFormat("my-MM").format(c.price_mmk)} MMK` : "Free"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 border-t border-border/50 pt-3">
                    <Button variant="ghost" size="sm" className="flex-1 text-xs h-8" onClick={() => handleEdit(c)}>
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => handleDuplicate(c)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(c)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CourseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingCourse ? toFormData(editingCourse) : null}
        mode={formMode}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminCourses;
