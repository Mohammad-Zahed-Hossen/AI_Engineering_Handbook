'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import {
  addFavorite,
  removeFavorite,
  isFavorited,
  type ContentType,
} from '@/lib/dashboard-state';

interface FavoriteButtonProps {
  type: ContentType;
  id: string;
  name: string;
  href: string;
}

export default function FavoriteButton({ type, id, name, href }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(() => isFavorited(href));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    if (favorited) {
      removeFavorite(href);
    } else {
      addFavorite({ type, id, name, href });
    }
    setFavorited(!favorited);
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={handleClick}
      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
        favorited
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/20'
      }`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
    </button>
  );
}