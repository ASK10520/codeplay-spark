import { Button } from "@/components/ui/button";
import { courseCategories, ageGroups } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface CourseFiltersProps {
  selectedCategory: string | null;
  selectedAge: string | null;
  onCategoryChange: (category: string | null) => void;
  onAgeChange: (age: string | null) => void;
}

export function CourseFilters({
  selectedCategory,
  selectedAge,
  onCategoryChange,
  onAgeChange,
}: CourseFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Age Groups */}
      <div>
        <h4 className="font-fredoka font-bold text-foreground mb-3">
          🎂 Age Group
        </h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedAge === null ? "fun" : "outline"}
            size="sm"
            onClick={() => onAgeChange(null)}
          >
            All Ages
          </Button>
          {ageGroups.map((age) => (
            <Button
              key={age.id}
              variant={selectedAge === age.id ? "secondary" : "outline"}
              size="sm"
              onClick={() => onAgeChange(age.id)}
              className={cn(
                selectedAge === age.id && "border-secondary"
              )}
            >
              {age.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-fredoka font-bold text-foreground mb-3">
          📚 Category
        </h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "fun" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(null)}
          >
            All Courses
          </Button>
          {courseCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
