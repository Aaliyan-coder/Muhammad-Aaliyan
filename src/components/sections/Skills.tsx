"use client";
import { Suspense, lazy } from "react";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { skillGroups } from "@/lib/data/skills";

const SkillsOrbit = lazy(() =>
  import("@/components/three/SkillsOrbit").then((m) => ({
    default: m.SkillsOrbit,
  })),
);

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Stack"
          title={<>Tools I reach for, by <span className="text-gradient-cool">instinct</span>.</>}
          description="A curated stack — chosen for clarity, performance, and developer joy. Hover the orbit to feel the system breathe."
        />

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_50%_50%,oklch(0.16_0.03_270),oklch(0.08_0.02_260))]">
              <Suspense fallback={null}>
                <SkillsOrbit />
              </Suspense>
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]" />
            </div>
          </Reveal>

          <div className="space-y-5">
            {skillGroups.map((g, gi) => (
              <Reveal key={g.label} delay={gi * 0.05}>
                <div className="glass group rounded-2xl p-5 transition-colors hover:border-white/15">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {g.label}
                    </h3>
                    <span className="text-xs text-muted-foreground/60">
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm transition-colors hover:border-cyan/40 hover:bg-cyan/[0.06] hover:text-foreground"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
