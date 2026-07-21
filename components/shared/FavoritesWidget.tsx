'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, X, ExternalLink } from 'lucide-react';
import { getFavorites, removeFavorite, type FavoriteItem } from '@/lib/dashboard-state';
import ContentTypeBadge from './ContentTypeBadge';
import { formatTimeAgo } from '@/lib/format-time';

export default function FavoritesWidget() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => getFavorites());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleRemove = (href: string) => {
    removeFavorite(href);
    setFavorites(prev => prev.filter(f => f.href !== href));
  };

  if (!isMounted) return null;
  if (favorites.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <Star className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Favorites</h2>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground select-none">
          {favorites.length} pinned
        </span>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {favorites.slice(0, 6).map((item) => (
          <div key={item.href} className="relative group">
            <Link
              href={item.href}
              className="block rounded-lg border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:bg-muted/30 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-foreground truncate block">
                    {item.name}
                  </span>
                  <p className="text-[9px] font-mono text-muted-foreground flex items-center gap-1 mt-1">
                    <ExternalLink className="w-3 h-3" />
                    {formatTimeAgo(item.timestamp)}
                  </p>
                </div>
                <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px] shrink-0" />
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleRemove(item.href);
              }}
              className="absolute top-1.5 right-1.5 p-1 rounded bg-transparent opacity-0 group-hover:opacity-100 hover:bg-muted/50 transition-all cursor-pointer"
              aria-label={`Remove ${item.name} from favorites`}
            >
              <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}