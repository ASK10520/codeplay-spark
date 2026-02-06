import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, BookOpen, Rocket } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-online-learning.jpg";
import heroSlide2 from "@/assets/hero-slide-mobile-app.jpg";
import heroSlide3 from "@/assets/hero-slide-teachers.jpg";

interface Slide {
  id: number;
  image: string;
  headlineMm: string;
  subtitleMm: string;
  subtitleEn: string;
  ctas: { label: string; icon?: React.ReactNode; variant: "playful" | "outline" | "secondary" }[];
  bgGradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: heroSlide1,
    headlineMm: "ကလေးများ အတွက် အွန်လိုင်း သင်ကြားရေး စနစ်",
    subtitleMm: "အိမ်မှာနေရင်း လေ့လာနိုင်သော",
    subtitleEn: "Smart Learning Experience",
    ctas: [
      { label: "Get App", icon: <Download className="w-5 h-5" />, variant: "playful" },
    ],
    bgGradient: "from-secondary/20 via-secondary/5 to-star/10",
  },
  {
    id: 2,
    image: heroSlide2,
    headlineMm: "စိုင်းလန်း Application ဖြင့် လေ့လာပါ",
    subtitleMm: "",
    subtitleEn: "Anytime • Anywhere • Fun Learning",
    ctas: [
      { label: "Download App", icon: <Download className="w-5 h-5" />, variant: "playful" },
      { label: "Learn More", icon: <BookOpen className="w-5 h-5" />, variant: "outline" },
    ],
    bgGradient: "from-star/15 via-background to-secondary/10",
  },
  {
    id: 3,
    image: heroSlide3,
    headlineMm: "အတွေ့အကြုံရှိသော ဆရာ/ဆရာမများ",
    subtitleMm: "",
    subtitleEn: "Quality Education for Every Child",
    ctas: [
      { label: "Start Learning", icon: <Rocket className="w-5 h-5" />, variant: "playful" },
    ],
    bgGradient: "from-primary/10 via-background to-star/15",
  },
];

// Floating shape component
function FloatingShape({ className, style }: { className: string; style?: React.CSSProperties }) {
  return <div className={className} style={style} />;
}

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "75vh", minHeight: "500px" }}>
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-all duration-700`}
      />

      {/* Playful floating shapes */}
      <FloatingShape className="absolute top-[10%] left-[5%] w-8 h-8 rounded-full border-4 border-star/30 animate-float" />
      <FloatingShape className="absolute top-[20%] right-[8%] w-6 h-6 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: "0.7s" }} />
      <FloatingShape className="absolute bottom-[15%] left-[12%] w-5 h-5 rotate-45 bg-primary/15 animate-float" style={{ animationDelay: "1.4s" }} />
      <FloatingShape className="absolute top-[60%] right-[15%] w-10 h-10 rounded-full border-4 border-secondary/20 animate-float" style={{ animationDelay: "0.3s" }} />
      <FloatingShape className="absolute top-[35%] left-[3%] w-4 h-4 bg-star/25 rotate-45 animate-float" style={{ animationDelay: "1.8s" }} />
      <FloatingShape className="absolute bottom-[25%] right-[5%] w-3 h-3 bg-funPink/20 rounded-full animate-float" style={{ animationDelay: "2.2s" }} />

      {/* Plus shapes */}
      <div className="absolute top-[15%] right-[25%] text-secondary/20 text-4xl font-light animate-float select-none" style={{ animationDelay: "1s" }}>+</div>
      <div className="absolute bottom-[30%] left-[8%] text-star/25 text-3xl font-light animate-float select-none" style={{ animationDelay: "2s" }}>+</div>
      <div className="absolute top-[70%] right-[30%] text-primary/15 text-2xl font-light animate-float select-none" style={{ animationDelay: "0.5s" }}>×</div>

      {/* Main content */}
      <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full items-center">
          {/* Text content */}
          <div
            key={`text-${slide.id}`}
            className="flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left animate-fade-in"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-fredoka font-bold text-foreground mb-4 leading-tight">
              {slide.headlineMm}
            </h1>

            {slide.subtitleMm && (
              <p className="text-lg md:text-xl text-muted-foreground mb-1 font-nunito">
                {slide.subtitleMm}
              </p>
            )}

            <p className="text-xl md:text-2xl font-fredoka font-semibold text-secondary mb-8">
              {slide.subtitleEn}
            </p>

            <div className="flex items-center gap-4 justify-center lg:justify-start flex-wrap">
              {slide.ctas.map((cta) => (
                <Button
                  key={cta.label}
                  variant={cta.variant}
                  size="lg"
                  className="gap-2"
                >
                  {cta.icon}
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Image */}
          <div
            key={`img-${slide.id}`}
            className="flex items-center justify-center order-1 lg:order-2 animate-scale-in"
          >
            <div className="relative w-full max-w-lg lg:max-w-xl">
              <div className="absolute -inset-4 bg-secondary/10 rounded-3xl blur-2xl" />
              <img
                src={slide.image}
                alt="Astro Hub Learning"
                className="relative w-full h-auto rounded-2xl shadow-card object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur-sm shadow-card flex items-center justify-center text-foreground hover:bg-card hover:scale-110 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur-sm shadow-card flex items-center justify-center text-foreground hover:bg-card hover:scale-110 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-3 bg-secondary shadow-button"
                : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
