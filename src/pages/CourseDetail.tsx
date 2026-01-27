import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/PageContainer";
import { LessonItem } from "@/components/lessons/LessonItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { sampleCourses, sampleLessons, courseCategories } from "@/data/mockData";
import { ArrowLeft, Play, Star, Clock, Users } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const course = sampleCourses.find((c) => c.id === id);
  const category = courseCategories.find((c) => c.id === course?.category);
  
  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h2 className="font-fredoka text-2xl font-bold mb-2">Course not found</h2>
          <Button onClick={() => navigate("/courses")} variant="fun">
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  const progress = (course.completedLessons / course.totalLessons) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <Section>
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-1">
              <Card variant="elevated" className="sticky top-24">
                {/* Thumbnail */}
                <div className={`h-48 ${category?.color || 'bg-muted'} flex items-center justify-center`}>
                  <span className="text-8xl">{course.thumbnail}</span>
                </div>
                
                <CardHeader>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="category">{category?.name}</Badge>
                    <Badge variant="age">{course.ageGroup}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{course.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Clock className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                      <div className="text-sm font-semibold">{course.totalLessons}</div>
                      <div className="text-xs text-muted-foreground">Lessons</div>
                    </div>
                    <div>
                      <Star className="w-5 h-5 mx-auto text-star mb-1" />
                      <div className="text-sm font-semibold">{course.stars}/5</div>
                      <div className="text-xs text-muted-foreground">Stars</div>
                    </div>
                    <div>
                      <Users className="w-5 h-5 mx-auto text-secondary mb-1" />
                      <div className="text-sm font-semibold">1.2K</div>
                      <div className="text-xs text-muted-foreground">Learners</div>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Your Progress</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} variant="course" size="lg" />
                  </div>
                  
                  {/* CTA */}
                  <Button variant="fun" size="lg" className="w-full">
                    <Play className="w-5 h-5" />
                    {progress > 0 ? "Continue Learning" : "Start Course"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Lessons List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-fredoka font-bold text-foreground mb-6">
                📚 Course Lessons
              </h2>
              
              <div className="space-y-3">
                {sampleLessons.map((lesson, index) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    index={index}
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
