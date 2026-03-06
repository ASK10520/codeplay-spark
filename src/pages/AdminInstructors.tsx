import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserCog, BookOpen, Users, Star } from "lucide-react";

interface TeacherRow {
  id: string;
  name: string;
  name_mm: string | null;
  role: string;
  photo_url: string | null;
  bio: string | null;
  created_at: string;
}

const AdminInstructors = () => {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("teachers")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTeachers((data as TeacherRow[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = teachers.filter(
    (t) =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.name_mm || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-foreground flex items-center gap-2">
            <UserCog className="w-7 h-7" /> Instructors
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-nunito">
            {teachers.length} instructors
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search instructors..."
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
              No instructors found.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <Card key={t.id} className="border-0 shadow-card hover:shadow-hover transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-muted">
                      {t.photo_url ? (
                        <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full gradient-secondary flex items-center justify-center text-xl font-bold text-secondary-foreground">
                          {t.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-fredoka font-bold text-foreground text-sm">{t.name}</h3>
                      {t.name_mm && (
                        <p className="text-xs text-muted-foreground">{t.name_mm}</p>
                      )}
                      <Badge variant="outline" className="text-[10px] mt-1">{t.role}</Badge>
                    </div>
                  </div>
                  {t.bio && (
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2 font-nunito">
                      {t.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInstructors;
