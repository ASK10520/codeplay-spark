import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Trophy, Sparkles, Zap, Target } from "lucide-react";

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

const MILESTONES = [
  { xp: 1000, label: "🥉", reward: "Bronze Coder" },
  { xp: 2000, label: "🥈", reward: "Silver Builder" },
  { xp: 2500, label: "🎁", reward: "Mystery Box" },
  { xp: 3000, label: "🥇", reward: "Gold Master" },
];

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function StudentProfileCard({ profile }: StudentProfileCardProps) {
  const xpProgress = (profile.xp / profile.xpToNextLevel) * 100;
  const xpRemaining = profile.xpToNextLevel - profile.xp;
  const isCloseToLevelUp = xpProgress >= 75;

  // Simulate streak calendar (current streak fills from today backwards)
  const streakDays = WEEK_DAYS.map((day, i) => ({
    day,
    active: i < profile.currentStreak,
    today: i === profile.currentStreak - 1,
  }));

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Header */}
      <div className="gradient-hero p-6 pb-8 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-2 right-8 text-3xl opacity-20 animate-float">✨</div>
        <div className="absolute bottom-2 right-16 text-2xl opacity-15 animate-bounce-slow">⭐</div>

        <div className="flex items-center gap-4 relative z-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl animate-float shadow-lg border-2 border-white/30">
            {profile.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-fredoka font-bold mb-1.5 truncate">
              Hi, {profile.name}! 👋
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="star" className="text-sm shadow-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                Level {profile.level}
              </Badge>
              <Badge variant="xp" className="text-sm shadow-sm">
                <Flame className="w-3 h-3 mr-1" />
                {profile.currentStreak} Day Streak 🔥
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 -mt-3 relative z-10">
        {/* XP Progress with Milestones */}
        <div className="mb-6 bg-card rounded-2xl p-4 border-2 border-border shadow-card">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-bold font-fredoka text-foreground flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-star" />
              XP to Level {profile.level + 1}
            </span>
            <span className="text-sm font-bold text-primary font-nunito">
              {profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()}
            </span>
          </div>

          {/* XP Bar with milestone markers */}
          <div className="relative mb-2">
            <Progress value={xpProgress} variant="xp" size="lg" />
            {/* Milestone dots */}
            <div className="absolute inset-0 flex items-center pointer-events-none">
              {MILESTONES.map((m) => {
                const pos = (m.xp / profile.xpToNextLevel) * 100;
                const reached = profile.xp >= m.xp;
                return (
                  <div
                    key={m.xp}
                    className="absolute -top-3 transform -translate-x-1/2"
                    style={{ left: `${pos}%` }}
                    title={`${m.reward} at ${m.xp} XP`}
                  >
                    <span className={`text-sm ${reached ? "opacity-100 scale-110" : "opacity-40 grayscale"} transition-all inline-block`}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level-up nudge */}
          {isCloseToLevelUp ? (
            <p className="text-xs font-nunito text-primary font-bold flex items-center gap-1 animate-pulse">
              <Target className="w-3.5 h-3.5" />
              Almost there! Only {xpRemaining} XP to Level {profile.level + 1}! 🚀
            </p>
          ) : (
            <p className="text-xs font-nunito text-muted-foreground">
              {xpRemaining} XP needed to reach Level {profile.level + 1}
            </p>
          )}
        </div>

        {/* Stats + Streak row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 col-span-2 sm:col-span-1">
            <div className="text-center p-3 rounded-xl bg-star/10 border-2 border-star/20 hover:scale-105 transition-transform">
              <Star className="w-5 h-5 mx-auto text-star mb-0.5" />
              <div className="text-xl font-fredoka font-bold text-foreground">
                {profile.totalStars}
              </div>
              <div className="text-[10px] text-muted-foreground font-nunito">Stars</div>
            </div>

            <div className="text-center p-3 rounded-xl bg-success/10 border-2 border-success/20 hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 mx-auto text-success mb-0.5" />
              <div className="text-xl font-fredoka font-bold text-foreground">
                {profile.completedCourses}
              </div>
              <div className="text-[10px] text-muted-foreground font-nunito">Done</div>
            </div>

            <div className="text-center p-3 rounded-xl bg-badge/10 border-2 border-badge/20 hover:scale-105 transition-transform">
              <div className="text-lg mb-0.5">{profile.badges.slice(0, 3).join("")}</div>
              <div className="text-xl font-fredoka font-bold text-foreground">
                {profile.badges.length}
              </div>
              <div className="text-[10px] text-muted-foreground font-nunito">Badges</div>
            </div>
          </div>

          {/* Streak Calendar */}
          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-primary/5 border-2 border-primary/15">
            <p className="text-xs font-bold font-fredoka text-foreground mb-2 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-primary" />
              This Week
            </p>
            <div className="flex items-center justify-between gap-1">
              {streakDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      d.active
                        ? d.today
                          ? "bg-primary text-primary-foreground shadow-md scale-110 ring-2 ring-primary/30"
                          : "bg-primary/80 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.active ? "🔥" : d.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
