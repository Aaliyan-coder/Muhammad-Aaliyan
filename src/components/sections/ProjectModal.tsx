"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { GithubIcon } from "@/components/fx/BrandIcons";
import type { ProjectCardData } from "./ProjectCard";

export function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectCardData | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} details`}
        >
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="glass absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {project.language && <span>{project.language}</span>}
              {project.stars > 0 && <span>· ★ {project.stars}</span>}
              {project.featured && <span className="text-cyan">· Featured</span>}
            </div>
            <h3 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              {project.title}
            </h3>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {project.description}
            </p>

            {project.topics.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Tech
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {project.topics.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <GithubIcon className="h-4 w-4" />
                View repository
              </a>
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live demo
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
