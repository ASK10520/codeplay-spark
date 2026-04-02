import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, Play, CheckCircle, Sparkles, Clock, BarChart3, Users } from "lucide-react";
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

const difficultyConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-success/15 text-success border-success/30" },
  intermediate: { label: "Intermediate", color: "bg-star/15 text-star border-star/30" },
  advanced: { label: "Advanced", color: "bg-primary/15 text-primary border-primary/30" },
};

export function CourseCard({ course, onClick }: CourseCardProps) {
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const progress = Math.round((course.completedLessons / course.totalLessons) * 100);
  const isCompleted = progress === 100;
  const isNotStarted = course.completedLessons === 0;
  const category = courseCategories.find(c => c.id === course.category);
  const CategoryIcon = category?.icon;
  const difficulty = difficultyConfig[course.difficulty] || difficultyConfig.beginner;
  const estimatedMinutes = course.totalLessons * 15;

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
      className="group cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className={`relative h-36 ${category?.color || 'bg-muted'} flex items-center justify-center overflow-hidden`}>
        <span className="text-6xl group-hover:scale-125 transition-transform duration-500 ease-out">
          {course.thumbnail}
        </span>

        {/* Completion badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <Badge variant="success" className="gap-1 shadow-md">
              <CheckCircle className="w-3 h-3" />
              Complete!
            </Badge>
          </div>
        )}

        {/* Difficulty badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${difficulty.color}`}>
            <BarChart3 className="w-3 h-3" />
            {difficulty.label}
          </span>
        </div>

        {/* Student count overlay */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 font-nunito">
            <Users className="w-3 h-3" />
            {Math.floor(Math.random() * 200 + 50)}
          </span>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Tags row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="category" className="text-xs">
            {CategoryIcon && <CategoryIcon className="w-3 h-3 mr-1" />}
            {category?.name}
          </Badge>
          <Badge variant="age" className="text-xs">
            {course.ageGroup}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-fredoka font-bold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-nunito flex-1">
          {course.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground font-nunito mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            📚 {course.totalLessons} lessons
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 transition-colors ${
                i < course.stars
                  ? "text-star fill-star"
                  : "text-muted stroke-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-xs font-bold text-foreground ml-1.5 font-nunito">
            {course.stars}.0
          </span>
        </div>

        {/* Progress */}
        {!isNotStarted && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-nunito">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} variant="course" size="sm" />
          </div>
        )}
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
              Start Learning
            </>
          ) : isCompleted ? (
            <>
              <Play className="w-4 h-4" />
              Play Again
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Continue ({progress}%)
            </>
          )}
        </Button>
      </CardFooter>

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
