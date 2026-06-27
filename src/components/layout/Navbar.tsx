"use client";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 transition-all duration-500",
        scrolled && "pt-3",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "glass flex items-center gap-1 rounded-full px-2 py-2 transition-all duration-500",
          scrolled ? "scale-[0.98] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]" : "",
        )}
      >
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]"
          />
          Aaliyan<span className="text-muted-foreground">.dev</span>
        </Link>
        <ul className="hidden items-center md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="ml-1 hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:inline-flex"
        >
          Let's talk
        </a>
      </nav>
    </header>
  );
}
