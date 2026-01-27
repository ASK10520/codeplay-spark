import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StudentProfileCard } from "@/components/student/StudentProfileCard";
import { CourseCard } from "@/components/courses/CourseCard";
import { Section, SectionTitle } from "@/components/layout/PageContainer";
import { sampleStudentProfile, sampleCourses } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Get courses in progress
  const inProgressCourses = sampleCourses.filter(
    (c) => c.completedLessons > 0 && c.completedLessons < c.totalLessons
  );
  
  // Recommended courses (not started)
  const recommendedCourses = sampleCourses.filter(
    (c) => c.completedLessons === 0
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <Section>
          {/* Profile Card */}
          <div className="mb-8">
            <StudentProfileCard profile={sampleStudentProfile} />
          </div>

          {/* Continue Learning */}
          {inProgressCourses.length > 0 && (
            <div className="mb-12">
              <SectionTitle subtitle="Pick up where you left off!">
                🎯 Continue Learning
              </SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => navigate(`/course/${course.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recommended Courses */}
          <div>
            <SectionTitle subtitle="Start a new adventure!">
              ✨ Recommended For You
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate(`/course/${course.id}`)}
                />
              ))}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
