import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface CourseFormData {
  title: string;
  description: string;
  category: string;
  age_group: string;
  difficulty: string;
  total_lessons: number;
  price_mmk: number | null;
  is_premium: boolean;
  thumbnail: string;
  grade: string;
}

const emptyForm: CourseFormData = {
  title: "",
  description: "",
  category: "Coding",
  age_group: "5-7",
  difficulty: "beginner",
  total_lessons: 0,
  price_mmk: null,
  is_premium: false,
  thumbnail: "",
  grade: "",
};

const categories = ["Coding", "Math", "Science", "Art", "Language", "Music"];
const ageGroups = ["3-5", "5-7", "7-9", "9-12", "12+"];
const difficulties = ["beginner", "intermediate", "advanced"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourseFormData) => Promise<void>;
  initialData?: CourseFormData | null;
  mode: "create" | "edit";
}

export function CourseFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: Props) {
  const [form, setForm] = useState<CourseFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialData ?? emptyForm);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-fredoka">
            {mode === "create" ? "Create New Course" : "Edit Course"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Age Group *</Label>
              <Select value={form.age_group} onValueChange={(v) => setForm({ ...form, age_group: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ageGroups.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Difficulty *</Label>
              <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                placeholder="e.g. Grade 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_lessons">Total Lessons</Label>
              <Input
                id="total_lessons"
                type="number"
                min={0}
                value={form.total_lessons}
                onChange={(e) => setForm({ ...form, total_lessons: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_mmk">Price (MMK)</Label>
              <Input
                id="price_mmk"
                type="number"
                min={0}
                value={form.price_mmk ?? ""}
                onChange={(e) =>
                  setForm({ ...form, price_mmk: e.target.value ? parseInt(e.target.value) : null })
                }
                placeholder="0 = Free"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.is_premium}
              onCheckedChange={(v) => setForm({ ...form, is_premium: v })}
            />
            <Label>Premium Course</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title.trim()}>
              {saving ? "Saving..." : mode === "create" ? "Create Course" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
