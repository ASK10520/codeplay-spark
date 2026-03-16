import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { CodeBlock } from './types';
import { LEVEL } from './puzzleData';

interface HintSystemProps {
  workspace: CodeBlock[];
  attemptCount: number;
}

const PROGRESSIVE_HINTS = [
  {
    title: "Getting Started",
    message: "💡 Look at the grid — the robot faces downward. It needs to move down first, then find a path around the walls to reach the ⭐ star.",
  },
  {
    title: "Use Movement",
    message: "💡 Try placing some Move Forward blocks. The robot moves in the direction it's facing. Use Turn Left or Turn Right to change direction!",
  },
  {
    title: "Think About Patterns",
    message: "💡 Do you notice the robot needs to move forward several times in a row? Instead of many Move Forward blocks, try the Repeat 3× block with Move Forward inside!",
  },
  {
    title: "Path Strategy",
    message: "💡 Here's a strategy: Move down to row 3, then turn right and move across, then turn and head toward the star. Use Repeat to save blocks!",
  },
  {
    title: "Almost There!",
    message: "💡 One possible solution: Move Forward → Turn Right → Repeat 3× (Move Forward) → Turn Right → Repeat 3× (Move Forward) → Turn Left → Move Forward.",
  },
];

export function HintSystem({ workspace, attemptCount }: HintSystemProps) {
  const [hintLevel, setHintLevel] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentHint = PROGRESSIVE_HINTS[Math.min(hintLevel, PROGRESSIVE_HINTS.length - 1)];

  // Contextual extra tip based on workspace state
  let contextTip: string | null = null;
  if (workspace.length > 0) {
    const hasRepeat = workspace.some(b => b.type === 'repeat');
    const hasContainer = workspace.some(b => b.type === 'repeat' || b.type === 'ifClear');
    const emptyContainer = workspace.some(
      b => (b.type === 'repeat' || b.type === 'ifClear') && (!b.children || b.children.length === 0)
    );

    if (emptyContainer) {
      contextTip = "⚠️ You have an empty container block! Drag Move Forward or Turn blocks inside it.";
    } else if (!hasRepeat && workspace.length > 5) {
      contextTip = "🔄 Your code is getting long! Try using the Repeat 3× block to shorten it.";
    } else if (hasContainer && attemptCount > 0) {
      contextTip = "🔍 Close! Check if the blocks inside your container are in the right order.";
    }
  }

  const handleToggle = () => {
    if (!showHint) {
      setShowHint(true);
    } else {
      setShowHint(false);
    }
  };

  const handleNextHint = () => {
    if (hintLevel < PROGRESSIVE_HINTS.length - 1) {
      setHintLevel(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleToggle}
      >
        <Lightbulb className="w-4 h-4" />
        {showHint ? "Hide Hint" : "Need a Hint?"}
      </Button>

      {showHint && (
        <Card variant="flat" className="bg-star/10 border-star/30">
          <CardContent className="p-3 space-y-2">
            <p className="text-xs font-bold font-fredoka text-star">
              Hint {hintLevel + 1} of {PROGRESSIVE_HINTS.length}: {currentHint.title}
            </p>
            <p className="text-sm font-nunito">{currentHint.message}</p>

            {contextTip && (
              <p className="text-xs font-nunito text-foreground/70 border-t border-star/20 pt-2 mt-2">
                {contextTip}
              </p>
            )}

            {hintLevel < PROGRESSIVE_HINTS.length - 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={handleNextHint}
              >
                Still stuck? Next hint
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
