import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  achievement: {
    id: string;
    name: string;
    icon: string;
    earned: boolean;
    description: string;
  };
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <Card
      variant={achievement.earned ? "achievement" : "flat"}
      className={cn(
        "p-4 text-center transition-all duration-300",
        achievement.earned 
          ? "hover:scale-105 cursor-pointer" 
          : "opacity-50 grayscale"
      )}
    >
      <div 
        className={cn(
          "text-4xl mb-2",
          achievement.earned && "animate-bounce-in"
        )}
      >
        {achievement.icon}
      </div>
      <h4 className="font-fredoka font-bold text-sm text-foreground mb-1">
        {achievement.name}
      </h4>
      <p className="text-xs text-muted-foreground">
        {achievement.description}
      </p>
      {achievement.earned && (
        <span className="inline-block mt-2 text-xs font-bold text-success">
          ✓ Earned!
        </span>
      )}
    </Card>
  );
}
