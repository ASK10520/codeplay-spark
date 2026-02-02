import * as React from "react";
import { Progress } from "@/components/ui/progress";

interface Props {
  value: number;
  label?: string;
}

// Simple accessible progress bar wrapper
export const ProgressBar: React.FC<Props> = ({ value, label = "Progress" }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground" aria-live="polite">{value}%</span>
      </div>
      <Progress value={value} aria-label={label} variant="course" size="lg" />
    </div>
  );
};

export default ProgressBar;
