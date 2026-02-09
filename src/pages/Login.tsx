import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import mascotRobot from "@/assets/mascot-robot.png";
import { ArrowLeft, LogIn, Mail, Lock } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      let message = "An error occurred during login.";
      if (error.message.includes("Invalid login credentials")) {
        message = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        message = "Please confirm your email before logging in.";
      }
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome back! 🎉",
      description: "You are now logged in.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-float opacity-20">🎮</div>
        <div className="absolute top-20 right-20 text-3xl animate-float opacity-20" style={{ animationDelay: "0.5s" }}>🧩</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-20" style={{ animationDelay: "1s" }}>⭐</div>
        <div className="absolute bottom-10 right-1/4 text-3xl animate-float opacity-20" style={{ animationDelay: "1.5s" }}>🚀</div>
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
          <div className="gradient-hero p-6 text-center">
            <img 
              src={mascotRobot} 
              alt="Astro Hub Mascot" 
              className="w-20 h-20 mx-auto mb-3 animate-float"
            />
            <h1 className="text-2xl font-fredoka font-bold text-white">
              Welcome Back! 👋
            </h1>
            <p className="text-white/80 text-sm">
              Ready to continue your adventure?
            </p>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" variant="fun" size="lg" className="w-full" disabled={isLoading}>
                <LogIn className="w-5 h-5" />
                {isLoading ? "Logging in..." : "Let's Go!"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
