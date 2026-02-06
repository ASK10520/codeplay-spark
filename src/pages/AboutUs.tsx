import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Sparkles, Target, Heart, Rocket, Star, Moon } from "lucide-react";

// Team member data
const teamMembers = [
  {
    name: "Dr. Aung Min",
    nameMm: "ဒေါက်တာ အောင်မင်း",
    role: "Founder & CEO",
    roleMm: "တည်ထောင်သူနှင့် အမှုဆောင်အရာရှိချုပ်",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Dr. Thiri Kyaw",
    nameMm: "ဒေါက်တာ သီရိကျော်",
    role: "Academic Director",
    roleMm: "ပညာရေးဒါရိုက်တာ",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Ko Aung Soe Khine",
    nameMm: "ကိုအောင်စိုးခိုင်",
    role: "Program Manager",
    roleMm: "ဆရာကြီး",
    image: "/src/assets/aungsoekhine.jpg",
  },
  {
    name: "Ma Thiri Phyo Naing",
    nameMm: "မသီရိဖြိုးနိုင်",
    role: "Operations Manager",
    roleMm: "လုပ်ငန်းစီမံခန့်ခွဲရေးမန်နေဂျာ",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Ko Phyo Wai",
    nameMm: "ကိုဖြိုးဝေ",
    role: "Technology Lead",
    roleMm: "နည်းပညာခေါင်းဆောင်",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Ma Su Mon",
    nameMm: "မစုမွန်",
    role: "Curriculum Designer",
    roleMm: "သင်ရိုးညွှန်းတမ်းဒီဇိုင်နာ",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Ko Myo Thant",
    nameMm: "ကိုမြိုသန့်",
    role: "Marketing Director",
    roleMm: "စျေးကွက်ရှာဖွေရေးဒါရိုက်တာ",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Ma Thin Zar",
    nameMm: "မသင်းဇာ",
    role: "Student Success Lead",
    roleMm: "ကျောင်းသားအောင်မြင်ရေးခေါင်းဆောင်",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
  },
];

