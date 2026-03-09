import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Users, CreditCard, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "course" | "student" | "payment";
  route: string;
}

export function AdminSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeout = setTimeout(() => {
      performSearch(trimmed);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  async function performSearch(term: string) {
    setLoading(true);
    try {
      const [coursesRes, enrollmentsRes, paymentsRes] = await Promise.all([
        supabase
          .from("courses")
          .select("id, title, category")
          .ilike("title", `%${term}%`)
          .limit(5),
        supabase
          .from("enrollments")
          .select("id, child_name, parent_email, course_id")
          .ilike("child_name", `%${term}%`)
          .limit(5),
        supabase
          .from("payment_submissions")
          .select("id, student_name, status, course_fee")
          .ilike("student_name", `%${term}%`)
          .limit(5),
      ]);

      const mapped: SearchResult[] = [];

      coursesRes.data?.forEach((c) =>
        mapped.push({
          id: c.id,
          title: c.title,
          subtitle: c.category,
          type: "course",
          route: `/admin/courses`,
        })
      );

      enrollmentsRes.data?.forEach((e) =>
        mapped.push({
          id: e.id,
          title: e.child_name,
          subtitle: e.parent_email,
          type: "student",
          route: `/admin/enrollments`,
        })
      );

      paymentsRes.data?.forEach((p) =>
        mapped.push({
          id: p.id,
          title: p.student_name,
          subtitle: `${p.status} · ${p.course_fee} MMK`,
          type: "payment",
          route: `/admin/payments`,
        })
      );

      setResults(mapped);
      setIsOpen(mapped.length > 0);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  const iconMap = {
    course: <BookOpen className="h-4 w-4 text-primary" />, 
    student: <Users className="h-4 w-4 text-emerald-500" />,
    payment: <CreditCard className="h-4 w-4 text-amber-500" />,
  };

  const labelMap = {
    course: "Course",
    student: "Student",
    payment: "Payment",
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl hidden sm:block">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
      <Input
        placeholder="Search courses, students, payments..."
        className="pl-10 pr-8 h-10 rounded-full bg-muted/30 border-none text-sm font-nunito focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-muted-foreground/40 shadow-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
      />
      {query && (
        <button
          onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-150">
          {loading && (
            <div className="px-4 py-3 text-sm text-muted-foreground">Searching…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
          )}
          <div className="max-h-[320px] overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.id}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50 transition-colors"
                onClick={() => {
                  navigate(r.route);
                  setIsOpen(false);
                  setQuery("");
                  setResults([]);
                }}
              >
                <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                  {iconMap[r.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground/60 bg-muted/40 px-2 py-0.5 rounded-full shrink-0">
                  {labelMap[r.type]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
