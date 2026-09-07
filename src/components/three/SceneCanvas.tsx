"use client";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Device tier, resolved once. Low-tier machines get fewer particles, lower DPR
 * and no post-processing — the difference between 60fps and a slideshow.
 */
export type Tier = "off" | "low" | "high";

let cachedTier: Tier | null = null;

export function getTier(): Tier {
  if (cachedTier) return cachedTier;
  if (typeof window === "undefined") return "high";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return (cachedTier = "off");

  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;

  // Phones, low-core or low-memory machines render the cheap variant.
  cachedTier = cores <= 4 || mem <= 4 || coarse || narrow ? "low" : "high";
  return cachedTier;
}

/**
 * Resolves the device tier on the client. Returns null on the first render (and
 * during SSR) so a scene never briefly mounts at high settings on a phone and
 * then has to tear the work back down.
 */
export function useTier(): Tier | null {
  const [tier, setTier] = useState<Tier | null>(null);
  useEffect(() => setTier(getTier()), []);
  return tier;
}

/**
 * Renders a react-three-fiber Canvas that only exists — and only renders —
 * while it is near the viewport and the tab is visible.
 *
 * Three things happen here, and each one matters:
 *  1. The Canvas is not mounted at all until the container scrolls within
 *     `rootMargin` of the viewport, so no WebGL context is created up front.
 *  2. Once mounted it stays mounted (contexts are expensive to recreate), but
 *     `frameloop` flips to "never" the moment it leaves the viewport, which
 *     stops the render loop dead instead of burning the GPU off-screen.
 *  3. Backgrounding the tab pauses every scene at once.
 */
export function SceneCanvas({
  children,
  fallback = null,
  rootMargin = "250px",
  ...canvasProps
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
} & Omit<CanvasProps, "children" | "frameloop">) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabActive, setTabActive] = useState(true);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setMounted(true);
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    const onVis = () => setTabActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {mounted ? (
        <Canvas
          frameloop={visible && tabActive ? "always" : "never"}
          style={{ position: "absolute", inset: 0 }}
          {...canvasProps}
        >
          {children}
        </Canvas>
      ) : (
        fallback
      )}
    </div>
  );
}
