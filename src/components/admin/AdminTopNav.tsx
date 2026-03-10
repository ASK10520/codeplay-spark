import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MessageSquare, Settings, ChevronDown, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchBar } from "./AdminSearchBar";
import { AdminNotifications } from "./AdminNotifications";

export function AdminTopNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border/40 bg-background sticky top-0 z-30 flex items-center px-6 md:px-8 gap-5">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors -ml-1" />

      <AdminSearchBar />

      <div className="ml-auto flex items-center gap-1.5">
        <AdminNotifications />

        <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150">
          <MessageSquare className="h-[18px] w-[18px]" />
        </button>

        <Link to="/admin/settings" className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150">
          <Settings className="h-[18px] w-[18px]" />
        </Link>

        <div className="w-px h-8 bg-border/50 mx-3" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-all duration-150 group outline-none">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-[13px] font-semibold text-foreground font-nunito leading-tight truncate max-w-[130px]">
                  {user?.email?.split("@")[0] || "Admin"}
                </span>
                <span className="text-[11px] text-muted-foreground/60 font-nunito leading-tight">Super Admin</span>
              </div>
              <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-nunito">
              <p className="text-sm font-semibold">{user?.email?.split("@")[0] || "Admin"}</p>
              <p className="text-xs text-muted-foreground font-normal truncate">{user?.email || "admin@example.com"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}