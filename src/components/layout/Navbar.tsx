import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  Trophy, 
  User, 
  LogIn,
  Sparkles
} from "lucide-react";
import mascotRobot from "@/assets/mascot-robot.png";

export function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/courses", label: "Courses", icon: BookOpen },
    { path: "/dashboard", label: "My Learning", icon: Sparkles },
    { path: "/achievements", label: "Achievements", icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b-2 border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={mascotRobot} 
              alt="CodePlay Mascot" 
              className="w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-110 group-hover:rotate-6"
            />
            <span className="text-xl md:text-2xl font-fredoka font-bold text-gradient hidden sm:block">
              CodePlay Kids
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "fun" : "ghost"}
                    size="sm"
                    className={isActive ? "" : "text-muted-foreground hover:text-foreground"}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="fun" size="sm">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around py-2 border-t border-border">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                >
                  <item.icon className="w-5 h-5" />
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
