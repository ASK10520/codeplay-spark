import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Trophy, Sparkles } from "lucide-react";

interface StudentProfileCardProps {
  profile: {
    name: string;
    avatar: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    totalStars: number;
    completedCourses: number;
    currentStreak: number;
    badges: string[];
  };
}

export function StudentProfileCard({ profile }: StudentProfileCardProps) {
  const xpProgress = (profile.xp / profile.xpToNextLevel) * 100;

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Header with gradient */}
      <div className="gradient-hero p-6 text-white">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl animate-float">
            {profile.avatar}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-fredoka font-bold mb-1">
              Hi, {profile.name}! 👋
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="star" className="text-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                Level {profile.level}
              </Badge>
              <Badge variant="xp" className="text-sm">
                <Flame className="w-3 h-3 mr-1" />
                {profile.currentStreak} Day Streak
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* XP Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-muted-foreground">
              XP to Level {profile.level + 1}
            </span>
            <span className="text-sm font-bold text-primary">
              {profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()}
            </span>
          </div>
          <Progress value={xpProgress} variant="xp" size="lg" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-xl bg-star/10 border-2 border-star/20">
            <Star className="w-6 h-6 mx-auto text-star mb-1" />
            <div className="text-2xl font-fredoka font-bold text-foreground">
              {profile.totalStars}
            </div>
            <div className="text-xs text-muted-foreground">Stars</div>
          </div>
          
          <div className="text-center p-3 rounded-xl bg-success/10 border-2 border-success/20">
            <Trophy className="w-6 h-6 mx-auto text-success mb-1" />
            <div className="text-2xl font-fredoka font-bold text-foreground">
              {profile.completedCourses}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          
          <div className="text-center p-3 rounded-xl bg-badge/10 border-2 border-badge/20">
            <div className="text-2xl mb-1">{profile.badges.slice(0, 3).join(" ")}</div>
            <div className="text-2xl font-fredoka font-bold text-foreground">
              {profile.badges.length}
            </div>
            <div className="text-xs text-muted-foreground">Badges</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
