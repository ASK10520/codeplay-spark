<<<<<<< HEAD
import { useState, useMemo } from "react";
import { CurriculumNavbar } from "@/components/curriculum/CurriculumNavbar";
import { CurriculumHero } from "@/components/curriculum/CurriculumHero";
import { CurriculumFilters } from "@/components/curriculum/CurriculumFilters";
import { CurriculumCard } from "@/components/curriculum/CurriculumCard";
import { Footer } from "@/components/layout/Footer";
import { curriculumCourses, curriculumFilters } from "@/data/curriculumData";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search } from "lucide-react";

const CurriculumCatalog = () => {
  const navigate = useNavigate();
  
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const clearAllFilters = () => {
    setSelectedGrade(null);
    setSelectedDuration(null);
    setSelectedTopic(null);
    setSelectedDevice(null);
    setSelectedLanguage(null);
  };

  const filteredCourses = useMemo(() => {
    return curriculumCourses.filter((course) => {
      if (selectedGrade && course.gradeRange !== selectedGrade) return false;
      if (selectedTopic && course.topic !== selectedTopic) return false;
      if (selectedDevice && !course.devices.includes(selectedDevice)) return false;
      if (selectedLanguage && course.language !== selectedLanguage) return false;
      
      // Duration filtering
      if (selectedDuration) {
        if (selectedDuration === "week" && course.durationWeeks > 1) return false;
        if (selectedDuration === "month" && (course.durationWeeks < 2 || course.durationWeeks > 6)) return false;
        if (selectedDuration === "quarter" && course.durationWeeks < 10) return false;
      }
      
      return true;
    });
  }, [selectedGrade, selectedDuration, selectedTopic, selectedDevice, selectedLanguage]);

  return (
    <div className="min-h-screen bg-background">
      <CurriculumNavbar />
      
      <main>
        <CurriculumHero />
        
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="mb-8">
              <CurriculumFilters
                selectedGrade={selectedGrade}
                selectedDuration={selectedDuration}
                selectedTopic={selectedTopic}
                selectedDevice={selectedDevice}
                selectedLanguage={selectedLanguage}
                onGradeChange={setSelectedGrade}
                onDurationChange={setSelectedDuration}
                onTopicChange={setSelectedTopic}
                onDeviceChange={setSelectedDevice}
                onLanguageChange={setSelectedLanguage}
                onClearAll={clearAllFilters}
              />
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">
                  {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} found
                </span>
              </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <CurriculumCard
                    key={course.id}
                    course={course}
                    onClick={() => navigate(`/course/${course.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border-2 border-border">
                <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-fredoka text-xl font-bold text-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try changing your filters to discover more courses!
                </p>
                <p className="text-muted-foreground text-sm">
                  ရှာဖွေမှုနှင့် ကိုက်ညီသော သင်တန်းများ မတွေ့ရှိပါ။
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-4 text-primary hover:underline font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CurriculumCatalog;
=======
import { useState, useMemo } from "react";
import { CurriculumNavbar } from "@/components/curriculum/CurriculumNavbar";
import { CurriculumHero } from "@/components/curriculum/CurriculumHero";
import { CurriculumFilters } from "@/components/curriculum/CurriculumFilters";
import { CurriculumCard } from "@/components/curriculum/CurriculumCard";
import { Footer } from "@/components/layout/Footer";
import { curriculumCourses } from "@/data/curriculumData";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search } from "lucide-react";

const CurriculumCatalog = () => {
  const navigate = useNavigate();
  
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const clearAllFilters = () => {
    setSelectedGrade(null);
    setSelectedDuration(null);
    setSelectedTopic(null);
    setSelectedDevice(null);
    setSelectedLanguage(null);
  };

  const filteredCourses = useMemo(() => {
    return curriculumCourses.filter((course) => {
      if (selectedGrade && course.gradeRange !== selectedGrade) return false;
      if (selectedTopic && course.topic !== selectedTopic) return false;
      if (selectedDevice && !course.devices.includes(selectedDevice)) return false;
      if (selectedLanguage && course.language !== selectedLanguage) return false;
      
      // Duration filtering
      if (selectedDuration) {
        if (selectedDuration === "week" && course.durationWeeks > 1) return false;
        if (selectedDuration === "month" && (course.durationWeeks < 2 || course.durationWeeks > 6)) return false;
        if (selectedDuration === "quarter" && course.durationWeeks < 10) return false;
      }
      
      return true;
    });
  }, [selectedGrade, selectedDuration, selectedTopic, selectedDevice, selectedLanguage]);

  return (
    <div className="min-h-screen bg-background">
      <CurriculumNavbar />
      
      <main>
        <CurriculumHero />
        
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="mb-8">
              <CurriculumFilters
                selectedGrade={selectedGrade}
                selectedDuration={selectedDuration}
                selectedTopic={selectedTopic}
                selectedDevice={selectedDevice}
                selectedLanguage={selectedLanguage}
                onGradeChange={setSelectedGrade}
                onDurationChange={setSelectedDuration}
                onTopicChange={setSelectedTopic}
                onDeviceChange={setSelectedDevice}
                onLanguageChange={setSelectedLanguage}
                onClearAll={clearAllFilters}
              />
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">
                  {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} found
                </span>
              </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <CurriculumCard
                    key={course.id}
                    course={course}
                    onClick={() => navigate(`/course/${course.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border-2 border-border">
                <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-fredoka text-xl font-bold text-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try changing your filters to discover more courses!
                </p>
                <p className="text-muted-foreground text-sm">
                  ရှာဖွေမှုနှင့် ကိုက်ညီသော သင်တန်းများ မတွေ့ရှိပါ။
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-4 text-primary hover:underline font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CurriculumCatalog;
>>>>>>> 44e0bdd (Update Curriculum page UI and content)
