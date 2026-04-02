import { Button } from "@/components/ui/button";
import { courseCategories, ageGroups } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, TrendingUp, Clock, Sparkles } from "lucide-react";

type SortOption = "popular" | "newest" | "recommended";

interface CourseFiltersProps {
  selectedCategory: string | null;
  selectedAge: string | null;
  onCategoryChange: (category: string | null) => void;
  onAgeChange: (age: string | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

const sortOptions: { value: SortOption; label: string; icon: typeof TrendingUp }[] = [
  { value: "popular", label: "Popular", icon: TrendingUp },
  { value: "newest", label: "Newest", icon: Clock },
  { value: "recommended", label: "For You", icon: Sparkles },
];

export function CourseFilters({
  selectedCategory,
  selectedAge,
  onCategoryChange,
  onAgeChange,
  sortBy,
  onSortChange,
  resultCount,
}: CourseFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Top row: Sort + result count */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-nunito text-muted-foreground">
            <span className="font-bold text-foreground">{resultCount}</span> courses
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <Button
                key={opt.value}
                variant={sortBy === opt.value ? "fun" : "ghost"}
                size="sm"
                className="h-8 text-xs px-3"
                onClick={() => onSortChange(opt.value)}
              >
                <Icon className="w-3.5 h-3.5" />
                {opt.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Filter pills row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Age Group pills */}
        <Button
          variant={selectedAge === null ? "secondary" : "outline"}
          size="sm"
          className="h-8 text-xs rounded-full"
          onClick={() => onAgeChange(null)}
        >
          🎂 All Ages
        </Button>
        {ageGroups.map((age) => (
          <Button
            key={age.id}
            variant={selectedAge === age.id ? "secondary" : "outline"}
            size="sm"
            className={cn(
              "h-8 text-xs rounded-full",
              selectedAge === age.id && "border-secondary shadow-sm"
            )}
            onClick={() => onAgeChange(age.id)}
          >
            {age.label}
          </Button>
        ))}

        <span className="w-px h-6 bg-border mx-1" />

        {/* Category pills */}
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs rounded-full"
          onClick={() => onCategoryChange(null)}
        >
          📚 All
        </Button>
        {courseCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs rounded-full"
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon className="w-3.5 h-3.5" />
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
