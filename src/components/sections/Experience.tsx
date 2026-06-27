"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { experience } from "@/lib/data/experience";
import { BrainCircuit, Code2, GraduationCap, MonitorSmartphone } from "lucide-react";

const ICONS = {
  engineering: Code2,
  frontend: MonitorSmartphone,
  ml: BrainCircuit,
  web: GraduationCap,
} as const;

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Experience"
          title={<>A path of <span className="text-gradient-cool">deliberate</span> reps.</>}
          description="Roles that taught me to ship across the stack, mentor at scale, and lean into ML where it matters."
        />

        <div ref={ref} className="relative mt-12">
          {/* Track */}
          <div className="absolute left-5 top-0 h-full w-px bg-white/10 sm:left-1/2 sm:-translate-x-1/2" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-5 top-0 w-px bg-gradient-to-b from-cyan via-accent to-transparent sm:left-1/2 sm:-translate-x-1/2"
          />

          <ul className="space-y-12">
            {experience.map((e, i) => {
              const Icon = ICONS[e.tag];
              const right = i % 2 === 0;
              return (
                <li
                  key={`${e.company}-${e.role}`}
                  className="relative grid sm:grid-cols-2 sm:gap-12"
                >
                  {/* Node */}
                  <span
                    aria-hidden
                    className="absolute left-5 top-7 z-10 -translate-x-1/2 sm:left-1/2"
                  >
                    <span className="relative block h-3 w-3 rounded-full bg-cyan shadow-[0_0_18px_var(--cyan)]">
                      <span className="absolute inset-0 animate-ping rounded-full bg-cyan/40" />
                    </span>
                  </span>

                  {/* Card */}
                  <Reveal
                    className={`pl-12 sm:pl-0 ${right ? "sm:col-start-1" : "sm:col-start-2"}`}
                    delay={i * 0.05}
                  >
                    <article className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04]">
                          <Icon className="h-3.5 w-3.5 text-cyan" />
                        </span>
                        {e.period}
                      </div>
                      <h3 className="mt-3 font-display text-xl leading-tight">
                        {e.role}
                      </h3>
                      <p className="text-sm text-muted-foreground">{e.company}</p>
                      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        {e.highlights.map((h) => (
                          <li key={h} className="flex gap-2">
                            <span
                              aria-hidden
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan/60"
                            />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
