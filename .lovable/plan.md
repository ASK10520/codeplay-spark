
# Enhance Curriculum Courses with Detailed Educational Content

## Overview

This plan will add comprehensive, parent-friendly course details to the three specified courses in the Curriculum Catalog. We'll extend the data model and create a new Course Detail page specifically for curriculum courses.

---

## What We'll Add to Each Course

For the three courses (Thinking Like a Programmer, Coding with Blocks, Games & Animations), we will add:

1. **Course Overview** - A friendly paragraph for parents and kids
2. **Learning Objectives** - 4-6 bullet points in simple language
3. **Key Skills Gained** - Skill tags (logical thinking, creativity, etc.)
4. **Weekly Breakdown** - What's covered each week
5. **Who This Course Is For** - Age group, skill level, prerequisites
6. **Outcome** - What children will create or understand

---

## Technical Implementation

### Step 1: Extend the CurriculumCourse Interface

Update `src/data/curriculumData.ts` to include new fields:

```typescript
export interface WeeklyContent {
  week: number;
  title: string;
  description: string;
}

export interface CurriculumCourse {
  // Existing fields...
  
  // New detailed fields
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
```

### Step 2: Add Detailed Content to Three Courses

**Course 1: Thinking Like a Programmer (Ages 6-7, 4 weeks)**
- Overview: Fun introduction to computational thinking through puzzles
- Objectives: Break problems into steps, find patterns, think like a coder
- Skills: Logical thinking, problem-solving, sequencing, pattern recognition
- Weekly breakdown: 4 weeks of progressive learning
- Outcome: Solve puzzles and understand how programmers think

**Course 2: Coding with Blocks (Ages 7-9, 6 weeks)**
- Overview: Visual programming with drag-and-drop blocks
- Objectives: Create animations, use loops, make interactive stories
- Skills: Sequential thinking, debugging, creativity, persistence
- Weekly breakdown: 6 weeks from basics to projects
- Outcome: Create interactive stories and simple games

**Course 3: Games & Animations (Ages 9-11, 8 weeks)**
- Overview: Design games and bring characters to life
- Objectives: Game mechanics, character animation, sound effects
- Skills: Game design, animation, storytelling, project planning
- Weekly breakdown: 8 weeks building toward a final game project
- Outcome: Create a complete playable game to share

### Step 3: Create Curriculum Course Detail Page

Create `src/pages/CurriculumCourseDetail.tsx` with sections:
- Hero banner with course thumbnail and badges
- Course Overview card
- Learning Objectives checklist
- Skills gained as colorful tags
- Weekly breakdown accordion/timeline
- "Who This Course Is For" info box
- Course Outcome highlight
- Enrollment CTA button

### Step 4: Update Routing

Add new route in `App.tsx`:
```typescript
<Route path="/curriculum/:id" element={<CurriculumCourseDetail />} />
```

### Step 5: Update CurriculumCard Navigation

Modify `CurriculumCard.tsx` to navigate to `/curriculum/:id` instead of `/course/:id`

---

## Course Content Details

### Course 1: Thinking Like a Programmer

**Overview:**
"Get ready for a brain-boosting adventure! In this fun course, your child will discover how programmers think and solve problems. Through exciting puzzles, games, and activities, little learners will build strong thinking skills that help them in coding and everyday life!"

**Learning Objectives:**
- Break big problems into smaller, easy steps
- Spot patterns and use them to solve puzzles faster
- Follow and create step-by-step instructions
- Think creatively to find different solutions
- Work together with friends to solve challenges

**Key Skills:** Logical Thinking, Problem-Solving, Pattern Recognition, Sequencing, Critical Thinking

**Weekly Breakdown:**
- Week 1: What is a Problem? - Fun puzzles and games to start thinking like a coder
- Week 2: Step by Step - Learn to break tasks into small actions
- Week 3: Pattern Power - Discover patterns in shapes, colors, and sequences
- Week 4: Think & Solve - Combine all skills to complete exciting challenges

