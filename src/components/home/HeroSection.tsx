import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Rocket, Star } from "lucide-react";
import heroImage from "@/assets/hero-kids-learning.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 gradient-hero opacity-90" />
      
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 text-4xl animate-float opacity-60">✨</div>
      <div className="absolute top-32 right-[15%] text-2xl animate-float opacity-50" style={{ animationDelay: "0.5s" }}>💫</div>
      <div className="absolute bottom-32 left-[10%] text-3xl animate-float opacity-60" style={{ animationDelay: "1s" }}>⭐</div>
      <div className="absolute top-1/4 left-[20%] text-xl animate-float opacity-40" style={{ animationDelay: "1.5s" }}>🌟</div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <Badge variant="star" className="mb-4 text-sm">
              <Star className="w-3 h-3 mr-1" />
              #1 Learning Platform for Kids
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-fredoka font-bold text-white mb-4 leading-tight">
              Learn to{" "}
              <span className="text-star">Code</span>
              <br />
              Play & Create!
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0">
              Fun, interactive lessons for kids aged 6-14. Build games, design apps, 
              and become a coding superhero! 🦸‍♂️
            </p>

            <div className="flex items-center justify-center lg:justify-start">
              <Link to="/courses">
                <Button variant="playful" size="xl" className="gap-2">
                  <Rocket className="w-6 h-6" />
                  Start Learning Free
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-fredoka font-bold text-white">50K+</div>
                <div className="text-sm text-white/70">Happy Kids</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-fredoka font-bold text-white">100+</div>
                <div className="text-sm text-white/70">Fun Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-fredoka font-bold text-white">4.9★</div>
                <div className="text-sm text-white/70">Rating</div>
              </div>
            </div>
          </div>

          {/* Rocket & Space Illustration */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96">
              {/* Main Rocket */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative animate-float">
                  {/* Rocket body */}
                  <div className="relative">
                    {/* Rocket flame */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-16">
                      <div className="w-full h-full bg-gradient-to-t from-star via-orange-400 to-transparent rounded-b-full animate-pulse opacity-90" />
                    </div>
                    {/* Main rocket shape */}
                    <div className="w-24 h-40 md:w-32 md:h-52 bg-gradient-to-b from-white via-white to-slate-100 rounded-t-full rounded-b-lg shadow-2xl relative overflow-hidden">
                      {/* Rocket window */}
                      <div className="absolute top-8 md:top-10 left-1/2 -translate-x-1/2 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-primary/80 to-primary rounded-full border-4 border-slate-200 shadow-inner">
                        <div className="absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 bg-white/40 rounded-full" />
                      </div>
                      {/* Rocket stripes */}
                      <div className="absolute bottom-12 left-0 right-0 h-3 md:h-4 bg-gradient-to-r from-funPink via-funPink to-funPink" />
                      <div className="absolute bottom-6 left-0 right-0 h-2 md:h-3 bg-gradient-to-r from-secondary via-secondary to-secondary" />
                    </div>
                    {/* Rocket fins */}
                    <div className="absolute -left-4 md:-left-5 bottom-0 w-6 md:w-8 h-16 md:h-20 bg-gradient-to-r from-funPink to-funPink/80 rounded-l-lg transform -skew-y-12" />
                    <div className="absolute -right-4 md:-right-5 bottom-0 w-6 md:w-8 h-16 md:h-20 bg-gradient-to-l from-funPink to-funPink/80 rounded-r-lg transform skew-y-12" />
                    {/* Rocket tip */}
                    <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[24px] md:border-l-[32px] border-r-[24px] md:border-r-[32px] border-b-[32px] md:border-b-[40px] border-l-transparent border-r-transparent border-b-secondary" />
                  </div>
                </div>
              </div>

              {/* Floating Planets */}
              {/* Planet 1 - Large purple planet */}
              <div className="absolute -top-4 -right-4 md:top-0 md:right-0 animate-float" style={{ animationDelay: "0.3s" }}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/80 to-primary rounded-full shadow-lg relative overflow-hidden">
                  <div className="absolute top-2 left-2 w-4 h-4 md:w-5 md:h-5 bg-white/30 rounded-full" />
                  <div className="absolute bottom-3 right-3 w-2 h-2 md:w-3 md:h-3 bg-white/20 rounded-full" />
                  {/* Planet ring */}
                  <div className="absolute top-1/2 -left-3 -right-3 h-2 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full transform -rotate-12" />
                </div>
              </div>

              {/* Planet 2 - Small green planet */}
              <div className="absolute bottom-8 -left-8 md:bottom-12 md:-left-12 animate-float" style={{ animationDelay: "0.8s" }}>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-success/80 to-success rounded-full shadow-lg relative overflow-hidden">
                  <div className="absolute top-1 left-2 w-3 h-3 bg-white/30 rounded-full" />
                  <div className="absolute bottom-2 right-1 w-2 h-2 bg-success/60 rounded-full" />
                </div>
              </div>

              {/* Planet 3 - Medium pink planet */}
              <div className="absolute top-1/3 -left-12 md:-left-16 animate-float" style={{ animationDelay: "1.2s" }}>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-funPink/80 to-funPink rounded-full shadow-lg relative overflow-hidden">
                  <div className="absolute top-1 left-1 w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full" />
                </div>
              </div>

              {/* Small stars around */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-star rounded-full animate-pulse shadow-lg shadow-star/50" style={{ animationDelay: "0.2s" }} />
              <div className="absolute bottom-1/4 right-0 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-1/2 -right-4 w-4 h-4 bg-star rounded-full animate-pulse shadow-lg shadow-star/50" style={{ animationDelay: "0.9s" }} />
              <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "1.3s" }} />
              <div className="absolute top-8 left-1/3 w-3 h-3 bg-star/80 rounded-full animate-pulse" style={{ animationDelay: "0.7s" }} />

              {/* Speech bubble */}
              <div className="absolute -top-8 right-0 md:-top-6 md:right-4 bg-white rounded-2xl px-4 py-2 shadow-lg animate-bounce-in">
                <span className="font-fredoka font-bold text-foreground text-sm md:text-base">Let's explore! 🚀</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
