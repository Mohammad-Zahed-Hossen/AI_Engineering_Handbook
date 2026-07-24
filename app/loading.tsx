import Image from 'next/image';

export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      role="status"
      className="fixed inset-0 z-50 flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#09090b] text-foreground"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(63,63,70,0.35),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_32%),linear-gradient(180deg,rgba(9,9,11,0.96),rgba(9,9,11,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] opacity-40" />

      <div className="relative flex w-full max-w-sm flex-col items-center px-6 text-center opacity-0 motion-safe:animate-[splash-fade-in_420ms_ease-out_120ms_forwards] motion-reduce:opacity-100 motion-reduce:animate-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-primary/10 blur-3xl motion-safe:animate-[splash-float_5s_ease-in-out_infinite] motion-reduce:animate-none" />
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <Image
              src="/AENS_LOGO.svg"
              alt="AENS"
              width={120}
              height={120}
              className="h-20 w-20 select-none sm:h-24 sm:w-24"
              draggable="false"
            />
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-[12rem] flex-col items-center gap-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <span className="relative block h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent motion-safe:animate-[splash-sweep_1.9s_ease-in-out_infinite] motion-reduce:animate-none" />
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-zinc-400">
            Initializing Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}