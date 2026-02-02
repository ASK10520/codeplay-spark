import { BookOpen, Code, Laptop, Sparkles } from "lucide-react";

export function CurriculumHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary/10 via-background to-funPink/10 py-12 md:py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-funPink/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-star rotate-45 animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-success rotate-45 animate-bounce" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-funPink rotate-45 animate-bounce" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Learn to Code, Build the Future!
            </div>
            
            <h1 className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Curriculum{" "}
              <span className="text-gradient">Catalog</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore fun, interactive coding courses designed for kids in Myanmar. 
              Learn logic, programming, and creativity step by step.
            </p>
            
            <p className="text-base text-muted-foreground/80 mt-4 max-w-xl mx-auto lg:mx-0">
              မြန်မာနိုင်ငံရှိ ကလေးများအတွက် ပျော်စရာ၊ အပြန်အလှန် ကုဒ်ရေးသင်တန်းများကို ရှာဖွေပါ။
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Main illustration container */}
              <div className="relative bg-gradient-to-br from-card to-card/50 rounded-3xl p-8 shadow-fun border-2 border-border">
                {/* Laptop */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-48 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-t-xl flex items-center justify-center">
                      <Code className="w-16 h-16 text-primary-foreground" />
                    </div>
                    <div className="w-56 h-3 bg-muted rounded-b-lg mx-auto" />
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-success/20 rounded-2xl flex items-center justify-center animate-bounce" style={{ animationDuration: "3s" }}>
                  <span className="text-3xl">🤖</span>
                </div>
                
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-star/20 rounded-2xl flex items-center justify-center animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}>
                  <span className="text-2xl">📚</span>
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-funPink/20 rounded-2xl flex items-center justify-center animate-bounce" style={{ animationDuration: "2.8s", animationDelay: "1s" }}>
                  <span className="text-2xl">🎮</span>
                </div>
                
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center animate-bounce" style={{ animationDuration: "3.2s", animationDelay: "0.3s" }}>
                  <span className="text-3xl">💡</span>
                </div>

                {/* Code blocks decoration */}
                <div className="flex gap-2 justify-center">
                  <div className="px-3 py-1 bg-secondary/20 rounded-full text-xs font-mono text-secondary">
                    {"<code>"}
                  </div>
                  <div className="px-3 py-1 bg-success/20 rounded-full text-xs font-mono text-success">
                    {"logic()"}
                  </div>
                  <div className="px-3 py-1 bg-funPink/20 rounded-full text-xs font-mono text-funPink">
                    {"play!"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}