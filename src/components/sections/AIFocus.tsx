"use client";
import { Suspense, lazy } from "react";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { aiInterests } from "@/lib/data/profile";

const KnowledgeGraph = lazy(() =>
  import("@/components/three/KnowledgeGraph").then((m) => ({
    default: m.KnowledgeGraph,
  })),
);

export function AIFocus() {
  return (
    <section id="ai" className="relative px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Research Focus"
          title={<>Where my <span className="text-gradient-cool">curiosity</span> lives.</>}
          description="A live knowledge graph of the areas I'm actively shipping with, studying, and writing about."
        />

        <div className="grid items-stretch gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_50%_50%,oklch(0.16_0.03_270),oklch(0.08_0.02_260))]">
              <Suspense fallback={null}>
                <KnowledgeGraph />
              </Suspense>
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]" />
            </div>
          </Reveal>

          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="text-lg text-muted-foreground">
                I think of intelligent systems as composable graphs of small, well-instrumented
                models — retrieval, planning, perception, and language working together with
                clean interfaces.
              </p>
            </Reveal>
            <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-2">
              {aiInterests.map((tag, i) => (
                <Reveal key={tag} delay={i * 0.04}>
                  <li className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]"
                    />
                    {tag}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
