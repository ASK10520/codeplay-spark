import { Card, CardContent } from "@/components/ui/card";
import { Star, Trophy, Shield, Zap, Sparkles, Heart } from "lucide-react";

const features = [
  {
    icon: Star,
    title: "Earn Stars & Badges",
    description: "Complete lessons and challenges to earn rewards!",
    color: "text-star bg-star/10",
  },
  {
    icon: Trophy,
    title: "Level Up",
    description: "Gain XP and unlock new exciting content!",
    color: "text-badge bg-badge/10",
  },
  {
    icon: Zap,
    title: "Interactive Learning",
    description: "Drag, drop, and play your way to success!",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Shield,
    title: "Safe & Kid-Friendly",
    description: "A secure environment with parental controls.",
    color: "text-success bg-success/10",
  },
  {
    icon: Sparkles,
    title: "Self-Paced Learning",
    description: "Learn at your own speed, no pressure!",
    color: "text-secondary bg-secondary/10",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Designed by educators who care about kids.",
    color: "text-funPink bg-funPink/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-foreground mb-3">
            Why Kids Love Us! 💝
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            CodePlay Kids is designed to make learning fun, safe, and rewarding for every child.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title}
                variant="elevated" 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-fredoka font-bold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
