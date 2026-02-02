import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Star, Sparkles, Rocket, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_popular: boolean;
}

const planIcons: Record<string, React.ReactNode> = {
  "Free Trial": <Star className="w-8 h-8" />,
  "Explorer": <Rocket className="w-8 h-8" />,
  "Champion": <Sparkles className="w-8 h-8" />,
  "School": <Building2 className="w-8 h-8" />,
};

const planColors: Record<string, string> = {
  "Free Trial": "bg-muted",
  "Explorer": "bg-secondary",
  "Champion": "bg-gradient-to-br from-primary to-secondary",
  "School": "bg-badge",
};

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price_monthly", { ascending: true });

      if (error) {
        console.error("Error fetching plans:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription plans",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Parse features from JSONB
      const parsedPlans = data?.map((plan) => ({
        ...plan,
        features: Array.isArray(plan.features)
          ? (plan.features as unknown as string[])
          : JSON.parse(String(plan.features) || "[]"),
      })) || [];
      setPlans(parsedPlans);
      setLoading(false);
    };

    fetchPlans();
  }, [toast]);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in or create an account to subscribe",
      });
      navigate("/signup");
      return;
    }

    // For now, create a subscription (in production, integrate with Stripe)
    const periodEnd = new Date();
    if (plan.name === "Free Trial") {
      periodEnd.setDate(periodEnd.getDate() + 7); // 7-day trial
    } else if (isYearly) {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const { error } = await supabase.from("user_subscriptions").insert({
      user_id: user.id,
      plan_id: plan.id,
      status: plan.name === "Free Trial" ? "trial" : "active",
      billing_cycle: isYearly ? "yearly" : "monthly",
      current_period_end: periodEnd.toISOString(),
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already subscribed",
          description: "You already have an active subscription",
          variant: "destructive",
        });
      } else {
        console.error("Subscription error:", error);
        toast({
          title: "Error",
          description: "Failed to create subscription",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "🎉 Welcome aboard!",
        description: `You're now subscribed to ${plan.name}`,
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="star" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Simple Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-foreground mb-4">
              Choose Your Adventure! 🚀
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pick the perfect plan for your young coder. All plans include our safe, ad-free learning environment.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Label 
                htmlFor="billing-toggle" 
                className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <Label 
                htmlFor="billing-toggle" 
                className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
              >
                Yearly
                <Badge variant="success" className="ml-2 text-xs">
                  Save 17%
                </Badge>
              </Label>
            </div>
          </div>

          {/* Plans Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                    plan.is_popular ? "ring-2 ring-primary shadow-xl" : ""
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
                      ⭐ Most Popular
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${planColors[plan.name]} text-white flex items-center justify-center mb-4`}>
                      {planIcons[plan.name]}
                    </div>
                    <CardTitle className="font-fredoka text-2xl">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Price */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground">
                        ${isYearly ? plan.price_yearly : plan.price_monthly}
                        {plan.price_monthly > 0 && (
                          <span className="text-lg font-normal text-muted-foreground">
                            /{isYearly ? "year" : "mo"}
                          </span>
                        )}
                      </div>
                      {plan.price_monthly === 0 && (
                        <span className="text-sm text-muted-foreground">7 days free</span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      variant={plan.is_popular ? "fun" : "outline"}
                      size="lg"
                      className="w-full"
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {plan.price_monthly === 0 ? "Start Free Trial" : "Get Started"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">Trusted by parents worldwide</p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span className="text-sm font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span className="text-sm font-medium">Kid-Safe Content</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <span className="text-sm font-medium">Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <span className="text-sm font-medium">7-Day Money Back</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
