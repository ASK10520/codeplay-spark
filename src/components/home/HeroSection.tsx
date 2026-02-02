import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Sparkles, Rocket, Star } from "lucide-react";
import heroImage from "@/assets/hero-kids-learning.jpg";
import mascotRobot from "@/assets/mascot-robot.png";

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
      <div className="absolute top-10 left-10 text-4xl animate-float opacity-80">🎮</div>
      <div className="absolute top-20 right-20 text-3xl animate-float opacity-80" style={{ animationDelay: "0.5s" }}>🧩</div>
      <div className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-80" style={{ animationDelay: "1s" }}>⭐</div>
      <div className="absolute bottom-10 right-1/4 text-3xl animate-float opacity-80" style={{ animationDelay: "1.5s" }}>🚀</div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <Badge variant="star" className="mb-4 text-sm">
              <Star className="w-3 h-3 mr-1" />
              #1 Learning Platform for Kids
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-fredoka font-bold text-white mb-4 leading-tight">
              Learn{" "}
              <span className="text-star">Coding</span>
              <br />
              Through Play & Fun!
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0">
              Fun, interactive lessons for kids aged 6-14. Build games, design apps, 
              and become a coding superhero! 🦸‍♂️
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/courses">
                <Button variant="playful" size="xl" className="gap-2">
                  <Rocket className="w-6 h-6" />
                  Enroll Course
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/20 hover:text-white"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Free Trial
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

          {/* Mascot */}
          <div className="flex-shrink-0 relative">
            <div className="relative">
              <img 
                src={mascotRobot} 
                alt="CodePlay Mascot" 
                className="w-64 md:w-80 lg:w-96 drop-shadow-2xl animate-float"
              />
              {/* Speech bubble */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-2 shadow-lg animate-bounce-in">
                <span className="font-fredoka font-bold text-foreground">Let's code!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
