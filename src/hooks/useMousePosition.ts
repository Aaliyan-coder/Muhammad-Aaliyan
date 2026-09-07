import { useEffect, useRef } from "react";

/**
 * Smoothly tracks mouse position normalised to [-1, 1] from the viewport center.
 * Used for parallax and 3D scene tilt.
 *
 * Returns a ref that callers read from inside their own animation loop. It
 * deliberately does not trigger React renders — driving a re-render at 60fps
 * re-reconciles the whole subtree for a value only used by an animation.
 */
export function useMousePosition(smoothing = 0.08) {
  const ref = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      const dx = target.current.x - ref.current.x;
      const dy = target.current.y - ref.current.y;
      ref.current.x += dx * smoothing;
      ref.current.y += dy * smoothing;
      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [smoothing]);

  return ref;
}
