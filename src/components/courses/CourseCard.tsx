import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, Play, CheckCircle, Sparkles } from "lucide-react";
import { courseCategories } from "@/data/mockData";
import { EnrollmentDialog } from "@/components/enrollment/EnrollmentDialog";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    ageGroup: string;
    difficulty: string;
    totalLessons: number;
    completedLessons: number;
    stars: number;
    thumbnail: string;
  };
  onClick?: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const progress = (course.completedLessons / course.totalLessons) * 100;
  const isCompleted = progress === 100;
  const isNotStarted = course.completedLessons === 0;
  const category = courseCategories.find(c => c.id === course.category);
  const CategoryIcon = category?.icon;

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isNotStarted) {
      setEnrollmentOpen(true);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      variant="course" 
      className="group cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className={`relative h-32 ${category?.color || 'bg-muted'} flex items-center justify-center`}>
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {course.thumbnail}
        </span>
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <Badge variant="success" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              Done!
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Category & Age */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="category" className="text-xs">
            {CategoryIcon && <CategoryIcon className="w-3 h-3 mr-1" />}
            {category?.name}
          </Badge>
          <Badge variant="age" className="text-xs">
            {course.ageGroup}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-fredoka font-bold text-lg text-foreground mb-1 line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {course.description}
        </p>

        {/* Stars earned */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < course.stars 
                  ? "text-star fill-star" 
                  : "text-muted stroke-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({course.stars}/5)
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
          </div>
          <Progress value={progress} variant="course" size="sm" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          variant={isCompleted ? "success" : isNotStarted ? "hero" : "fun"} 
          className="w-full"
          size="sm"
          onClick={handleButtonClick}
        >
          {isNotStarted ? (
            <>
              <Sparkles className="w-4 h-4" />
              Enroll Now
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {isCompleted ? "Play Again" : "Continue"}
            </>
          )}
        </Button>
      </CardFooter>

      {/* Enrollment Dialog */}
      <EnrollmentDialog
        open={enrollmentOpen}
        onOpenChange={setEnrollmentOpen}
        course={{
          id: course.id,
          title: course.title,
          thumbnail: course.thumbnail,
          category: category?.name || course.category,
          ageGroup: course.ageGroup,
        }}
        price={29.99}
      />
    </Card>
  );
}
