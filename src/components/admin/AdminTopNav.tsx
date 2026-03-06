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
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center gap-3 px-4 sticky top-0 z-30">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search courses, students, payments..."
          className="pl-9 h-9 rounded-full bg-muted/50 border-0 text-sm font-nunito focus-visible:ring-1"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 p-0 text-[10px] flex items-center justify-center gradient-primary text-primary-foreground border-0">
            3
          </Badge>
        </Button>

        {/* Messages */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
          <MessageSquare className="h-4 w-4" />
        </Button>

        {/* Settings */}
        <Link to="/admin/settings">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>

        {/* Profile */}
        <div className="flex items-center gap-2.5 ml-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-foreground font-nunito leading-tight truncate max-w-[120px]">
              {user?.email?.split("@")[0] || "Admin"}
            </p>
            <p className="text-[10px] text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
