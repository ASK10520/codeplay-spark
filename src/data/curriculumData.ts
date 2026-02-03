import { BookOpen, Puzzle, Gamepad2, Sparkles, Brain, Cpu, Palette, Rocket } from "lucide-react";

export const curriculumFilters = {
  grades: [
    { id: "6-7", label: "Age 6–7", description: "Little Explorers" },
    { id: "7-9", label: "Age 7–9", description: "Young Builders" },
    { id: "9-11", label: "Age 9–11", description: "Tech Pioneers" },
    { id: "11-14", label: "Age 11–14", description: "Future Developers" },
  ],
  durations: [
    { id: "week", label: "1 Week" },
    { id: "month", label: "1 Month" },
    { id: "quarter", label: "Quarter" },
  ],
  topics: [
    { id: "logic", label: "Logic", icon: Brain, color: "bg-success" },
    { id: "block-coding", label: "Block Coding", icon: Puzzle, color: "bg-secondary" },
    { id: "games", label: "Games", icon: Gamepad2, color: "bg-funPink" },
    { id: "ai-basics", label: "AI Basics", icon: Cpu, color: "bg-badge" },
    { id: "projects", label: "Projects", icon: Rocket, color: "bg-primary" },
    { id: "design", label: "Design", icon: Palette, color: "bg-star" },
  ],
  devices: [
    { id: "mobile", label: "Mobile" },
    { id: "tablet", label: "Tablet" },
    { id: "desktop", label: "Desktop" },
  ],
  languages: [
    { id: "myanmar", label: "မြန်မာ" },
    { id: "english", label: "English" },
    { id: "bilingual", label: "Bilingual" },
  ],
};

export interface CurriculumCourse {
  id: string;
  title: string;
  titleMm?: string;
  description: string;
  descriptionMm?: string;
  topic: string;
  gradeRange: string;
  duration: string;
  durationWeeks: number;
  thumbnail: string;
  color: string;
  isNew?: boolean;
  progress?: number;
  devices: string[];
  language: string;
}