// Core values data
const coreValues = [
  {
    icon: Globe,
    title: "Accessible",
    titleMm: "အလွယ်တကူရရှိနိုင်သော",
    description: "Education that students can learn anytime, anywhere with internet access.",
    descriptionMm: "အင်တာနက်ချိတ်ဆက်မှုဖြင့် ကျောင်းသားများ မည်သည့်အချိန်၊ မည်သည့်နေရာတွင်မဆို သင်ယူနိုင်သော ပညာရေး။",
    color: "text-secondary bg-secondary/10",
  },
  {
    icon: Sparkles,
    title: "Attractive",
    titleMm: "ဆွဲဆောင်မှုရှိသော",
    description: "Fun, interactive, and visually engaging learning experience for all ages.",
    descriptionMm: "အသက်အရွယ်မရွေး ပျော်ရွှင်ဖွယ်၊ အပြန်အလှန်အကျိုးသက်ရောက်မှုရှိပြီး အမြင်အာရုံကို ဆွဲဆောင်နိုင်သော သင်ယူမှုအတွေ့အကြုံ။",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Target,
    title: "Relevant",
    titleMm: "လက်တွေ့ကျသော",
    description: "Updated curriculum aligned with real-world skills and future careers.",
    descriptionMm: "လက်တွေ့ကမ္ဘာ့ကျွမ်းကျင်မှုများနှင့် အနာဂတ်အသက်မွေးဝမ်းကျောင်းများနှင့် ချိတ်ဆက်ထားသော ခေတ်မီသင်ရိုးညွှန်းတမ်း။",
    color: "text-accent bg-accent/10",
  },
  {
    icon: Heart,
    title: "Affordable",
    titleMm: "စျေးနှုန်းသင့်တင့်သော",
    description: "Quality education at a fair and reasonable price for every family.",
    descriptionMm: "မိသားစုတိုင်းအတွက် မျှတပြီး သင့်တင့်သောစျေးနှုန်းဖြင့် အရည်အသွေးပြည့်ပညာရေး။",
    color: "text-funPink bg-funPink/10",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-4xl animate-float opacity-20">🌙</div>
            <div className="absolute top-20 right-20 text-3xl animate-pulse opacity-20">⭐</div>
            <div className="absolute bottom-20 left-1/4 text-2xl animate-float opacity-20" style={{ animationDelay: "1s" }}>✨</div>
            <div className="absolute bottom-32 right-1/3 text-3xl animate-pulse opacity-20" style={{ animationDelay: "0.5s" }}>💫</div>
          </div>

          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-fredoka font-bold text-foreground leading-tight">
                  Welcome to{" "}
                  <span className="text-gradient">Astro Hub</span>
                  <br />
                  Learning Management System
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Astro Hub is a modern Learning Management System (LMS) designed specifically for children and youth education. 
                  We combine interactive learning, technology-driven education, and comprehensive skill development to prepare 
                  the next generation for a bright future.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed font-myanmar">
                  Astro Hub သည် ကလေးများနှင့် လူငယ်ပညာရေးအတွက် အထူးဒီဇိုင်းထုတ်ထားသော ခေတ်မီသင်ယူမှုစီမံခန့်ခွဲရေးစနစ် (LMS) ဖြစ်ပါသည်။ 
                  ကျွန်ုပ်တို့သည် အပြန်အလှန်သင်ယူမှု၊ နည်းပညာအခြေခံပညာရေးနှင့် ကျယ်ပြန့်သောကျွမ်းကျင်မှုဖွံ့ဖြိုးတိုးတက်မှုတို့ကို ပေါင်းစပ်ပြီး 
                  နောင်လာမည့်မျိုးဆက်ကို တောက်ပသောအနာဂတ်အတွက် ပြင်ဆင်ပေးပါသည်။
                </p>
              </div>

              {/* Right: Illustration */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  {/* Moon background */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/30 via-badge/20 to-primary/30 animate-pulse" style={{ animationDuration: "4s" }} />
                  
                  {/* Central moon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-muted via-card to-muted-foreground/10 shadow-fun flex items-center justify-center">
                    <Moon className="w-24 h-24 md:w-32 md:h-32 text-primary" />
                  </div>

                  {/* Orbiting elements */}
                  <div className="absolute top-4 right-8 animate-float">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-4 animate-float" style={{ animationDelay: "1s" }}>
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                  <div className="absolute top-1/3 left-0 animate-float" style={{ animationDelay: "2s" }}>
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-secondary" />
                    </div>
                  </div>
                  <div className="absolute bottom-1/4 right-0 animate-float" style={{ animationDelay: "1.5s" }}>
                    <div className="w-10 h-10 rounded-full bg-funPink/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-funPink" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold">
                <Target className="w-5 h-5" />
                <span>Our Vision</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-foreground">
                Vision
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Astro Hub, we envision a world where quality education is accessible to every child through 
                innovative digital platforms. We believe in nurturing future-ready skills, fostering creativity, 
                and instilling a love for lifelong learning in every student who joins our community.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-myanmar">
                Astro Hub တွင် ကျွန်ုပ်တို့သည် ဆန်းသစ်တီထွင်မှုရှိသော ဒစ်ဂျစ်တယ်ပလက်ဖောင်းများမှတစ်ဆင့် ကလေးတိုင်းအတွက် 
                အရည်အသွေးပြည့်ပညာရေးကို ရရှိနိုင်သောကမ္ဘာတစ်ခုကို မျှော်မှန်းပါသည်။ ကျွန်ုပ်တို့၏အသိုင်းအဝိုင်းသို့ ပါဝင်လာသော 
                ကျောင်းသားတိုင်းတွင် အနာဂတ်အတွက်အဆင်သင့်ကျွမ်းကျင်မှုများ မွေးမြူခြင်း၊ ဖန်တီးနိုင်စွမ်းကို မြှင့်တင်ခြင်းနှင့် 
                တစ်သက်တာသင်ယူမှုကို ချစ်မြတ်နိုးမှုကို စိုက်ထူခြင်းတို့ကို ယုံကြည်ပါသည်။
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">
                <Rocket className="w-5 h-5" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-foreground">
                Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to deliver structured, engaging, and affordable LMS-based education that empowers 
                students, supports parents, and enables teachers. We are committed to providing mobile-friendly 
                and online accessible learning experiences that fit seamlessly into modern family life.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-myanmar">
                ကျွန်ုပ်တို့၏ရည်မှန်းချက်မှာ ကျောင်းသားများကို စွမ်းဆောင်ရည်မြှင့်တင်ပေးပြီး မိဘများကို ပံ့ပိုးကူညီကာ 
                ဆရာများကို လုပ်ဆောင်နိုင်စေသော ဖွဲ့စည်းပုံရှိပြီး၊ ဆွဲဆောင်မှုရှိပြီး၊ တတ်နိုင်သော LMS အခြေခံပညာရေးကို 
                ပေးအပ်ရန်ဖြစ်ပါသည်။ ခေတ်မီမိသားစုဘဝနှင့် အဆင်ပြေစွာကိုက်ညီသော မိုဘိုင်းအသုံးပြုရလွယ်ကူပြီး 
                အွန်လိုင်းမှရယူနိုင်သော သင်ယူမှုအတွေ့အကြုံများကို ပေးအပ်ရန် ကျွန်ုပ်တို့ ကတိပြုပါသည်။
              </p>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-foreground mb-4">
                Our Core Values 💫
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These values guide everything we do at Astro Hub
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card 
                    key={value.title} 
                    variant="elevated"
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-fredoka font-bold text-xl text-foreground mb-1">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground/80 font-myanmar mb-3">
                        {value.titleMm}
                      </p>
                      <p className="text-muted-foreground mb-2">
                        {value.description}
                      </p>
                      <p className="text-sm text-muted-foreground/80 font-myanmar">
                        {value.descriptionMm}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-foreground mb-4">
                Astro Hub Team 🚀
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the passionate educators and innovators behind Astro Hub
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card 
                  key={member.name} 
                  variant="elevated"
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover border-4 border-primary/20"
                      />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <Star className="w-4 h-4 text-accent-foreground" />
                      </div>
                    </div>
                    <h3 className="font-fredoka font-bold text-lg text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 font-myanmar mb-2">
                      {member.nameMm}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {member.role}
                    </p>
                    <p className="text-xs text-muted-foreground/70 font-myanmar">
                      {member.roleMm}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
