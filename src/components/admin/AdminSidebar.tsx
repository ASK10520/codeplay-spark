import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  UserCog,
  ClipboardList,
  CreditCard,
  Award,
  Megaphone,
  MessageSquare,
  Star,
  BarChart3,
  FolderOpen,
  Shield,
  Settings,
  ScrollText,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainMenu = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/courses", label: "Courses", icon: BookOpen },
  { path: "/admin/curriculum", label: "Curriculum Builder", icon: GraduationCap },
  { path: "/admin/students", label: "Students", icon: Users },
  { path: "/admin/instructors", label: "Instructors", icon: UserCog },
  { path: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
  { path: "/admin/payments", label: "Payments", icon: CreditCard },
];

const secondaryMenu = [
  { path: "/admin/certificates", label: "Certificates", icon: Award },
  { path: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare },
  { path: "/admin/reviews", label: "Reviews", icon: Star },
];

const systemMenu = [
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/content", label: "Content Manager", icon: FolderOpen },
  { path: "/admin/roles", label: "Admins / Roles", icon: Shield },
  { path: "/admin/settings", label: "Settings", icon: Settings },
  { path: "/admin/activity-logs", label: "Activity Logs", icon: ScrollText },
];

function MenuSection({
  items,
  label,
  collapsed,
}: {
  items: typeof mainMenu;
  label: string;
  collapsed: boolean;
}) {
  const location = useLocation();

  return (
    <SidebarGroup className="mb-6">
      {!collapsed && (
        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-4 mb-3 font-semibold">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    "transition-all duration-300 rounded-xl mx-2 h-11 group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-lg shadow-sidebar-accent/10"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 hover:shadow-md"
                  )}
                >
                  <Link to={item.path} className="flex items-center w-full">
                    <item.icon className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-300",
                      isActive ? "scale-110" : "group-hover:scale-105"
                    )} />
                    {!collapsed && (
                      <span className="font-nunito text-sm ml-3">{item.label}</span>
                    )}
                    {isActive && !collapsed && (
                      <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-70" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AdminSidebar() {
  const { signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 bg-[linear-gradient(180deg,hsl(var(--sidebar-background)),hsl(var(--sidebar-accent)/0.72))]"
      style={{ width: collapsed ? '4rem' : '260px' }}
    >
      <SidebarHeader className="p-5 border-b border-sidebar-border/20">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shrink-0 ring-2 ring-sidebar-accent/20">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-fredoka font-bold text-lg text-sidebar-foreground leading-tight truncate">
                CodePlay Spark
              </h1>
              <p className="text-[10px] text-sidebar-foreground/40 font-nunito tracking-wide">Admin Panel</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4 px-0 overflow-y-auto scrollbar-hide">
        <MenuSection items={mainMenu} label="Main" collapsed={collapsed} />
        <MenuSection items={secondaryMenu} label="Engagement" collapsed={collapsed} />
        <MenuSection items={systemMenu} label="System" collapsed={collapsed} />
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3 border-t border-sidebar-border/20">
        {!collapsed && (
          <div className="rounded-2xl bg-gradient-to-br from-sidebar-accent/40 to-sidebar-accent/20 p-4 text-center border border-sidebar-border/10">
            <p className="text-xs text-sidebar-foreground/70 font-nunito mb-3 leading-relaxed">
              Upgrade to Pro for advanced analytics
            </p>
            <Button
              size="sm"
              className="w-full gradient-primary text-primary-foreground font-semibold text-xs h-9 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Upgrade Plan
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Link to="/" className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 text-xs rounded-xl transition-all duration-300"
            >
              ← {!collapsed && "Back to Site"}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 h-9 w-9 shrink-0 rounded-xl transition-all duration-300"
            onClick={signOut}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
