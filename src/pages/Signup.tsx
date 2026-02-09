import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import mascotRobot from "@/assets/mascot-robot.png";
import { ArrowLeft, UserPlus, Mail, Lock, User } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const avatars = ["🦊", "🐼", "🦁", "🐸", "🐱", "🐶", "🦄", "🐯"];
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.name, selectedAvatar);
    setIsLoading(false);

    if (error) {
      let message = "An error occurred during sign up.";
      if (error.message.includes("already registered")) {
        message = "This email is already registered. Please log in instead.";
      } else if (error.message.includes("valid email")) {
        message = "Please enter a valid email address.";
      }
      toast({
        title: "Sign Up Failed",
        description: message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account Created! 🎉",
      description: "Please check your email to confirm your account, then log in.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-float opacity-20">🎮</div>
        <div className="absolute top-20 right-20 text-3xl animate-float opacity-20" style={{ animationDelay: "0.5s" }}>🧩</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-20" style={{ animationDelay: "1s" }}>⭐</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card variant="elevated" className="overflow-hidden">
          {/* Header */}
          <div className="gradient-success p-6 text-center">
            <img 
              src={mascotRobot} 
              alt="Astro Hub Mascot" 
              className="w-16 h-16 mx-auto mb-2 animate-float"
            />
            <h1 className="text-2xl font-fredoka font-bold text-white">
              Join the Adventure! 🚀
            </h1>
            <p className="text-white/80 text-sm">
              Create your account and start learning!
            </p>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Avatar Selection */}
              <div className="space-y-2">
                <Label className="font-semibold">Choose Your Avatar</Label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-12 h-12 text-2xl rounded-xl transition-all ${
                        selectedAvatar === avatar
                          ? "bg-primary/20 ring-2 ring-primary scale-110"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">
                  Your Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="What's your name?"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password (min 6 chars)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-semibold">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" variant="success" size="lg" className="w-full" disabled={isLoading}>
                <UserPlus className="w-5 h-5" />
                {isLoading ? "Creating account..." : "Start Learning!"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
