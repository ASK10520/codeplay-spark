import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { Section } from "@/components/layout/PageContainer";
import { sampleCourses } from "@/data/mockData";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, BookOpen, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SortOption = "popular" | "newest" | "recommended";

const Courses = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedAge, setSelectedAge] = useState<string | null>(
    searchParams.get("age")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const filteredCourses = useMemo(() => {
    let courses = sampleCourses.filter((course) => {
      if (selectedCategory && course.category !== selectedCategory) return false;
      if (selectedAge && course.ageGroup !== selectedAge) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          course.title.toLowerCase().includes(q) ||
          course.description.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // Sort
    if (sortBy === "popular") {
      courses = [...courses].sort((a, b) => b.stars - a.stars);
    } else if (sortBy === "newest") {
      courses = [...courses].reverse();
    }

    return courses;
  }, [selectedCategory, selectedAge, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl animate-bounce-slow">🚀</div>
          <div className="absolute top-20 right-20 text-5xl animate-float">💡</div>
          <div className="absolute bottom-10 left-1/3 text-4xl animate-bounce-slow">⭐</div>
        </div>
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Badge variant="xp" className="text-sm px-4 py-1.5">
              <Sparkles className="w-4 h-4 mr-1" />
              {sampleCourses.length} Courses Available
            </Badge>
            <h1 className="font-fredoka text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Explore & Learn 🎓
            </h1>
            <p className="text-muted-foreground text-base md:text-lg font-nunito max-w-lg mx-auto">
              Find the perfect course for your coding adventure! Learn to code, design, and create amazing things.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mt-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full border-2 border-primary/20 bg-card shadow-card text-base focus-visible:ring-primary/30 focus-visible:border-primary/40"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-6 pt-4 text-sm font-nunito text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                {sampleCourses.length} courses
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-secondary" />
                1,200+ students
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-star" />
                4.8 avg rating
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="py-8">
        <Section>
          {/* Filters + Sort */}
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md -mx-4 px-4 py-4 mb-6 border-b border-border/50">
            <CourseFilters
              selectedCategory={selectedCategory}
              selectedAge={selectedAge}
              onCategoryChange={setSelectedCategory}
              onAgeChange={setSelectedAge}
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultCount={filteredCourses.length}
            />
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CourseCard
                    course={course}
                    onClick={() => navigate(`/course/${course.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-7xl mb-6 block animate-bounce-slow">🔍</span>
              <h3 className="font-fredoka text-2xl font-bold text-foreground mb-2">
                No courses found
              </h3>
              <p className="text-muted-foreground font-nunito mb-4">
                Try changing your filters or search to discover more courses!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedAge(null);
                  setSearchQuery("");
                }}
                className="text-primary font-bold hover:underline font-nunito"
              >
                Clear all filters →
              </button>
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
