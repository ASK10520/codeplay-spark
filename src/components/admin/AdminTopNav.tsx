import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, MessageSquare, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminTopNav() {
  const { user } = useAuth();

  return (
    <header className="h-14 border-b border-border/60 bg-background flex items-center gap-4 px-5 sticky top-0 z-30">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />

      {/* Search */}
      <div className="relative flex-1 max-w-lg hidden sm:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
        <Input
          placeholder="Search courses, students, payments..."
          className="pl-10 h-9 rounded-lg bg-muted/40 border border-border/40 text-sm font-nunito focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-muted-foreground/50"
        />
      </div>

      <div className="ml-auto flex items-center gap-0.5">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center bg-destructive text-destructive-foreground">
            3
          </span>
        </Button>

        {/* Messages */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          <MessageSquare className="h-[18px] w-[18px]" />
        </Button>

        {/* Settings */}
        <Link to="/admin/settings">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
            <Settings className="h-[18px] w-[18px]" />
          </Button>
        </Link>

        {/* Divider */}
        <div className="w-px h-7 bg-border/60 mx-2" />

        {/* Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="hidden md:block">
            <p className="text-[13px] font-semibold text-foreground font-nunito leading-tight truncate max-w-[120px]">
              {user?.email?.split("@")[0] || "Admin"}
            </p>
            <p className="text-[10px] text-muted-foreground/70 font-nunito">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
