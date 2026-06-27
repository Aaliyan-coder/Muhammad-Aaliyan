import { useEffect, useRef } from "react";

/**
 * Magnetic hover effect — element gently follows the cursor when nearby.
 * Strength is the max pixel offset; radius is the activation distance.
 */
export function useMagnetic<T extends HTMLElement>(
  strength = 18,
  radius = 120,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const animate = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(
        2,
      )}px, 0)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const ex = r.left + r.width / 2;
      const ey = r.top + r.height / 2;
      const dx = e.clientX - ex;
      const dy = e.clientY - ey;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const f = 1 - dist / radius;
        tx = (dx / radius) * strength * f * 2;
        ty = (dy / radius) * strength * f * 2;
      } else {
        tx = 0;
        ty = 0;
      }
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [strength, radius]);

  return ref;
}
