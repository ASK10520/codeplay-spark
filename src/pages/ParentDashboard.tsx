import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionTitle } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Star,
  ChevronRight,
  Shield,
  Bell
} from "lucide-react";

const ParentDashboard = () => {
  // Sample child data
  const children = [
    {
      id: "1",
      name: "Alex",
      avatar: "🦊",
      level: 7,
      xp: 2450,
      coursesCompleted: 2,
      weeklyTime: "4h 30m",
      currentCourse: "Block Coding Adventure",
      progress: 65,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <Section>
          <SectionTitle subtitle="Monitor your child's learning journey">
            👨‍👩‍👧 Parent Dashboard
          </SectionTitle>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card variant="stats">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto text-secondary mb-2" />
                <div className="text-2xl font-fredoka font-bold">1</div>
                <p className="text-xs text-muted-foreground">Child Account</p>
              </CardContent>
            </Card>
            <Card variant="stats">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-fredoka font-bold">4.5h</div>
                <p className="text-xs text-muted-foreground">This Week</p>
              </CardContent>
            </Card>
            <Card variant="stats">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-success mb-2" />
                <div className="text-2xl font-fredoka font-bold">12</div>
                <p className="text-xs text-muted-foreground">Lessons Done</p>
              </CardContent>
            </Card>
            <Card variant="stats">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto text-badge mb-2" />
                <div className="text-2xl font-fredoka font-bold">+15%</div>
                <p className="text-xs text-muted-foreground">Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Child Cards */}
          <div className="space-y-6">
            <h2 className="font-fredoka font-bold text-2xl">Children</h2>
            
            {children.map((child) => (
              <Card key={child.id} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Child Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-4xl">
                        {child.avatar}
                      </div>
                      <div>
                        <h3 className="font-fredoka font-bold text-xl">{child.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="level">Level {child.level}</Badge>
                          <Badge variant="xp">{child.xp} XP</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-xl">
                        <div className="font-bold text-foreground">{child.coursesCompleted}</div>
                        <div className="text-xs text-muted-foreground">Courses Done</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-xl">
                        <div className="font-bold text-foreground">{child.weeklyTime}</div>
                        <div className="text-xs text-muted-foreground">This Week</div>
                      </div>
                      <div className="col-span-2 p-3 bg-muted rounded-xl">
                        <div className="text-xs text-muted-foreground mb-1">Current Course</div>
                        <div className="font-semibold text-foreground text-sm mb-2">{child.currentCourse}</div>
                        <Progress value={child.progress} variant="course" size="sm" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Bell className="w-4 h-4" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4" />
              Add Another Child
            </Button>
          </div>

          {/* Parental Controls */}
          <div className="mt-12">
            <h2 className="font-fredoka font-bold text-2xl mb-6">⚙️ Parental Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="flat">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    Screen Time Limits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set daily learning time limits for your child.
                  </p>
                  <Button variant="outline" size="sm">Configure</Button>
                </CardContent>
              </Card>

              <Card variant="flat">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-success" />
                    Safety Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage privacy and content settings.
                  </p>
                  <Button variant="outline" size="sm">Manage</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default ParentDashboard;
