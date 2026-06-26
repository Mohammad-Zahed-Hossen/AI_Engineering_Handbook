import Link from 'next/link';
import { getAllCheatsheetIds, getCheatsheet } from '@/lib/data';

export default function CheatsheetsPage() {
  const cheatsheetIds = getAllCheatsheetIds();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Cheatsheets</h1>
      <div className="space-y-3">
        {cheatsheetIds.map(id => {
          const cs = getCheatsheet(id);
          return (
            <Link
              key={cs.id}
              href={`/cheatsheets/${cs.id}`}
              className="block rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
            >
              <h2 className="text-lg font-medium text-foreground">{cs.name}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
