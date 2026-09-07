"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a soft glow dot + delayed outline ring.
 * Hides on touch devices via CSS. Outline scales up on interactive elements.
 *
 * The trailing loop stops once the ring catches up to the pointer, so an idle
 * cursor does not hold a requestAnimationFrame open for the life of the page.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let lastTarget: Element | null = null;

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      }
      if (Math.abs(mx - rx) < 0.3 && Math.abs(my - ry) < 0.3) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t === lastTarget) return;
      lastTarget = t;
      const interactive = !!t?.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='hover']",
      );
      if (ring.current) {
        ring.current.dataset.hover = interactive ? "true" : "false";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-cyan"
        style={{ boxShadow: "0 0 16px var(--cyan), 0 0 32px var(--cyan)" }}
      />
      <div
        ref={ring}
        aria-hidden
        data-hover="false"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border border-white/40 transition-[width,height,opacity,border-color] duration-200 data-[hover=true]:h-14 data-[hover=true]:w-14 data-[hover=true]:-translate-x-2.5 data-[hover=true]:-translate-y-2.5 data-[hover=true]:border-cyan/80"
      />
    </>
  );
}