export const curriculumCourses: CurriculumCourse[] = [
  {
    id: "thinking-programmer",
    title: "Thinking Like a Programmer",
    titleMm: "ပရိုဂရမ်မာတစ်ယောက်လို စဉ်းစားခြင်း",
    description: "Learn the basics of computational thinking through fun puzzles and activities!",
    descriptionMm: "ပဟေဠိများနှင့် လှုပ်ရှားမှုများဖြင့် ကွန်ပျူတာစဉ်းစားခြင်း အခြေခံကို လေ့လာပါ!",
    topic: "logic",
    gradeRange: "6-7",
    duration: "4 weeks",
    durationWeeks: 4,
    thumbnail: "🧠",
    color: "from-success/20 to-success/5",
    isNew: true,
    devices: ["mobile", "tablet", "desktop"],
    language: "bilingual",
  },
  {
    id: "coding-blocks",
    title: "Coding with Blocks",
    titleMm: "ဘလောက်များဖြင့် ကုဒ်ရေးခြင်း",
    description: "Create programs by snapping colorful blocks together. Perfect for beginners!",
    descriptionMm: "အရောင်စုံ ဘလောက်များကို ချိတ်ဆက်ပြီး ပရိုဂရမ်များ ဖန်တီးပါ!",
    topic: "block-coding",
    gradeRange: "7-9",
    duration: "6 weeks",
    durationWeeks: 6,
    thumbnail: "🧩",
    color: "from-secondary/20 to-secondary/5",
    progress: 45,
    devices: ["tablet", "desktop"],
    language: "bilingual",
  },
  {
    id: "games-animations",
    title: "Games & Animations",
    titleMm: "ဂိမ်းများနှင့် အန်နီမေးရှင်းများ",
    description: "Design your own games and bring characters to life with animations!",
    descriptionMm: "သင့်ကိုယ်ပိုင် ဂိမ်းများ ဒီဇိုင်းဆွဲပြီး ဇာတ်ကောင်များကို အန်နီမေးရှင်းဖြင့် အသက်သွင်းပါ!",
    topic: "games",
    gradeRange: "9-11",
    duration: "8 weeks",
    durationWeeks: 8,
    thumbnail: "🎮",
    color: "from-funPink/20 to-funPink/5",
    devices: ["desktop"],
    language: "english",
  },
  {
    id: "creative-projects",
    title: "Creative Coding Projects",
    titleMm: "ဖန်တီးမှုရှိသော ကုဒ်ရေးခြင်း ပရောဂျက်များ",
    description: "Build real-world projects and showcase your coding skills!",
    descriptionMm: "လက်တွေ့ ပရောဂျက်များ တည်ဆောက်ပြီး သင့်ကုဒ်ရေးစွမ်းရည်ကို ပြသပါ!",
    topic: "projects",
    gradeRange: "11-14",
    duration: "Quarter",
    durationWeeks: 12,
    thumbnail: "🚀",
    color: "from-primary/20 to-primary/5",
    isNew: true,
    devices: ["desktop"],
    language: "english",
  },
  {
    id: "ai-explorers",
    title: "AI Explorers",
    titleMm: "AI စူးစမ်းသူများ",
    description: "Discover the magic of artificial intelligence through hands-on experiments!",
    descriptionMm: "လက်တွေ့ စမ်းသပ်မှုများဖြင့် AI ၏ မှော်ဆန်မှုကို ရှာဖွေပါ!",
    topic: "ai-basics",
    gradeRange: "9-11",
    duration: "6 weeks",
    durationWeeks: 6,
    thumbnail: "🤖",
    color: "from-badge/20 to-badge/5",
    isNew: true,
    devices: ["tablet", "desktop"],
    language: "bilingual",
  },
  {
    id: "puzzle-masters",
    title: "Puzzle Masters",
    titleMm: "ပဟေဠိ ကျွမ်းကျင်သူများ",
    description: "Solve challenging puzzles and train your logical thinking!",
    descriptionMm: "စိန်ခေါ်မှုရှိသော ပဟေဠိများကို ဖြေရှင်းပြီး သင့်ယုတ္တိဗေဒ စဉ်းစားမှုကို လေ့ကျင့်ပါ!",
    topic: "logic",
    gradeRange: "7-9",
    duration: "4 weeks",
    durationWeeks: 4,
    thumbnail: "🧩",
    color: "from-success/20 to-success/5",
    progress: 80,
    devices: ["mobile", "tablet", "desktop"],
    language: "myanmar",
  },
  {
    id: "app-designers",
    title: "App Designers Junior",
    titleMm: "အက်ပ် ဒီဇိုင်နာ လူငယ်များ",
    description: "Learn to design beautiful apps that people love to use!",
    descriptionMm: "လူတိုင်း နှစ်သက်မည့် လှပသော အက်ပ်များ ဒီဇိုင်းဆွဲရန် လေ့လာပါ!",
    topic: "design",
    gradeRange: "9-11",
    duration: "6 weeks",
    durationWeeks: 6,
    thumbnail: "✨",
    color: "from-star/20 to-star/5",
    devices: ["tablet", "desktop"],
    language: "bilingual",
  },
  {
    id: "first-steps",
    title: "First Steps in Coding",
    titleMm: "ကုဒ်ရေးခြင်း ပထမခြေလှမ်းများ",
    description: "Start your coding journey with simple, fun activities!",
    descriptionMm: "ရိုးရှင်းပြီး ပျော်စရာ လှုပ်ရှားမှုများဖြင့် သင့် ကုဒ်ရေးခရီးကို စတင်ပါ!",
    topic: "block-coding",
    gradeRange: "6-7",
    duration: "4 weeks",
    durationWeeks: 4,
    thumbnail: "🌟",
    color: "from-secondary/20 to-secondary/5",
    isNew: true,
    devices: ["mobile", "tablet"],
    language: "myanmar",
  },
];
