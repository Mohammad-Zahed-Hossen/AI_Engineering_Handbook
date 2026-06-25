import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-6 select-none max-w-md mx-auto mt-12">
      <div className="bg-card text-card-foreground border border-border p-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
          Page not found
        </h1>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          The page may have moved or the URL may be incorrect.
        </p>

        <div className="border-t border-border mt-4 pt-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
            Navigate to
          </span>
          <ul className="space-y-2 font-mono text-[11px]">
            <li>
              <Link href="/" className="text-foreground hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/packages/numpy" className="text-foreground hover:underline">
                Packages
              </Link>
            </li>
            <li>
              <Link href="/models/ml" className="text-foreground hover:underline">
                ML Models
              </Link>
            </li>
            <li>
              <Link href="/models/dl" className="text-foreground hover:underline">
                DL Models
              </Link>
            </li>
            <li>
              <Link href="/models/llm" className="text-foreground hover:underline">
                LLMs
              </Link>
            </li>
            <li>
              <Link href="/registry/embedding" className="text-foreground hover:underline">
                Registry
              </Link>
            </li>
            <li>
              <Link href="/workflows/rag" className="text-foreground hover:underline">
                Workflows
              </Link>
            </li>
            <li>
              <Link href="/cheatsheets/pytorch" className="text-foreground hover:underline">
                Cheatsheets
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
