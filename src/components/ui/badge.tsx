import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-nunito",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: 
          "text-foreground border-2",
        // Kid-friendly variants
        xp: 
          "border-transparent bg-xp text-xp-foreground shadow-sm",
        level:
          "border-transparent bg-level text-level-foreground shadow-sm",
        achievement:
          "border-transparent bg-badge text-badge-foreground shadow-sm",
        success:
          "border-transparent bg-success text-white shadow-sm",
        star:
          "border-transparent bg-star text-xp-foreground shadow-sm",
        age:
          "border-2 border-secondary bg-secondary/10 text-secondary font-bold",
        category:
          "border-2 border-primary bg-primary/10 text-primary font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
