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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
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

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCourse, setEditingCourse] = useState<CourseRow | null>(null);

  // Delete state
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

  const filtered = courses.filter(
    (c) =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

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
      if (error) {
        toast.error("Failed to create course: " + error.message);
        throw error;
      }
      toast.success("Course created successfully!");
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
      if (error) {
        toast.error("Failed to update course: " + error.message);
        throw error;
      }
      toast.success("Course updated successfully!");
    }
    fetchCourses();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("courses").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("Failed to delete course: " + error.message);
    } else {
      toast.success("Course deleted.");
      fetchCourses();
    }
    setDeleting(false);
    setDeleteTarget(null);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-fredoka font-bold text-foreground">
              <BookOpen className="w-7 h-7 inline mr-2" />Manage Courses
            </h1>
            <p className="text-muted-foreground mt-1">View and manage all courses</p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Add Course
          </Button>
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
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
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
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(c)} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(c)} title="Delete" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
              Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminCourses;
