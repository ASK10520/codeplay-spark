import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionTitle } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  PlusCircle,
  TrendingUp,
  BarChart3,
  Edit,
  Eye
} from "lucide-react";

const TeacherDashboard = () => {
  // Sample course data
  const myCourses = [
    {
      id: "1",
      title: "Block Coding Adventure",
      students: 156,
      lessons: 12,
      status: "published",
    },
    {
      id: "2",
      title: "Color Magic Studio",
      students: 89,
      lessons: 8,
      status: "published",
    },
    {
      id: "3",
      title: "Advanced Python",
      students: 0,
      lessons: 5,
      status: "draft",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <Section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-fredoka font-bold text-foreground">
                👩‍🏫 Teacher Dashboard
              </h1>
              <p className="text-muted-foreground">
                Create courses and track student progress
              </p>
            </div>
            <Button variant="fun" size="lg">
              <PlusCircle className="w-5 h-5" />
              Create New Course
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card variant="stats">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-fredoka font-bold">3</div>
                <p className="text-xs text-muted-foreground">My Courses</p>
              </CardContent>
            </Card>
            <Card variant="stats">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto text-secondary mb-2" />
                <div className="text-2xl font-fredoka font-bold">245</div>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </CardContent>
            </Card>
            <Card variant="stats">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto text-success mb-2" />
                <div className="text-2xl font-fredoka font-bold">87%</div>
                <p className="text-xs text-muted-foreground">Avg Completion</p>
              </CardContent>
            </Card>
            <Card variant="stats">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 mx-auto text-badge mb-2" />
                <div className="text-2xl font-fredoka font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* My Courses */}
          <div>
            <h2 className="font-fredoka font-bold text-2xl mb-6">📚 My Courses</h2>
            <div className="space-y-4">
              {myCourses.map((course) => (
                <Card key={course.id} variant="interactive">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-fredoka font-bold text-lg">
                            {course.title}
                          </h3>
                          <Badge 
                            variant={course.status === "published" ? "success" : "secondary"}
                          >
                            {course.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students} students
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.lessons} lessons
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                        <Button variant="fun" size="sm">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2 className="font-fredoka font-bold text-2xl mb-6">📊 Recent Activity</h2>
            <Card variant="flat">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { action: "New student enrolled", course: "Block Coding Adventure", time: "2 hours ago" },
                    { action: "Quiz completed", course: "Color Magic Studio", time: "5 hours ago" },
                    { action: "Course rating received", course: "Block Coding Adventure", time: "1 day ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-semibold text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.course}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
