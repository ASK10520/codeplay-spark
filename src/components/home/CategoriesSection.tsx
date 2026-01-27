import { Card, CardContent } from "@/components/ui/card";
import { courseCategories } from "@/data/mockData";
import { Link } from "react-router-dom";

const categoryDescriptions: Record<string, string> = {
  coding: "Learn to code with colorful blocks and build amazing projects!",
  uiux: "Design beautiful apps and games with colors, shapes, and layouts!",
  logic: "Train your brain with fun puzzles and problem-solving games!",
  games: "Create and play your own games while learning to code!",
};

export function CategoriesSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-foreground mb-3">
            What Will You Learn? 📚
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore exciting topics designed just for kids. Each category is full of fun activities and challenges!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courseCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} to={`/courses?category=${category.id}`}>
                <Card 
                  variant="interactive" 
                  className="h-full text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-fredoka font-bold text-xl text-foreground mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {categoryDescriptions[category.id]}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
