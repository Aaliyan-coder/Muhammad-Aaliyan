"use client";
import { useMemo, useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Reveal, StaggerGroup, revealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProjectCard, repoToCard, type ProjectCardData } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { getGithubRepos } from "@/lib/github.functions";
import { featuredFallback, FEATURED_KEYWORDS } from "@/lib/data/featured";
import { motion } from "framer-motion";
import { profile } from "@/lib/data/profile";
import { ArrowUpRight } from "lucide-react";

export const projectsQueryOptions = queryOptions({
  queryKey: ["github-repos"],
  queryFn: () => getGithubRepos(),
  staleTime: 1000 * 60 * 10,
});

function matchesFeatured(name: string, keywords: string[]) {
  const lower = name.toLowerCase();
  return keywords.every((k) => lower.includes(k));
}

export function Projects() {
  const { data } = useSuspenseQuery(projectsQueryOptions);
  const [active, setActive] = useState<ProjectCardData | null>(null);

  const cards = useMemo<ProjectCardData[]>(() => {
    const fromRepos = data.map(repoToCard);
    // Mark matching repos as featured
    const enriched = fromRepos.map((c) => {
      const isFeatured = FEATURED_KEYWORDS.some((kw) =>
        matchesFeatured(c.title.toLowerCase(), kw),
      );
      return { ...c, featured: isFeatured };
    });
    // If a featured slot has no real repo, inject fallback
    const haveKg = enriched.some((c) =>
      matchesFeatured(c.title.toLowerCase(), FEATURED_KEYWORDS[0]),
    );
    const haveYolo = enriched.some((c) =>
      matchesFeatured(c.title.toLowerCase(), FEATURED_KEYWORDS[1]),
    );
    const injected: ProjectCardData[] = [];
    if (!haveKg) {
      const f = featuredFallback[0];
      injected.push({
        id: "f-kg",
        title: f.name,
        description: f.description,
        language: "Python",
        topics: f.tech,
        stars: 0,
        url: profile.github,
        homepage: null,
        featured: true,
      });
    }
    if (!haveYolo) {
      const f = featuredFallback[1];
      injected.push({
        id: "f-yolo",
        title: f.name,
        description: f.description,
        language: "Python",
        topics: f.tech,
        stars: 0,
        url: profile.github,
        homepage: null,
        featured: true,
      });
    }
    const all = [...injected, ...enriched];
    // Featured first, then by stars (already sorted), cap at 9
    return [
      ...all.filter((c) => c.featured),
      ...all.filter((c) => !c.featured),
    ].slice(0, 9);
  }, [data]);

  return (
    <section id="projects" className="relative px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Selected Work"
          title={<>Projects shipped, ideas <span className="text-gradient-cool">in motion</span>.</>}
          description={
            <>
              Live from{" "}
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                github.com/{profile.githubUser}
              </a>
              . Featured pieces are pinned first, the rest are sorted by traction.
            </>
          }
        />

        {cards.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
            <p>
              Couldn't fetch live repos right now. Visit{" "}
              <a
                href={profile.github}
                className="text-foreground underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                github.com/{profile.githubUser}
              </a>{" "}
              to see everything.
            </p>
          </div>
        ) : (
          <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <motion.div key={c.id} variants={revealItem}>
                <ProjectCard data={c} onOpen={() => setActive(c)} />
              </motion.div>
            ))}
          </StaggerGroup>
        )}

        <Reveal>
          <div className="mt-12 flex justify-center">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
            >
              See every repo on GitHub
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
