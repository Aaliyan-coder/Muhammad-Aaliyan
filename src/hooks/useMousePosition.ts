import { useEffect, useRef, useState } from "react";

/**
 * Smoothly tracks mouse position normalised to [-1, 1] from the viewport center.
 * Used for parallax and 3D scene tilt.
 */
export function useMousePosition(smoothing = 0.08) {
  const ref = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [, setTick] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const loop = () => {
      ref.current.x += (target.current.x - ref.current.x) * smoothing;
      ref.current.y += (target.current.y - ref.current.y) * smoothing;
      setTick((t) => (t + 1) % 1_000_000);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [smoothing]);

  return ref;
}
