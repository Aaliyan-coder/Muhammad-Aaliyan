"use client";
import { Suspense, lazy } from "react";
import { Bitmoji } from "@/components/fx/Bitmoji";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { profile } from "@/lib/data/profile";
import { education } from "@/lib/data/experience";

const BrainOrb = lazy(() =>
  import("@/components/three/BrainOrb").then((m) => ({ default: m.BrainOrb })),
);

const stats = [
  { value: "100+", label: "Students mentored" },
  { value: "30%", label: "Faster onboarding" },
  { value: "3.5", label: "CGPA in AI" },
  { value: "4.7/5", label: "Teaching score" },
];

export function About() {
  return (
    <section id="about" className="relative px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About"
          title={<>A builder of <span className="text-gradient-cool">intelligent products</span>.</>}
        />

        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <Reveal>
              <p className="text-lg text-muted-foreground sm:text-xl">
                {profile.summary}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-base text-muted-foreground">
                Most of my work lives in machine learning — computer vision with YOLOv8 and
                OpenCV, retrieval-augmented pipelines over graph databases, and the model
                plumbing that decides whether a system holds up in production. Full stack is
                what I reach for next: React and Django are how a trained model stops being a
                notebook and starts being a product.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="glass mt-6 rounded-2xl p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Education
                </p>
                <p className="mt-2 font-display text-xl">{education.degree}</p>
                <p className="text-sm text-muted-foreground">{education.school}</p>
                <p className="mt-1 text-sm text-muted-foreground">{education.detail}</p>
              </div>
            </Reveal>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.1 + i * 0.05}>
                  <div className="glass rounded-2xl p-4">
                    <p className="font-display text-2xl tracking-tight">{s.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_50%_40%,oklch(0.18_0.04_270),oklch(0.08_0.02_260))]">
              <Suspense fallback={null}>
                <BrainOrb />
              </Suspense>

              {/* Portrait sits in front of the neural orb */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[6%] flex items-end justify-center">
                <Bitmoji
                  src={profile.avatar || undefined}
                  className="h-auto w-[86%] drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]"
                />
                {profile.name} · online
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
