import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const cb = (e: MediaQueryListEvent) => setReduce(e.matches);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  }, []);
  return reduce;
}

export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(pointer: coarse)");
    setTouch(m.matches);
    const cb = (e: MediaQueryListEvent) => setTouch(e.matches);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  }, []);
  return touch;
}
