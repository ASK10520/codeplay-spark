import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Lock, CheckCircle, Play, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonItemProps {
  lesson: {
    id: string;
    title: string;
    type: string;
    completed: boolean;
    stars: number;
    description: string;
    current?: boolean;
    locked?: boolean;
  };
  index: number;
  onClick?: () => void;
}

export function LessonItem({ lesson, index, onClick }: LessonItemProps) {
  const isAccessible = !lesson.locked;
  
  return (
    <Card
      variant={lesson.current ? "interactive" : "flat"}
      className={cn(
        "transition-all duration-300",
        lesson.current && "ring-2 ring-primary ring-offset-2",
        lesson.locked && "opacity-60",
        isAccessible && "hover:shadow-card cursor-pointer"
      )}
      onClick={isAccessible ? onClick : undefined}
    >
      <CardContent className="p-4 flex items-center gap-4">
        {/* Lesson Number / Status */}
        <div 
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-fredoka font-bold",
            lesson.completed 
              ? "bg-success text-white" 
              : lesson.current 
                ? "gradient-primary text-white animate-pulse-glow" 
                : lesson.locked 
                  ? "bg-muted text-muted-foreground"
                  : "bg-secondary/20 text-secondary"
          )}
        >
          {lesson.completed ? (
            <CheckCircle className="w-6 h-6" />
          ) : lesson.locked ? (
            <Lock className="w-5 h-5" />
          ) : (
            index + 1
          )}
        </div>

        {/* Lesson Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-fredoka font-bold text-foreground truncate">
              {lesson.title}
            </h4>
            {lesson.current && (
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lesson.description}
          </p>
        </div>

        {/* Stars */}
        {lesson.completed && (
          <div className="flex items-center gap-0.5">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < lesson.stars
                    ? "text-star fill-star"
                    : "text-muted stroke-muted-foreground/30"
                )}
              />
            ))}
          </div>
        )}

        {/* Action Button */}
        <div>
          {lesson.current ? (
            <Button variant="fun" size="sm">
              <Play className="w-4 h-4" />
              Start
            </Button>
          ) : lesson.completed ? (
            <Button variant="ghost" size="icon-sm">
              <ChevronRight className="w-5 h-5" />
            </Button>
          ) : lesson.locked ? (
            <Lock className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Button variant="outline" size="icon-sm">
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
