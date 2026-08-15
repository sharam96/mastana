export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="relative block h-9 w-9" aria-hidden>
          <span className="absolute inset-0 rounded-full border border-white/12" />
          <span className="absolute inset-0 animate-spin rounded-full border-t border-amber-500 [animation-duration:900ms]" />
        </span>
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-steel-500">Loading</p>
      </div>
    </div>
  );
}
