import { getAllCheatsheets } from '@/lib/data';
import CheatsheetListClient from './CheatsheetListClient';

export default function CheatsheetsPage() {
  const cheatsheets = getAllCheatsheets();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Cheatsheets</h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Quick reference guides for AI engineering libraries and frameworks.
          Search, filter, and explore syntax patterns, common problems, and solutions.
        </p>
      </div>
      <CheatsheetListClient cheatsheets={cheatsheets} />
    </div>
  );
}