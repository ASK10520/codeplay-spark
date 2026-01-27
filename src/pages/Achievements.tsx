import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AchievementBadge } from "@/components/achievements/AchievementBadge";
import { Section, SectionTitle } from "@/components/layout/PageContainer";
import { sampleAchievements, sampleStudentProfile } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target } from "lucide-react";

const Achievements = () => {
  const earnedCount = sampleAchievements.filter((a) => a.earned).length;
  const totalCount = sampleAchievements.length;
  const progressPercent = (earnedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <Section>
          <SectionTitle subtitle="Collect them all and become a coding champion!">
            🏆 Your Achievements
          </SectionTitle>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card variant="stats">
              <CardContent className="p-6 text-center">
                <Trophy className="w-10 h-10 mx-auto text-star mb-2" />
                <div className="text-3xl font-fredoka font-bold text-foreground">
                  {earnedCount}/{totalCount}
                </div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </CardContent>
            </Card>
            
            <Card variant="stats">
              <CardContent className="p-6 text-center">
                <Star className="w-10 h-10 mx-auto text-xp mb-2" />
                <div className="text-3xl font-fredoka font-bold text-foreground">
                  {sampleStudentProfile.totalStars}
                </div>
                <p className="text-sm text-muted-foreground">Total Stars</p>
              </CardContent>
            </Card>
            
            <Card variant="stats">
              <CardContent className="p-6 text-center">
                <Target className="w-10 h-10 mx-auto text-success mb-2" />
                <div className="text-3xl font-fredoka font-bold text-foreground">
                  Level {sampleStudentProfile.level}
                </div>
                <p className="text-sm text-muted-foreground">Current Level</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card variant="flat" className="mb-10 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-fredoka font-bold text-foreground">
                🎯 Badge Collection Progress
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                {earnedCount} of {totalCount} badges
              </span>
            </div>
            <Progress value={progressPercent} variant="xp" size="lg" />
          </Card>

          {/* Achievement Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sampleAchievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Achievements;
