import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { Section, SectionTitle } from "@/components/layout/PageContainer";
import { sampleCourses } from "@/data/mockData";
import { useSearchParams, useNavigate } from "react-router-dom";

const Courses = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedAge, setSelectedAge] = useState<string | null>(
    searchParams.get("age")
  );

  const filteredCourses = sampleCourses.filter((course) => {
    if (selectedCategory && course.category !== selectedCategory) return false;
    if (selectedAge && course.ageGroup !== selectedAge) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <Section>
          <SectionTitle subtitle="Find the perfect course for your learning journey!">
            🎓 Explore Courses
          </SectionTitle>

          {/* Filters */}
          <div className="mb-8">
            <CourseFilters
              selectedCategory={selectedCategory}
              selectedAge={selectedAge}
              onCategoryChange={setSelectedCategory}
              onAgeChange={setSelectedAge}
            />
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate(`/course/${course.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="font-fredoka text-xl font-bold text-foreground mb-2">
                No courses found
              </h3>
              <p className="text-muted-foreground">
                Try changing your filters to discover more courses!
              </p>
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
