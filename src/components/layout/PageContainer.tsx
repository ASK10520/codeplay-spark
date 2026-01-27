import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return (
    <section className={cn("py-8 md:py-12", className)}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ children, subtitle, className }: SectionTitleProps) {
  return (
    <div className={cn("mb-8", className)}>
      <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-foreground mb-2">
        {children}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
