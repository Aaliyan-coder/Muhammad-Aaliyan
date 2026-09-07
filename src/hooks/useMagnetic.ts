import { useEffect, useRef } from "react";

/**
 * Magnetic hover effect — element gently follows the cursor when nearby.
 * Strength is the max pixel offset; radius is the activation distance.
 *
 * The animation loop only runs while the element is actually moving, and the
 * element's box is measured on scroll/resize rather than on every mousemove,
 * so an idle button costs nothing and a moving cursor costs no layout.
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let center: { x: number; y: number } | null = null;

    const measure = () => {
      const r = el.getBoundingClientRect();
      center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    const animate = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;

      // Settle and stop instead of spinning a rAF loop forever.
      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05) {
        cx = tx;
        cy = ty;
        el.style.transform =
          tx === 0 && ty === 0
            ? ""
            : `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      if (!center) measure();
      const dx = e.clientX - center!.x;
      const dy = e.clientY - center!.y;
      // Cheap reject before the sqrt.
      if (Math.abs(dx) > radius || Math.abs(dy) > radius) {
        if (tx !== 0 || ty !== 0) {
          tx = 0;
          ty = 0;
          start();
        }
        return;
      }
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const f = 1 - dist / radius;
        tx = (dx / radius) * strength * f * 2;
        ty = (dy / radius) * strength * f * 2;
      } else {
        tx = 0;
        ty = 0;
      }
      start();
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      start();
    };

    const invalidate = () => {
      center = null;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, [strength, radius]);

  return ref;
}
