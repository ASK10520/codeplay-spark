import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ageGroups } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

const ageGroupImages = {
  "6-8": "🦄",
  "9-11": "🤖",
  "12-14": "🚀",
};

const ageGroupColors = {
  "6-8": "gradient-primary",
  "9-11": "gradient-secondary",
  "12-14": "gradient-purple",
};

export function AgeGroupSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-foreground mb-3">
            Choose Your Adventure! 🎯
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We have specially designed courses for every age group. Find the perfect path for your learning journey!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ageGroups.map((age) => (
            <Link key={age.id} to={`/courses?age=${age.id}`}>
              <Card 
                variant="interactive" 
                className="h-full overflow-hidden group"
              >
                <div className={`${ageGroupColors[age.id as keyof typeof ageGroupColors]} p-8 text-center`}>
                  <span className="text-7xl block mb-2 group-hover:scale-110 transition-transform duration-300">
                    {ageGroupImages[age.id as keyof typeof ageGroupImages]}
                  </span>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-fredoka font-bold text-2xl text-foreground mb-2">
                    {age.label}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {age.description}
                  </p>
                  <Button variant="fun" size="sm" className="group-hover:scale-105">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
