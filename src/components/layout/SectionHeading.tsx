import { type ReactNode } from "react";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-14 flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden className="h-1 w-1 rounded-full bg-cyan" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="text-balance font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