**Who This Is For:**
- Ages 6-7 (Little Explorers)
- No coding experience needed - perfect for beginners!
- Curious kids who love puzzles and games

**Outcome:**
"By the end, your child will solve puzzles confidently, explain their thinking process, and have a programmer's mindset ready for their coding journey!"

---

### Course 2: Coding with Blocks

**Overview:**
"Time to become a real coder! In this colorful course, kids learn programming by snapping blocks together like building with digital LEGOs. No typing needed - just drag, drop, and watch amazing things happen on screen!"

**Learning Objectives:**
- Create colorful animations with moving characters
- Use loops to make actions repeat automatically
- Make programs that respond to clicks and key presses
- Debug code by finding and fixing mistakes
- Build interactive stories with multiple scenes
- Share creations with friends and family

**Key Skills:** Sequential Thinking, Debugging, Creativity, Persistence, Computational Logic, Digital Literacy

**Weekly Breakdown:**
- Week 1: Hello, Blocks! - Meet the coding blocks and make your first program
- Week 2: Move & Dance - Create characters that move and dance on screen
- Week 3: Repeat, Repeat! - Discover the magic of loops
- Week 4: Sound & Music - Add sounds and music to your creations
- Week 5: Story Time - Build an interactive story with scenes
- Week 6: My Big Project - Create and share your own masterpiece

**Who This Is For:**
- Ages 7-9 (Young Builders)
- Beginner level - no prior coding needed
- Kids who finished "Thinking Like a Programmer" or love creative play

**Outcome:**
"Your child will create their own interactive story or simple game using block coding. They'll understand core programming concepts like sequences, loops, and events - building a strong foundation for future coding adventures!"

---

### Course 3: Games & Animations

**Overview:**
"Ready to make your own video game? In this exciting course, young creators learn the secrets of game design and animation. From bouncing characters to epic adventures, kids will build real games they can play and share with friends!"

**Learning Objectives:**
- Design game characters and backgrounds from scratch
- Create smooth animations that bring characters to life
- Program game rules and scoring systems
- Add sound effects and background music
- Test and improve games based on feedback
- Complete a full game project from start to finish

**Key Skills:** Game Design, Animation, Storytelling, Project Planning, Problem-Solving, Collaboration, Artistic Expression

**Weekly Breakdown:**
- Week 1: Game Design Basics - What makes games fun? Plan your first game
- Week 2: Character Creation - Design and animate your game hero
- Week 3: World Building - Create exciting game backgrounds and levels
- Week 4: Rules & Points - Program scoring, lives, and game rules
- Week 5: Sound Studio - Add music and sound effects
- Week 6: Power-Ups & Challenges - Make games more exciting
- Week 7: Testing Lab - Test your game and fix bugs
- Week 8: Launch Day! - Polish and share your finished game

**Who This Is For:**
- Ages 9-11 (Tech Pioneers)
- Intermediate level - some block coding experience helpful
- Kids who completed "Coding with Blocks" or have used Scratch

**Outcome:**
"Your child will design, build, and publish their own playable video game! They'll understand game mechanics, animation principles, and project management - skills that prepare them for advanced coding and creative careers!"

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/data/curriculumData.ts` | Modify | Extend interface and add detailed course content |
| `src/pages/CurriculumCourseDetail.tsx` | Create | New detail page with all course sections |
| `src/App.tsx` | Modify | Add route for `/curriculum/:id` |
| `src/pages/CurriculumCatalog.tsx` | Modify | Update navigation to use new route |

---

## Visual Design Notes

- Use playful icons and emojis to make content engaging
- Weekly breakdown shown as a colorful timeline or accordion
- Skills displayed as colorful pill badges
- Progress indicators for enrolled students
- Bilingual support maintained (English + Myanmar)
- Mobile-responsive layout with collapsible sections
