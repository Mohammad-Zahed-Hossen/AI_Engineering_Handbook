'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Bookmark, Trash2 } from 'lucide-react';
import { getFavorites, removeFavorite, type FavoriteItem } from '@/lib/dashboard-state';
import ContentTypeBadge from './ContentTypeBadge';
import { formatTimeAgo } from '@/lib/format-time';
import { getContentTypeCardClasses } from '@/lib/content-type-meta';

export default function FavoritesWidget() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => getFavorites());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemove = (href: string) => {
    removeFavorite(href);
    setFavorites(prev => prev.filter(f => f.href !== href));
  };

  if (!isMounted) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20">
            <Star className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Favorites</h2>
            {favorites.length > 0 && (
              <p className="text-[9px] text-muted-foreground">{favorites.length} pinned items</p>
            )}
          </div>
        </div>
        {favorites.length > 0 && (
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded select-none">
            {favorites.length}
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center select-none">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 mb-2">
            <Bookmark className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            No favorites yet. Bookmark content you reference often to access it quickly here.
          </p>
        </div>
      ) : (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          {favorites.slice(0, 6).map((item) => (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`block rounded-lg border bg-card mobile-card-padding transition-all ${getContentTypeCardClasses(item.type)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-foreground truncate block">
                      {item.name}
                    </span>
                    <p className="text-[9px] font-mono text-muted-foreground flex items-center gap-1 mt-1">
                      <Star className="w-2.5 h-2.5 text-amber-500/70" />
                      Saved {formatTimeAgo(item.timestamp)}
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
                className="absolute top-1.5 right-1.5 p-1 rounded bg-background/80 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all cursor-pointer border border-transparent hover:border-red-500/30"
                aria-label={`Remove ${item.name} from favorites`}
              >
                <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}