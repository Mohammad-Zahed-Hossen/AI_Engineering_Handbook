'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="space-y-6 select-none max-w-md mx-auto mt-12">
      <div className="bg-card text-card-foreground border border-border p-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
          Page Not Found
        </h1>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          The requested URL <code className="font-mono text-indigo-500 bg-secondary/80 px-1 rounded text-[11px]">{pathname}</code> could not be found.
        </p>

        <div className="border-t border-border mt-4 pt-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
            Navigate to
          </span>
          <ul className="space-y-2 font-mono text-[11px]">
            <li>
              <Link href="/" className="text-indigo-500 hover:underline">
                &rarr; Dashboard
              </Link>
            </li>
            <li>
              <Link href="/" className="text-indigo-500 hover:underline">
                &rarr; Python Packages
              </Link>
            </li>
            <li>
              <Link href="/models/ml" className="text-indigo-500 hover:underline">
                &rarr; Models Library (ML)
              </Link>
            </li>
            <li>
              <Link href="/workflows/rag" className="text-indigo-500 hover:underline">
                &rarr; AI Workflows (RAG)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
