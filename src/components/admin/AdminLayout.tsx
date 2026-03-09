import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopNav } from "./AdminTopNav";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, hasRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !hasRole("admin"))) {
      navigate("/");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !hasRole("admin")) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <AdminTopNav />
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-6 lg:p-8 max-w-[1600px]">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
