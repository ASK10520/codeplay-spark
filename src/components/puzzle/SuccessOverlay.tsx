import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, ChevronRight, RotateCcw } from 'lucide-react';

interface SuccessOverlayProps {
  onReset: () => void;
  onNext: () => void;
}

export function SuccessOverlay({ onReset, onNext }: SuccessOverlayProps) {
  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card variant="achievement" className="p-8 text-center max-w-sm w-full animate-bounce-in">
        <span className="text-7xl mb-4 block">🎉</span>
        <h3 className="font-fredoka font-bold text-3xl text-foreground mb-2">
          Amazing Job!
        </h3>
        <p className="text-muted-foreground mb-4 font-nunito">
          You helped the robot reach the star!
        </p>
        <div className="flex justify-center gap-1 mb-6">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className="w-10 h-10 text-star fill-star"
              style={{ animation: `bounce-in 0.5s ease-out ${i * 0.2}s both` }}
            />
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Button variant="success" onClick={onNext}>
            Next Lesson
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
