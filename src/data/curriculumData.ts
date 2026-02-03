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

export interface WeeklyContent {
  week: number;
  title: string;
  description: string;
}

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
  // Enhanced course details
  overview?: string;
  overviewMm?: string;
  learningObjectives?: string[];
  keySkills?: string[];
  weeklyBreakdown?: WeeklyContent[];
  whoIsThisFor?: {
    ageGroup: string;
    skillLevel: string;
    prerequisites: string;
  };
  outcome?: string;
  outcomeMm?: string;
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
    overview: "Get ready for a brain-boosting adventure! In this fun course, your child will discover how programmers think and solve problems. Through exciting puzzles, games, and activities, little learners will build strong thinking skills that help them in coding and everyday life!",
    overviewMm: "ဦးနှောက်အားဖြည့်စွမ်းသော စွန့်စားခန်းအတွက် အဆင်သင့်ဖြစ်ပါပြီ! ဤပျော်စရာသင်တန်းတွင် သင့်ကလေးသည် ပရိုဂရမ်မာများ မည်သို့စဉ်းစားပြီး ပြဿနာများကို ဖြေရှင်းကြောင်း ရှာဖွေတွေ့ရှိမည်ဖြစ်သည်။",
    learningObjectives: [
      "Break big problems into smaller, easy steps",
      "Spot patterns and use them to solve puzzles faster",
      "Follow and create step-by-step instructions",
      "Think creatively to find different solutions",
      "Work together with friends to solve challenges"
    ],
    keySkills: ["Logical Thinking", "Problem-Solving", "Pattern Recognition", "Sequencing", "Critical Thinking"],
    weeklyBreakdown: [
      { week: 1, title: "What is a Problem?", description: "Fun puzzles and games to start thinking like a coder" },
      { week: 2, title: "Step by Step", description: "Learn to break tasks into small actions" },
      { week: 3, title: "Pattern Power", description: "Discover patterns in shapes, colors, and sequences" },
      { week: 4, title: "Think & Solve", description: "Combine all skills to complete exciting challenges" }
    ],
    whoIsThisFor: {
      ageGroup: "Ages 6-7 (Little Explorers)",
      skillLevel: "No coding experience needed - perfect for beginners!",
      prerequisites: "Curious kids who love puzzles and games"
    },
    outcome: "By the end, your child will solve puzzles confidently, explain their thinking process, and have a programmer's mindset ready for their coding journey!",
    outcomeMm: "သင်တန်းပြီးဆုံးသောအခါ သင့်ကလေးသည် ပဟေဠိများကို ယုံကြည်စွာဖြေရှင်းနိုင်ပြီး ကုဒ်ရေးခရီးအတွက် ပရိုဂရမ်မာစိတ်နေထိုင်မှုရှိလာမည်ဖြစ်သည်!"
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
    overview: "Time to become a real coder! In this colorful course, kids learn programming by snapping blocks together like building with digital LEGOs. No typing needed - just drag, drop, and watch amazing things happen on screen!",
    overviewMm: "တကယ့်ကုဒ်ရေးသူဖြစ်လာဖို့ အချိန်တန်ပြီ! ဤအရောင်စုံသင်တန်းတွင် ကလေးများသည် ဒစ်ဂျစ်တယ် LEGO များကဲ့သို့ ဘလောက်များကို ချိတ်ဆက်ပြီး ပရိုဂရမ်ရေးနည်းကို လေ့လာကြသည်။",
    learningObjectives: [
      "Create colorful animations with moving characters",
      "Use loops to make actions repeat automatically",
      "Make programs that respond to clicks and key presses",
      "Debug code by finding and fixing mistakes",
      "Build interactive stories with multiple scenes",
      "Share creations with friends and family"
    ],
    keySkills: ["Sequential Thinking", "Debugging", "Creativity", "Persistence", "Computational Logic", "Digital Literacy"],
    weeklyBreakdown: [
      { week: 1, title: "Hello, Blocks!", description: "Meet the coding blocks and make your first program" },
      { week: 2, title: "Move & Dance", description: "Create characters that move and dance on screen" },
      { week: 3, title: "Repeat, Repeat!", description: "Discover the magic of loops" },
      { week: 4, title: "Sound & Music", description: "Add sounds and music to your creations" },
      { week: 5, title: "Story Time", description: "Build an interactive story with scenes" },
      { week: 6, title: "My Big Project", description: "Create and share your own masterpiece" }
    ],
    whoIsThisFor: {
      ageGroup: "Ages 7-9 (Young Builders)",
      skillLevel: "Beginner level - no prior coding needed",
      prerequisites: "Kids who finished 'Thinking Like a Programmer' or love creative play"
    },
    outcome: "Your child will create their own interactive story or simple game using block coding. They'll understand core programming concepts like sequences, loops, and events - building a strong foundation for future coding adventures!",
    outcomeMm: "သင့်ကလေးသည် ဘလောက်ကုဒ်ရေးခြင်းဖြင့် ကိုယ်ပိုင်အပြန်အလှန်ပုံပြင် သို့မဟုတ် ရိုးရှင်းသောဂိမ်းတစ်ခုကို ဖန်တီးနိုင်မည်ဖြစ်သည်။"
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
    overview: "Ready to make your own video game? In this exciting course, young creators learn the secrets of game design and animation. From bouncing characters to epic adventures, kids will build real games they can play and share with friends!",
    overviewMm: "သင့်ကိုယ်ပိုင်ဗီဒီယိုဂိမ်းလုပ်ဖို့ အဆင်သင့်ဖြစ်ပြီလား? ဤစိတ်လှုပ်ရှားဖွယ်သင်တန်းတွင် လူငယ်ဖန်တီးသူများသည် ဂိမ်းဒီဇိုင်းနှင့် အန်နီမေးရှင်း၏ လျှို့ဝှက်ချက်များကို လေ့လာကြသည်။",
    learningObjectives: [
      "Design game characters and backgrounds from scratch",
      "Create smooth animations that bring characters to life",
      "Program game rules and scoring systems",
      "Add sound effects and background music",
      "Test and improve games based on feedback",
      "Complete a full game project from start to finish"
    ],
    keySkills: ["Game Design", "Animation", "Storytelling", "Project Planning", "Problem-Solving", "Collaboration", "Artistic Expression"],
    weeklyBreakdown: [
      { week: 1, title: "Game Design Basics", description: "What makes games fun? Plan your first game" },
      { week: 2, title: "Character Creation", description: "Design and animate your game hero" },
      { week: 3, title: "World Building", description: "Create exciting game backgrounds and levels" },
      { week: 4, title: "Rules & Points", description: "Program scoring, lives, and game rules" },
      { week: 5, title: "Sound Studio", description: "Add music and sound effects" },
      { week: 6, title: "Power-Ups & Challenges", description: "Make games more exciting" },
      { week: 7, title: "Testing Lab", description: "Test your game and fix bugs" },
      { week: 8, title: "Launch Day!", description: "Polish and share your finished game" }
    ],
    whoIsThisFor: {
      ageGroup: "Ages 9-11 (Tech Pioneers)",
      skillLevel: "Intermediate level - some block coding experience helpful",
      prerequisites: "Kids who completed 'Coding with Blocks' or have used Scratch"
    },
    outcome: "Your child will design, build, and publish their own playable video game! They'll understand game mechanics, animation principles, and project management - skills that prepare them for advanced coding and creative careers!",
    outcomeMm: "သင့်ကလေးသည် ကိုယ်ပိုင်ကစားနိုင်သော ဗီဒီယိုဂိမ်းတစ်ခုကို ဒီဇိုင်းဆွဲ၊ တည်ဆောက်ပြီး ထုတ်ဝေနိုင်မည်ဖြစ်သည်!"
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
