"use client";
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  strength?: number;
};

export const MagneticButton = forwardRef<HTMLButtonElement, Props>(
  function MagneticButton(
    { children, variant = "primary", strength = 16, className, ...rest },
    _ref,
  ) {
    const wrapRef = useMagnetic<HTMLSpanElement>(strength, 130);
    return (
      <span ref={wrapRef} className="inline-block will-change-transform">
        <button
          {...rest}
          className={cn(
            "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-[color,background,border-color,box-shadow] duration-300",
            variant === "primary" &&
              "bg-foreground text-background shadow-[0_10px_40px_-10px_oklch(0.82_0.13_220/0.55)] hover:shadow-[0_10px_50px_-5px_oklch(0.82_0.13_220/0.75)]",
            variant === "ghost" &&
              "glass text-foreground hover:border-white/20 hover:bg-white/[0.07]",
            className,
          )}
        >
          <span className="relative z-10 flex items-center gap-2">{children}</span>
          {variant === "primary" && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-0 translate-y-full bg-[linear-gradient(135deg,var(--cyan),var(--violet))] transition-transform duration-500 ease-out group-hover:translate-y-0"
            />
          )}
        </button>
      </span>
    );
  },
);
