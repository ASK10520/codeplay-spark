import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Search,
  Send,
  Clock,
  AlertTriangle,
  Info,
  Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sendAnnouncementPublishedNotification } from "@/services/notificationService";
import { toast } from "sonner";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  is_published: boolean;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface FormData {
  title: string;
  content: string;
  category: string;
  priority: string;
  is_published: boolean;
}

const defaultForm: FormData = {
  title: "",
  content: "",
  category: "general",
  priority: "normal",
  is_published: false,
};

const categories = [
  { value: "general", label: "General", icon: Info },
  { value: "update", label: "Update", icon: Star },
  { value: "maintenance", label: "Maintenance", icon: Clock },
  { value: "urgent", label: "Urgent", icon: AlertTriangle },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

const priorityColor = (p: string) => {
  if (p === "high") return "bg-destructive/10 text-destructive border-destructive/20";
  if (p === "low") return "bg-muted text-muted-foreground border-border";
  return "bg-primary/10 text-primary border-primary/20";
};

const categoryIcon = (c: string) => {
  const cat = categories.find((x) => x.value === c);
  if (!cat) return <Info className="w-4 h-4" />;
  const Icon = cat.icon;
  return <Icon className="w-4 h-4" />;
};

const AdminAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load announcements");
    } else {
      setAnnouncements((data as Announcement[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || a.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleCreate = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (a: Announcement) => {
    setFormData({
      title: a.title,
      content: a.content,
      category: a.category,
      priority: a.priority,
      is_published: a.is_published,
    });
    setEditingId(a.id);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);

    const payload = {
      ...formData,
      published_at: formData.is_published ? new Date().toISOString() : null,
      created_by: user?.id || null,
    };

    if (formMode === "create") {
      const { error } = await supabase.from("announcements").insert(payload);
      if (error) {
        toast.error("Failed to create: " + error.message);
      } else {
        toast.success("Announcement created!");
        setFormOpen(false);
        fetchAnnouncements();
      }
    } else if (editingId) {
      const { created_by, ...updatePayload } = payload;
      const { error } = await supabase
        .from("announcements")
        .update(updatePayload)
        .eq("id", editingId);
      if (error) {
        toast.error("Failed to update: " + error.message);
      } else {
        toast.success("Announcement updated!");
        setFormOpen(false);
        fetchAnnouncements();
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", deleteTarget.id);
    if (error) {
      toast.error("Failed to delete: " + error.message);
    } else {
      toast.success("Announcement deleted");
      fetchAnnouncements();
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const togglePublish = async (a: Announcement) => {
    const newPublished = !a.is_published;
    const { error } = await supabase
      .from("announcements")
      .update({
        is_published: newPublished,
        published_at: newPublished ? new Date().toISOString() : null,
      })
      .eq("id", a.id);
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(newPublished ? "Published!" : "Unpublished");
      fetchAnnouncements();
    }
  };

  const publishedCount = announcements.filter((a) => a.is_published).length;
  const draftCount = announcements.filter((a) => !a.is_published).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-foreground">
              Announcements
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-nunito">
              {announcements.length} total · {publishedCount} published · {draftCount} drafts
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="gap-2 gradient-primary text-primary-foreground rounded-xl shadow-button"
          >
            <Plus className="w-4 h-4" /> New Announcement
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl bg-card border-border/50 font-nunito"
            />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-40 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="p-12 text-center">
              <Megaphone className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-nunito">No announcements found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <Card
                key={a.id}
                className="border-0 shadow-card hover:shadow-hover transition-all duration-300 group"
              >
                <CardContent className="p-5 flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted shrink-0 mt-0.5">
                    {categoryIcon(a.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-fredoka font-bold text-foreground text-base">
                        {a.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-[10px] rounded-lg border ${priorityColor(a.priority)}`}
                      >
                        {a.priority}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] rounded-lg">
                        {a.category}
                      </Badge>
                      {a.is_published ? (
                        <Badge className="bg-accent/10 text-accent border-accent/20 border text-[10px] rounded-lg">
                          <Send className="w-3 h-3 mr-0.5" /> Published
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground border-border border text-[10px] rounded-lg">
                          <Clock className="w-3 h-3 mr-0.5" /> Draft
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-nunito line-clamp-2">
                      {a.content}
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-nunito mt-2">
                      Created {format(new Date(a.created_at), "MMM d, yyyy 'at' h:mm a")}
                      {a.published_at &&
                        ` · Published ${format(new Date(a.published_at), "MMM d, yyyy")}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8"
                      onClick={() => togglePublish(a)}
                      title={a.is_published ? "Unpublish" : "Publish"}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8"
                      onClick={() => handleEdit(a)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteTarget(a)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-fredoka">
              {formMode === "create" ? "New Announcement" : "Edit Announcement"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="font-nunito font-semibold text-sm">Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Announcement title..."
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label className="font-nunito font-semibold text-sm">Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your announcement..."
                className="mt-1 rounded-xl min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-nunito font-semibold text-sm">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-nunito font-semibold text-sm">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => setFormData({ ...formData, priority: v })}
                >
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={formData.is_published}
                onCheckedChange={(v) => setFormData({ ...formData, is_published: v })}
              />
              <Label className="font-nunito font-semibold text-sm">
                Publish immediately
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="gradient-primary text-primary-foreground rounded-xl"
            >
              {saving ? "Saving..." : formMode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminAnnouncements;
