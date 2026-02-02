<<<<<<< HEAD
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  School, 
  BarChart3, 
  Info,
  LogIn,
  UserPlus,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import uxmmLogo from "@/assets/uxmm-hub-logo.jpg";

export function CurriculumNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { path: "/curriculum", label: "Learn", icon: BookOpen },
    { path: "/teach", label: "Teach", icon: Users },
    { path: "/schools", label: "Schools", icon: School },
    { path: "/stats", label: "Stats", icon: BarChart3 },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b-2 border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={uxmmLogo} 
              alt="UXMM Hub Logo" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg transition-transform group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
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
            <Link to="/login" className="hidden sm:block">
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4" />
                Sign in
              </Button>
            </Link>
            <Link to="/signup" className="hidden sm:block">
              <Button variant="fun" size="sm">
                <UserPlus className="w-4 h-4" />
                Create account
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "fun" : "ghost"}
                      className="w-full justify-start"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="flex gap-2 pt-2 border-t border-border mt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button variant="fun" className="w-full">
                    <UserPlus className="w-4 h-4" />
                    Create account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
=======
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  School, 
  BarChart3, 
  Info,
  LogIn,
  UserPlus,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import uxmmLogo from "@/assets/uxmm-hub-logo.jpg";

export function CurriculumNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { path: "/curriculum", label: "Learn", icon: BookOpen },
    { path: "/teach", label: "Teach", icon: Users },
    { path: "/schools", label: "Schools", icon: School },
    { path: "/stats", label: "Stats", icon: BarChart3 },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b-2 border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={uxmmLogo} 
              alt="UXMM Hub Logo" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg transition-transform group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
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
            <Link to="/login" className="hidden sm:block">
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4" />
                Sign in
              </Button>
            </Link>
            <Link to="/signup" className="hidden sm:block">
              <Button variant="fun" size="sm">
                <UserPlus className="w-4 h-4" />
                Create account
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "fun" : "ghost"}
                      className="w-full justify-start"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="flex gap-2 pt-2 border-t border-border mt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button variant="fun" className="w-full">
                    <UserPlus className="w-4 h-4" />
                    Create account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
>>>>>>> refs/remotes/origin/main
