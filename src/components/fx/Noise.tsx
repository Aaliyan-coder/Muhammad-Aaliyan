export function Noise() {
  return (
    <div
      aria-hidden
      className="noise-overlay pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
    />
  );
}

export function GradientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-cyan/10 blur-[140px]" />
      <div className="absolute bottom-[-20vh] right-[-10vw] h-[50vh] w-[60vw] rounded-full bg-accent/10 blur-[140px]" />
      <div className="absolute left-[-10vw] top-[40vh] h-[40vh] w-[40vw] rounded-full bg-primary/10 blur-[120px]" />
    </div>
  );
}
