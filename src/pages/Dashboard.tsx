import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StudentProfileCard } from "@/components/student/StudentProfileCard";
import { CourseCard } from "@/components/courses/CourseCard";
import { Section, SectionTitle } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sampleStudentProfile, sampleCourses } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, Target, ArrowRight, Zap } from "lucide-react";

const DAILY_CHALLENGES = [
  { id: "1", title: "Complete 1 lesson", xp: 50, icon: "📖", done: false },
  { id: "2", title: "Earn 3 stars", xp: 30, icon: "⭐", done: true },
  { id: "3", title: "Try a new course", xp: 40, icon: "🚀", done: false },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const inProgressCourses = sampleCourses.filter(
    (c) => c.completedLessons > 0 && c.completedLessons < c.totalLessons
  );

  const recommendedCourses = sampleCourses
    .filter((c) => c.completedLessons === 0)
    .slice(0, 3);

  // The course with most progress — hero resume
  const topCourse = [...inProgressCourses].sort(
    (a, b) =>
      b.completedLessons / b.totalLessons - a.completedLessons / a.totalLessons
  )[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-6">
        <Section className="py-0 md:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Profile + Daily Challenge */}
            <div className="lg:col-span-1 space-y-6">
              <StudentProfileCard profile={sampleStudentProfile} />

              {/* Daily Challenges */}
              <Card variant="elevated" className="overflow-hidden">
                <div className="bg-gradient-to-r from-star/20 to-primary/10 p-4 border-b border-border">
                  <h3 className="font-fredoka font-bold text-foreground flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Daily Challenges
                  </h3>
                  <p className="text-xs text-muted-foreground font-nunito mt-0.5">
                    Complete all 3 for a bonus 🎁
                  </p>
                </div>
                <CardContent className="p-4 space-y-2">
                  {DAILY_CHALLENGES.map((ch) => (
                    <div
                      key={ch.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all ${
                        ch.done
                          ? "bg-success/10 border-success/30 opacity-70"
                          : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                      }`}
                    >
                      <span className="text-xl">{ch.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-bold font-nunito ${
                            ch.done
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {ch.title}
                        </p>
                      </div>
                      <Badge
                        variant={ch.done ? "success" : "xp"}
                        className="text-xs shrink-0"
                      >
                        {ch.done ? "✓" : `+${ch.xp}`}
                        {!ch.done && (
                          <Zap className="w-3 h-3 ml-0.5" />
                        )}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right column: Resume + Courses */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Resume Hero */}
              {topCourse && (
                <Card
                  variant="interactive"
                  className="overflow-hidden bg-gradient-to-br from-secondary/10 via-card to-primary/5 border-2 border-secondary/20"
                  onClick={() => navigate(`/course/${topCourse.id}`)}
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-4xl shrink-0">
                      {topCourse.thumbnail}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-xs font-bold text-secondary font-nunito uppercase tracking-wide mb-0.5">
                        Continue where you left off
                      </p>
                      <h3 className="font-fredoka font-bold text-xl text-foreground mb-1">
                        {topCourse.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-nunito">
                        Lesson {topCourse.completedLessons + 1} of{" "}
                        {topCourse.totalLessons} •{" "}
                        {Math.round(
                          (topCourse.completedLessons / topCourse.totalLessons) *
                            100
                        )}
                        % complete
                      </p>
                    </div>
                    <Button variant="fun" size="lg" className="shrink-0 gap-2">
                      <Play className="w-5 h-5" />
                      Resume
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* In Progress */}
              {inProgressCourses.length > 0 && (
                <div>
                  <SectionTitle subtitle="Pick up where you left off!">
                    🎯 In Progress
                  </SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {inProgressCourses.map((course, i) => (
                      <div
                        key={course.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <CourseCard
                          course={course}
                          onClick={() => navigate(`/course/${course.id}`)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <SectionTitle
                    subtitle="Start a new adventure!"
                    className="mb-0"
                  >
                    ✨ Recommended For You
                  </SectionTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => navigate("/courses")}
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {recommendedCourses.map((course, i) => (
                    <div
                      key={course.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <CourseCard
                        course={course}
                        onClick={() => navigate(`/course/${course.id}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
