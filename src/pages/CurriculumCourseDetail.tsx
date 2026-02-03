import { useParams, useNavigate, Link } from "react-router-dom";
import { curriculumCourses, curriculumFilters } from "@/data/curriculumData";
import { CurriculumNavbar } from "@/components/curriculum/CurriculumNavbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  Smartphone,
  Tablet,
  Monitor,
  Target,
  Sparkles,
  GraduationCap,
  Trophy,
  ChevronDown,
  Play,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

const CurriculumCourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openWeeks, setOpenWeeks] = useState<number[]>([1]);

  const course = curriculumCourses.find((c) => c.id === id);
  const topic = curriculumFilters.topics.find((t) => t.id === course?.topic);
  const TopicIcon = topic?.icon;
  const grade = curriculumFilters.grades.find((g) => g.id === course?.gradeRange);

  const deviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <CurriculumNavbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-fredoka text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, we couldn't find the course you're looking for.
          </p>
          <Button onClick={() => navigate("/curriculum")} variant="hero">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Curriculum
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleWeek = (week: number) => {
    setOpenWeeks((prev) =>
      prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <CurriculumNavbar />

      <main>
        {/* Hero Section */}
        <section
          className={cn(
            "relative py-12 md:py-20 bg-gradient-to-br overflow-hidden",
            course.color
          )}
        >
          <div className="container mx-auto px-4">
            {/* Back button */}
            <Link
              to="/curriculum"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Curriculum
            </Link>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Course thumbnail */}
              <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-background/50 backdrop-blur flex items-center justify-center shadow-lg">
                <span className="text-7xl md:text-8xl drop-shadow-lg">
                  {course.thumbnail}
                </span>
              </div>

              {/* Course info */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.isNew && (
                    <Badge className="bg-funPink text-white border-0 gap-1 animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      New
                    </Badge>
                  )}
                  <Badge className={cn("border-0 text-white", topic?.color)}>
                    {TopicIcon && <TopicIcon className="w-3 h-3 mr-1" />}
                    {topic?.label}
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    {grade?.label}
                  </Badge>
                </div>

                <h1 className="font-fredoka text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  {course.title}
                </h1>
                {course.titleMm && (
                  <p className="text-lg text-muted-foreground mb-4">
                    {course.titleMm}
                  </p>
                )}

                <p className="text-lg text-foreground/80 mb-6 max-w-2xl">
                  {course.description}
                </p>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span>{grade?.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.devices.map((device) => {
                      const Icon = deviceIcons[device as keyof typeof deviceIcons];
                      return (
                        <div
                          key={device}
                          className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center"
                          title={device}
                        >
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      );
                    })}
                  </div>
                  <Badge variant="outline" className="bg-background/50">
                    {curriculumFilters.languages.find((l) => l.id === course.language)?.label}
                  </Badge>
                </div>

                {/* Progress if enrolled */}
                {course.progress !== undefined && course.progress > 0 && (
                  <div className="mb-6 max-w-md">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Your progress</span>
                      <span className="font-semibold text-primary">{course.progress}% complete</span>
                    </div>
                    <Progress value={course.progress} variant="course" />
                  </div>
                )}

                {/* CTA Button */}
                <Button variant="hero" size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  {course.progress ? "Continue Learning" : "Start Learning"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                {course.overview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-fredoka flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Course Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80 leading-relaxed">
                        {course.overview}
                      </p>
                      {course.overviewMm && (
                        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                          {course.overviewMm}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Learning Objectives */}
                {course.learningObjectives && course.learningObjectives.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-fredoka flex items-center gap-2">
                        <Target className="w-5 h-5 text-secondary" />
                        What Your Child Will Learn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {course.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Weekly Breakdown */}
                {course.weeklyBreakdown && course.weeklyBreakdown.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-fredoka flex items-center gap-2">
                        <Clock className="w-5 h-5 text-badge" />
                        Weekly Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {course.weeklyBreakdown.map((week) => (
                        <Collapsible
                          key={week.week}
                          open={openWeeks.includes(week.week)}
                          onOpenChange={() => toggleWeek(week.week)}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-fredoka font-bold text-primary">
                                {week.week}
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-foreground">
                                  Week {week.week}: {week.title}
                                </h4>
                              </div>
                            </div>
                            <ChevronDown
                              className={cn(
                                "w-5 h-5 text-muted-foreground transition-transform",
                                openWeeks.includes(week.week) && "rotate-180"
                              )}
                            />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pt-3 pb-1">
                            <p className="text-muted-foreground pl-14">
                              {week.description}
                            </p>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Key Skills */}
                {course.keySkills && course.keySkills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-fredoka flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-star" />
                        Skills Gained
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {course.keySkills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border-0"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Who This Is For */}
                {course.whoIsThisFor && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-fredoka flex items-center gap-2 text-lg">
                        <GraduationCap className="w-5 h-5 text-success" />
                        Who This Is For
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Age Group</p>
                        <p className="font-semibold text-foreground">
                          {course.whoIsThisFor.ageGroup}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Skill Level</p>
                        <p className="font-semibold text-foreground">
                          {course.whoIsThisFor.skillLevel}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Best For</p>
                        <p className="font-semibold text-foreground">
                          {course.whoIsThisFor.prerequisites}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Course Outcome */}
                {course.outcome && (
                  <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="font-fredoka flex items-center gap-2 text-lg">
                        <Trophy className="w-5 h-5 text-star" />
                        By The End...
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80 leading-relaxed">
                        {course.outcome}
                      </p>
                      {course.outcomeMm && (
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                          {course.outcomeMm}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Enroll CTA */}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="pt-6">
                    <h3 className="font-fredoka text-xl font-bold mb-2">
                      Ready to Start?
                    </h3>
                    <p className="text-primary-foreground/80 mb-4">
                      Begin your coding adventure today!
                    </p>
                    <Button
                      variant="secondary"
                      className="w-full bg-background text-foreground hover:bg-background/90"
                      size="lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {course.progress ? "Continue Learning" : "Enroll Now"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CurriculumCourseDetail;