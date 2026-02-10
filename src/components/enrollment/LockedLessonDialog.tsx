import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";

interface LockedLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnroll: () => void;
}

export function LockedLessonDialog({ open, onOpenChange, onEnroll }: LockedLessonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-fredoka">🔒 Lesson Locked</DialogTitle>
            <DialogDescription className="mt-2">
              This lesson is locked. Please enroll and complete payment to access all course content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
            <Button
              variant="fun"
              onClick={() => {
                onOpenChange(false);
                onEnroll();
              }}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4" />
              Enroll Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
