'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Lightbulb } from 'lucide-react';
import ContentTypeBadge from './ContentTypeBadge';
import { getContentTypeCardClasses } from '@/lib/content-type-meta';
import { getHistory, getFavorites } from '@/lib/dashboard-state';

// Verified content IDs only — must exist as JSON files on disk.
const KNOWN_ITEMS: Record<string, { type: string; name: string; href: string }> = {
  'pytorch':           { type: 'package',       name: 'PyTorch',             href: '/packages/pytorch' },
  'numpy':             { type: 'package',       name: 'NumPy',               href: '/packages/numpy' },
  'pandas':            { type: 'package',       name: 'Pandas',              href: '/packages/pandas' },
  'matplotlib':        { type: 'package',       name: 'Matplotlib',          href: '/packages/matplotlib' },
  'scikit-learn':      { type: 'package',       name: 'scikit-learn',        href: '/packages/scikit-learn' },
  'build-rag-system':  { type: 'workflow',      name: 'Build RAG System',    href: '/workflows/build-rag-system' },
  'transformer':       { type: 'model',         name: 'Transformer',         href: '/models/dl/transformer' },
  'training-loop':     { type: 'pattern',       name: 'Training Loop',       href: '/patterns/training-loop' },
  'lora-vs-qlora':     { type: 'decision_guide',name: 'LoRA vs QLoRA',       href: '/decision-guides/lora-vs-qlora' },
};

// Source ID → recommended content IDs. All keys/values must exist in KNOWN_ITEMS.
const RECOMMENDATION_MAP: Record<string, string[]> = {
  'pytorch':           ['numpy', 'pandas', 'matplotlib', 'scikit-learn', 'training-loop'],
  'numpy':             ['pandas', 'matplotlib'],
  'pandas':            ['numpy', 'matplotlib', 'scikit-learn'],
  'scikit-learn':      ['xgboost'],
  'transformer':       ['training-loop'],
  'build-rag-system':  ['lora-vs-qlora', 'training-loop'],
  'lora-vs-qlora':     ['build-rag-system', 'training-loop'],
};

// Cold-start fallbacks
const DEFAULT_RECOMMENDATIONS: Array<{ id: string; type: string; name: string; href: string }> = [
  { id: 'pytorch', type: 'package', name: 'PyTorch', href: '/packages/pytorch' },
  { id: 'transformer', type: 'model', name: 'Transformer', href: '/models/dl/transformer' },
  { id: 'build-rag-system', type: 'workflow', name: 'Build RAG System', href: '/workflows/build-rag-system' },
  { id: 'lora-vs-qlora', type: 'decision_guide', name: 'LoRA vs QLoRA', href: '/decision-guides/lora-vs-qlora' },
];

interface RecItem {
  id: string;
  type: string;
  name: string;
  href: string;
  score: number;
}

export default function RecommendationsWidget() {
  const [recommendations, setRecommendations] = useState<RecItem[]>([]);
  const [hasHistory, setHasHistory] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const history = getHistory();
    const favorites = getFavorites();
    const nextHasHistory = history.length > 0;

    const visitedHrefs = new Set(history.map(h => h.href));
    const favoriteHrefs = new Set(favorites.map(f => f.href));
    const candidates: RecItem[] = [];

    // 1. Walk recent history to find personalized recommendations
    const seen = new Set<string>();
    for (const item of history) {
      const segments = item.href.split('/').filter(Boolean);
      const sourceId = segments[segments.length - 1];
      const relatedIds = RECOMMENDATION_MAP[sourceId];
      if (!relatedIds || relatedIds.length === 0) continue;

      for (const recId of relatedIds) {
        if (seen.has(recId)) continue;
        const known = KNOWN_ITEMS[recId];
        if (!known) continue;
        if (visitedHrefs.has(known.href)) continue;
        seen.add(recId);
        candidates.push({
          id: recId,
          type: known.type,
          name: known.name,
          href: known.href,
          score: 100,
        });
      }
    }

    // 2. Supplement defaults for cold-start / sparse history
    if (candidates.length < 2) {
      for (const def of DEFAULT_RECOMMENDATIONS) {
        if (visitedHrefs.has(def.href)) continue;
        if (seen.has(def.id)) continue;
        seen.add(def.id);
        candidates.push({ ...def, score: 10 });
      }
    }

    // 3. Rank: relation strength → unfavorited preferred → alphabetical
    const ranked = candidates
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aFav = favoriteHrefs.has(a.href) ? 1 : 0;
        const bFav = favoriteHrefs.has(b.href) ? 1 : 0;
        if (aFav !== bFav) return aFav - bFav;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 4);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecommendations(ranked);
    setHasHistory(nextHasHistory);
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <div className="p-1 rounded bg-purple-500/10 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Recommended for You</h2>
            {recommendations.length > 0 && (
              <p className="text-[9px] font-mono text-muted-foreground">
                {hasHistory ? 'Based on your recent activity' : 'Getting started picks'}
              </p>
            )}
          </div>
        </div>
        {recommendations.length > 0 && (
          <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded select-none">
            {recommendations.length} picks
          </span>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center select-none">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 mb-2">
            <Lightbulb className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Recommendations will appear here as you explore more content.
          </p>
        </div>
      ) : (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          {recommendations.map((item) => (
            <Link
              key={item.id}
              href={item.href || '#'}
              className={`block rounded-lg border bg-card mobile-card-padding transition-all group ${getContentTypeCardClasses(item.type)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-foreground truncate block group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                  <p className="text-[9px] font-mono text-muted-foreground flex items-center gap-1 mt-1">
                    <Sparkles className="w-2.5 h-2.5 text-purple-500/70" />
                    Recommended for you
                  </p>
                </div>
                <ContentTypeBadge type={item.type as 'package' | 'model' | 'workflow' | 'cheatsheet' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle' | 'registry'} className="px-1.5 py-0 text-[8px] shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}