import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle,
  ChevronRight,
  Star
} from "lucide-react";
import codingBlocksPattern from "@/assets/coding-blocks-pattern.jpg";

// Simulated code blocks for drag-and-drop
const codeBlocks = [
  { id: "1", label: "Move Forward", color: "bg-secondary", icon: "➡️" },
  { id: "2", label: "Turn Left", color: "bg-success", icon: "↩️" },
  { id: "3", label: "Turn Right", color: "bg-badge", icon: "↪️" },
  { id: "4", label: "Repeat 3 Times", color: "bg-primary", icon: "🔄" },
  { id: "5", label: "If Path Clear", color: "bg-star", icon: "❓" },
];

const LessonPlayground = () => {
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<typeof codeBlocks>([]);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleAddBlock = (block: typeof codeBlocks[0]) => {
    setWorkspace([...workspace, { ...block, id: `${block.id}-${Date.now()}` }]);
  };

  const handleReset = () => {
    setWorkspace([]);
    setIsComplete(false);
  };

  const handleRun = () => {
    // Simulate running the code
    if (workspace.length >= 3) {
      setIsComplete(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-2 border-border p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-fredoka font-bold text-lg">Repeat Magic 🔄</h1>
              <p className="text-sm text-muted-foreground">Lesson 4 of 12</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Progress value={33} variant="course" className="w-32 hidden sm:block" />
            <Badge variant="xp">+50 XP</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Instructions Panel */}
          <div className="lg:col-span-1">
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="font-fredoka font-bold text-xl mb-4 flex items-center gap-2">
                  📋 Your Mission
                </h2>
                <p className="text-muted-foreground mb-4">
                  Help the robot reach the star! Use the <strong>Repeat</strong> block 
                  to make your code shorter and smarter.
                </p>
                
                {/* Hint section */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setShowHint(!showHint)}
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showHint ? "Hide Hint" : "Need a Hint?"}
                  </Button>
                  
                  {showHint && (
                    <Card variant="flat" className="bg-star/10 border-star/30">
                      <CardContent className="p-4">
                        <p className="text-sm">
                          💡 Try using "Repeat 3 Times" with "Move Forward" inside!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Game Preview */}
                <div 
                  className="mt-6 h-48 rounded-xl bg-cover bg-center flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundImage: `url(${codingBlocksPattern})` }}
                >
                  <div className="absolute inset-0 bg-foreground/50" />
                  <div className="relative z-10 text-center">
                    <span className="text-5xl animate-float">🤖</span>
                    <p className="text-white font-bold mt-2">Robot is ready!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coding Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Blocks */}
            <Card variant="flat">
              <CardContent className="p-4">
                <h3 className="font-fredoka font-bold mb-3">🧩 Code Blocks</h3>
                <div className="flex flex-wrap gap-2">
                  {codeBlocks.map((block) => (
                    <Button
                      key={block.id}
                      variant="outline"
                      className={`${block.color} text-white border-0 hover:scale-105`}
                      onClick={() => handleAddBlock(block)}
                    >
                      <span className="mr-1">{block.icon}</span>
                      {block.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workspace */}
            <Card variant="elevated" className="min-h-[300px]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-fredoka font-bold">🎮 Your Code</h3>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
                
                {workspace.length === 0 ? (
                  <div className="h-48 border-2 border-dashed border-border rounded-xl flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      👆 Click on blocks above to add them here!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {workspace.map((block, index) => (
                      <div
                        key={block.id}
                        className={`${block.color} text-white p-3 rounded-xl flex items-center gap-2 animate-scale-in`}
                      >
                        <span>{block.icon}</span>
                        <span className="font-semibold">{block.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="fun" 
                size="lg" 
                className="flex-1"
                onClick={handleRun}
                disabled={workspace.length === 0}
              >
                <Play className="w-5 h-5" />
                Run Code
              </Button>
            </div>

            {/* Success Modal */}
            {isComplete && (
              <Card variant="achievement" className="p-6 text-center animate-bounce-in">
                <span className="text-6xl mb-4 block">🎉</span>
                <h3 className="font-fredoka font-bold text-2xl text-foreground mb-2">
                  Amazing Job!
                </h3>
                <p className="text-muted-foreground mb-4">
                  You helped the robot reach the star!
                </p>
                <div className="flex justify-center gap-1 mb-6">
                  {[1, 2, 3].map((i) => (
                    <Star key={i} className="w-8 h-8 text-star fill-star animate-star-burst" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleReset}>
                    Try Again
                  </Button>
                  <Button variant="success" onClick={() => navigate(-1)}>
                    Next Lesson
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayground;
