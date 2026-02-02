<<<<<<< HEAD
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { curriculumFilters, CurriculumCourse } from "@/data/curriculumData";
import { Clock, Users, Sparkles, Play, Smartphone, Tablet, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurriculumCardProps {
  course: CurriculumCourse;
  onClick?: () => void;
}

export function CurriculumCard({ course, onClick }: CurriculumCardProps) {
  const topic = curriculumFilters.topics.find(t => t.id === course.topic);
  const TopicIcon = topic?.icon;
  const grade = curriculumFilters.grades.find(g => g.id === course.gradeRange);

  const deviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };

  return (
    <Card 
      variant="course" 
      className="group cursor-pointer animate-fade-in overflow-hidden"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className={cn(
        "relative h-36 bg-gradient-to-br flex items-center justify-center",
        course.color
      )}>
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
          {course.thumbnail}
        </span>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.isNew && (
            <Badge className="bg-funPink text-white border-0 gap-1 animate-pulse">
              <Sparkles className="w-3 h-3" />
              New
            </Badge>
          )}
        </div>
        
        {course.progress !== undefined && course.progress > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="success" className="gap-1">
              {course.progress}% done
            </Badge>
          </div>
        )}

        {/* Topic badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className={cn("border-0 text-white", topic?.color)}>
            {TopicIcon && <TopicIcon className="w-3 h-3 mr-1" />}
            {topic?.label}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-fredoka font-bold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        {/* Myanmar title */}
        {course.titleMm && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {course.titleMm}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {course.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{grade?.label}</span>
          </div>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Device compatibility */}
        <div className="flex items-center gap-1 mb-4">
          {course.devices.map((device) => {
            const Icon = deviceIcons[device as keyof typeof deviceIcons];
            return (
              <div 
                key={device} 
                className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                title={device}
              >
                <Icon className="w-3 h-3 text-muted-foreground" />
              </div>
            );
          })}
          <Badge variant="outline" className="ml-auto text-xs">
            {curriculumFilters.languages.find(l => l.id === course.language)?.label}
          </Badge>
        </div>

        {/* Progress bar (if in progress) */}
        {course.progress !== undefined && course.progress > 0 && (
          <div className="mb-4">
            <Progress value={course.progress} variant="course" size="sm" />
          </div>
        )}

        {/* CTA Button */}
        <Button 
          variant={course.progress ? "fun" : "hero"} 
          className="w-full group/btn"
          size="sm"
        >
          <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          {course.progress ? "Continue Learning" : "Start Learning"}
        </Button>
      </CardContent>
    </Card>
  );
}
=======
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { curriculumFilters, CurriculumCourse } from "@/data/curriculumData";
import { Clock, Users, Sparkles, Play, Smartphone, Tablet, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurriculumCardProps {
  course: CurriculumCourse;
  onClick?: () => void;
}

export function CurriculumCard({ course, onClick }: CurriculumCardProps) {
  const topic = curriculumFilters.topics.find(t => t.id === course.topic);
  const TopicIcon = topic?.icon;
  const grade = curriculumFilters.grades.find(g => g.id === course.gradeRange);

  const deviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };

  return (
    <Card 
      variant="course" 
      className="group cursor-pointer animate-fade-in overflow-hidden"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className={cn(
        "relative h-36 bg-gradient-to-br flex items-center justify-center",
        course.color
      )}>
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
          {course.thumbnail}
        </span>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.isNew && (
            <Badge className="bg-funPink text-white border-0 gap-1 animate-pulse">
              <Sparkles className="w-3 h-3" />
              New
            </Badge>
          )}
        </div>
        
        {course.progress !== undefined && course.progress > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="success" className="gap-1">
              {course.progress}% done
            </Badge>
          </div>
        )}

        {/* Topic badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className={cn("border-0 text-white", topic?.color)}>
            {TopicIcon && <TopicIcon className="w-3 h-3 mr-1" />}
            {topic?.label}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-fredoka font-bold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        {/* Myanmar title */}
        {course.titleMm && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {course.titleMm}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {course.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{grade?.label}</span>
          </div>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Device compatibility */}
        <div className="flex items-center gap-1 mb-4">
          {course.devices.map((device) => {
            const Icon = deviceIcons[device as keyof typeof deviceIcons];
            return (
              <div 
                key={device} 
                className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                title={device}
              >
                <Icon className="w-3 h-3 text-muted-foreground" />
              </div>
            );
          })}
          <Badge variant="outline" className="ml-auto text-xs">
            {curriculumFilters.languages.find(l => l.id === course.language)?.label}
          </Badge>
        </div>

        {/* Progress bar (if in progress) */}
        {course.progress !== undefined && course.progress > 0 && (
          <div className="mb-4">
            <Progress value={course.progress} variant="course" size="sm" />
          </div>
        )}

        {/* CTA Button */}
        <Button 
          variant={course.progress ? "fun" : "hero"} 
          className="w-full group/btn"
          size="sm"
        >
          <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          {course.progress ? "Continue Learning" : "Start Learning"}
        </Button>
      </CardContent>
    </Card>
  );
}
>>>>>>> refs/remotes/origin/main
