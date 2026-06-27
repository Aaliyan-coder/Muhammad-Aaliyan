import { profile } from "@/lib/data/profile";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/fx/BrandIcons";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-lg tracking-tight">
            {profile.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            © {new Date().getFullYear()} — Crafted with intent. {profile.location}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="glass rounded-full p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="glass rounded-full p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="glass rounded-full p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
