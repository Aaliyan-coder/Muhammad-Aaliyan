"use client";
import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight, ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "@/components/fx/BrandIcons";
import type { GithubRepo } from "@/lib/github.functions";

function langColor(lang: string | null) {
  const map: Record<string, string> = {
    Python: "#4584b6",
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Jupyter: "#da5b0b",
    "Jupyter Notebook": "#da5b0b",
    Java: "#b07219",
    C: "#555555",
    "C++": "#f34b7d",
  };
  return (lang && map[lang]) || "#7cc7ff";
}

export type ProjectCardData = {
  id: string;
  title: string;
  description: string;
  language: string | null;
  topics: string[];
  stars: number;
  url: string;
  homepage: string | null;
  featured?: boolean;
};

export function repoToCard(r: GithubRepo): ProjectCardData {
  return {
    id: String(r.id),
    title: r.name
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description:
      r.description ??
      "An open-source experiment — visit the repo for context, code, and notes.",
    language: r.language,
    topics: r.topics.slice(0, 4),
    stars: r.stars,
    url: r.url,
    homepage: r.homepage,
  };
}

export function ProjectCard({
  data,
  onOpen,
}: {
  data: ProjectCardData;
  onOpen: () => void;
}) {
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const [hover, setHover] = useState(false);
  const overlay = useMotionTemplate`radial-gradient(360px circle at ${mx}% ${my}%, oklch(0.82 0.13 220 / 0.18), transparent 60%)`;

  return (
    <motion.article
      onPointerMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <motion.div
        aria-hidden
        style={{ background: overlay, opacity: hover ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
      />
      {data.featured && (
        <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan">
          Featured
        </span>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {data.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: langColor(data.language) }}
            />
            {data.language}
          </span>
        )}
        {data.stars > 0 && (
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3" /> {data.stars}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-2xl leading-tight tracking-tight">
        {data.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
        {data.description}
      </p>

      {data.topics.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {data.topics.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between pt-6">
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-cyan"
        >
          View details
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
        <div className="flex items-center gap-2">
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Open repository"
            className="glass rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          {data.homepage && (
            <a
              href={data.homepage}
              target="_blank"
              rel="noreferrer"
              aria-label="Open live site"
              className="glass rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
