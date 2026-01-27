import { Link } from "react-router-dom";
import mascotRobot from "@/assets/mascot-robot.png";

export function Footer() {
  return (
    <footer className="bg-card border-t-2 border-border py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src={mascotRobot} 
                alt="CodePlay Mascot" 
                className="w-12 h-12"
              />
              <span className="text-xl font-fredoka font-bold text-gradient">
                CodePlay Kids
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Making coding fun and accessible for every child! 🚀
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-fredoka font-bold text-foreground mb-4">Learn</h4>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">All Courses</Link></li>
              <li><Link to="/courses?age=6-8" className="text-muted-foreground hover:text-primary transition-colors">Ages 6-8</Link></li>
              <li><Link to="/courses?age=9-11" className="text-muted-foreground hover:text-primary transition-colors">Ages 9-11</Link></li>
              <li><Link to="/courses?age=12-14" className="text-muted-foreground hover:text-primary transition-colors">Ages 12-14</Link></li>
            </ul>
          </div>

          {/* For Parents */}
          <div>
            <h4 className="font-fredoka font-bold text-foreground mb-4">For Parents</h4>
            <ul className="space-y-2">
              <li><Link to="/parent" className="text-muted-foreground hover:text-primary transition-colors">Parent Dashboard</Link></li>
              <li><Link to="/parent/progress" className="text-muted-foreground hover:text-primary transition-colors">Progress Reports</Link></li>
              <li><Link to="/parent/safety" className="text-muted-foreground hover:text-primary transition-colors">Safety & Privacy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-fredoka font-bold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/teachers" className="text-muted-foreground hover:text-primary transition-colors">For Teachers</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 CodePlay Kids LMS. Made with ❤️ for young learners everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
