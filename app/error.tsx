'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto mt-12">
      <div className="bg-card text-card-foreground border border-border p-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-foreground font-sans select-none">
          Something went wrong
        </h1>
        <p className="text-xs text-muted-foreground mt-2 select-none">
          An error occurred while loading this page. This might be due to a missing, corrupt, or invalid data file.
        </p>

        {/* Error message block */}
        <div className="mt-4 p-3 bg-secondary/60 border border-border/80 rounded font-mono text-[11px] text-destructive overflow-x-auto select-text">
          {error.message || 'Unknown error'}
        </div>

        <div className="border-t border-border mt-4 pt-4 flex items-center gap-4 select-none">
          <button
            onClick={() => reset()}
            className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-none cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="text-xs font-semibold text-indigo-500 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
