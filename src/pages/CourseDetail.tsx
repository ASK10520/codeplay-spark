import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/PageContainer";
import { LessonItem } from "@/components/lessons/LessonItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckoutDialog } from "@/components/enrollment/CheckoutDialog";
import { LockedLessonDialog } from "@/components/enrollment/LockedLessonDialog";
import { sampleCourses, sampleLessons, courseCategories } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { isUserEnrolled } from "@/services/enrollmentService";
import { getUserPaymentStatus } from "@/services/paymentService";
import { ArrowLeft, Play, Star, Clock, Users, Sparkles, Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loadingAccess, setLoadingAccess] = useState(true);

  const course = sampleCourses.find((c) => c.id === id);
  const category = courseCategories.find((c) => c.id === course?.category);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !id) {
        setLoadingAccess(false);
        return;
      }
      try {
        const isEnrolled = await isUserEnrolled(user.id, id);
        setEnrolled(isEnrolled);

        if (!isEnrolled) {
          const payment = await getUserPaymentStatus(user.id, id);
          setPaymentStatus(payment?.status || null);
        }
      } catch {
        // ignore
      } finally {
        setLoadingAccess(false);
      }
    };
    checkAccess();
  }, [user, id]);

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

  const progress = enrolled ? (course.completedLessons / course.totalLessons) * 100 : 0;
  const coursePriceMMK = 150000;

  // Determine lesson access
  const getLessonAccess = (lesson: typeof sampleLessons[0], index: number) => {
    if (enrolled) return { locked: false, isPreview: false };
    if (index === 0) return { locked: false, isPreview: true }; // First lesson is free preview
    return { locked: true, isPreview: false };
  };

  const handleLessonClick = (lesson: typeof sampleLessons[0], index: number) => {
    const access = getLessonAccess(lesson, index);
    if (access.locked) {
      setLockedDialogOpen(true);
    } else {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <Section>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info Sidebar */}
            <div className="lg:col-span-1">
              <Card variant="elevated" className="sticky top-24">
                <div className={`h-48 ${category?.color || "bg-muted"} flex items-center justify-center`}>
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

                  {/* Price */}
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Course Fee</div>
                    <div className="text-3xl font-fredoka font-bold text-primary">
                      {new Intl.NumberFormat("my-MM").format(coursePriceMMK)} MMK
                    </div>
                  </div>

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

                  {/* Progress (enrolled) */}
                  {enrolled && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Your Progress</span>
                        <span className="font-semibold">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} variant="course" size="lg" />
                    </div>
                  )}

                  {/* CTA */}
                  {enrolled ? (
                    <Button variant="fun" size="lg" className="w-full">
                      <Play className="w-5 h-5" /> Continue Learning
                    </Button>
                  ) : paymentStatus === "pending" ? (
                    <div className="space-y-3">
                      <div className="bg-star/10 border border-star/30 rounded-xl p-4 text-center">
                        <Clock className="w-6 h-6 mx-auto text-star mb-2" />
                        <p className="font-fredoka font-bold text-foreground">Pending Verification</p>
                        <p className="text-xs text-muted-foreground mt-1">Your payment is being reviewed</p>
                      </div>
                    </div>
                  ) : paymentStatus === "rejected" ? (
                    <div className="space-y-3">
                      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center">
                        <p className="font-fredoka font-bold text-foreground">Payment Verification Failed</p>
                        <p className="text-xs text-muted-foreground mt-1">Please resubmit your payment slip.</p>
                      </div>
                      <Button variant="hero" size="lg" className="w-full" onClick={() => setCheckoutOpen(true)}>
                        <Sparkles className="w-5 h-5" /> Resubmit Payment
                      </Button>
                    </div>
                  ) : (
                    <Button variant="hero" size="lg" className="w-full" onClick={() => setCheckoutOpen(true)}>
                      <Sparkles className="w-5 h-5" /> Enroll Now - {new Intl.NumberFormat("my-MM").format(coursePriceMMK)} MMK
                    </Button>
                  )}

                  {/* Visual Steps */}
                  {!enrolled && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-3">HOW TO ENROLL</p>
                      <div className="space-y-2">
                        {[
                          { step: "1", label: "Choose Course", done: true },
                          { step: "2", label: "Pay via Mobile Banking", done: paymentStatus === "pending" || paymentStatus === "approved" },
                          { step: "3", label: "Upload Payment Slip", done: paymentStatus === "pending" || paymentStatus === "approved" },
                          { step: "4", label: "Get Full Access", done: enrolled },
                        ].map((s) => (
                          <div key={s.step} className="flex items-center gap-3 text-sm">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                              s.done ? "bg-success text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              {s.done ? <CheckCircle className="w-4 h-4" /> : s.step}
                            </div>
                            <span className={s.done ? "text-foreground" : "text-muted-foreground"}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lessons List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-fredoka font-bold text-foreground mb-6">
                📚 Course Lessons
              </h2>

              <div className="space-y-3">
                {sampleLessons.map((lesson, index) => {
                  const access = getLessonAccess(lesson, index);
                  const modifiedLesson = {
                    ...lesson,
                    locked: access.locked,
                    current: enrolled ? lesson.current : false,
                    completed: enrolled ? lesson.completed : false,
                    stars: enrolled ? lesson.stars : 0,
                  };

                  return (
                    <div key={lesson.id} className="relative">
                      {access.isPreview && !enrolled && (
                        <Badge className="absolute -top-2 right-2 z-10 bg-secondary text-secondary-foreground text-xs">
                          Free Preview
                        </Badge>
                      )}
                      <LessonItem
                        lesson={modifiedLesson}
                        index={index}
                        onClick={() => handleLessonClick(lesson, index)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />

      {/* Checkout Dialog */}
      {course && (
        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          course={{
            id: course.id,
            title: course.title,
            thumbnail: course.thumbnail,
            category: category?.name || course.category,
          }}
          priceMMK={coursePriceMMK}
        />
      )}

      {/* Locked Lesson Dialog */}
      <LockedLessonDialog
        open={lockedDialogOpen}
        onOpenChange={setLockedDialogOpen}
        onEnroll={() => setCheckoutOpen(true)}
      />
    </div>
  );
};

export default CourseDetail;
