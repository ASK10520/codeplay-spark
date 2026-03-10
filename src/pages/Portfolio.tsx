import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionTitle } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ExternalLink, Code2, Trash2, Eye, EyeOff, Pencil, Loader2, FolderOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  description: string | null;
  language: string;
  code_snippet: string | null;
  screenshot_url: string | null;
  demo_link: string | null;
  is_published: boolean;
  created_at: string;
}

const LANGUAGES = [
  { value: "scratch", label: "Scratch", emoji: "🐱" },
  { value: "python", label: "Python", emoji: "🐍" },
  { value: "html", label: "HTML/CSS", emoji: "🌐" },
  { value: "javascript", label: "JavaScript", emoji: "⚡" },
];

const Portfolio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", language: "scratch", code_snippet: "", demo_link: "" });
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_emoji: string | null; bio: string | null; skills: string[] }>({ display_name: null, avatar_emoji: "🦊", bio: null, skills: [] });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProjects();
    fetchProfile();
  }, [user]);

  const fetchProjects = async () => {
    const { data, error } = await (supabase as any)
      .from("student_projects")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (!error && data) setProjects(data as Project[]);
    setLoading(false);
  };

  const fetchProfile = async () => {
    const { data } = await (supabase as any)
      .from("profiles")
      .select("display_name, avatar_emoji, bio, skills")
      .eq("user_id", user!.id)
      .single();
    if (data) setProfile(data);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Project title is required"); return; }
    setSaving(true);

    const payload = {
      user_id: user!.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      language: form.language,
      code_snippet: form.code_snippet.trim() || null,
      demo_link: form.demo_link.trim() || null,
    };

    let error;
    if (editingId) {
      ({ error } = await (supabase as any).from("student_projects").update(payload).eq("id", editingId));
    } else {
      ({ error } = await (supabase as any).from("student_projects").insert(payload));
    }

    setSaving(false);
    if (error) { toast.error("Failed to save project"); return; }
    toast.success(editingId ? "Project updated!" : "Project added! 🎉");
    setDialogOpen(false);
    setEditingId(null);
    setForm({ title: "", description: "", language: "scratch", code_snippet: "", demo_link: "" });
    fetchProjects();
  };

  const togglePublish = async (project: Project) => {
    const { error } = await (supabase as any).from("student_projects").update({ is_published: !project.is_published }).eq("id", project.id);
    if (!error) {
      toast.success(project.is_published ? "Project hidden" : "Project published! 🌟");
      fetchProjects();
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await (supabase as any).from("student_projects").delete().eq("id", id);
    if (!error) { toast.success("Project deleted"); fetchProjects(); }
  };

  const openEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description || "", language: p.language, code_snippet: p.code_snippet || "", demo_link: p.demo_link || "" });
    setDialogOpen(true);
  };

  const langInfo = (val: string) => LANGUAGES.find((l) => l.value === val) || LANGUAGES[0];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <Section>
          {/* Profile Header */}
          <Card variant="elevated" className="mb-8 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--badge-purple))]" />
            <CardContent className="p-6 -mt-10 flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card flex items-center justify-center text-4xl shadow-md">
                {profile.avatar_emoji || "🦊"}
              </div>
              <div className="flex-1">
                <h1 className="font-fredoka font-bold text-2xl text-foreground">{profile.display_name || "Student"}</h1>
                <p className="text-sm text-muted-foreground mt-1">{profile.bio || "Aspiring young coder! 🚀"}</p>
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {profile.skills.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Badge variant="xp" className="text-sm">{projects.length} Projects</Badge>
                <Badge variant="level" className="text-sm">{projects.filter((p) => p.is_published).length} Published</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Projects Header */}
          <div className="flex items-center justify-between mb-6">
            <SectionTitle subtitle="Showcase your coding creations!">🎨 My Projects</SectionTitle>
            <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setEditingId(null); setForm({ title: "", description: "", language: "scratch", code_snippet: "", demo_link: "" }); } }}>
              <DialogTrigger asChild>
                <Button variant="fun" size="sm"><Plus className="w-4 h-4" /> Add Project</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-fredoka">{editingId ? "Edit Project" : "Add New Project"} 🚀</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Project Title</label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My Awesome Game" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Language</label>
                    <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.value} value={l.value}>{l.emoji} {l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Description</label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does your project do?" rows={3} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Code Snippet (optional)</label>
                    <Textarea value={form.code_snippet} onChange={(e) => setForm({ ...form, code_snippet: e.target.value })} placeholder="Paste your best code here..." rows={4} className="font-mono text-xs" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Demo Link (optional)</label>
                    <Input value={form.demo_link} onChange={(e) => setForm({ ...form, demo_link: e.target.value })} placeholder="https://scratch.mit.edu/projects/..." />
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="w-full" variant="fun">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {editingId ? "Update Project" : "Add Project"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>
          ) : projects.length === 0 ? (
            <Card variant="flat" className="text-center py-16">
              <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
              <p className="font-fredoka font-bold text-xl text-muted-foreground">No projects yet!</p>
              <p className="text-sm text-muted-foreground mt-1">Add your first project to start building your portfolio 🎯</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const lang = langInfo(project.language);
                return (
                  <Card key={project.id} variant="elevated" className="group overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Language Banner */}
                    <div className="h-3 bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--badge-purple))]" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{lang.emoji}</span>
                          <Badge variant="outline" className="text-xs">{lang.label}</Badge>
                        </div>
                        <Badge variant={project.is_published ? "success" : "secondary"} className="text-[10px]">
                          {project.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <h3 className="font-fredoka font-bold text-lg text-foreground mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description || "No description"}</p>

                      {project.code_snippet && (
                        <pre className="bg-muted rounded-lg p-3 text-xs font-mono overflow-x-auto max-h-24 mb-3 text-muted-foreground">
                          {project.code_snippet}
                        </pre>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(project)} title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => togglePublish(project)} title={project.is_published ? "Unpublish" : "Publish"}>
                            {project.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => deleteProject(project.id)} title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        {project.demo_link && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.demo_link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3.5 h-3.5" /> Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
