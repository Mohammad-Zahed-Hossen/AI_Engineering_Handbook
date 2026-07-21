'use client';

import { Suspense } from 'react';
import SearchBox from './SearchBox';
import type { SearchResult } from '@/lib/search-types';

interface SearchBoxWrapperProps {
  index?: SearchResult[];
  placeholder?: string;
  limit?: number;
  compact?: boolean;
}

export default function SearchBoxWrapper(props: SearchBoxWrapperProps) {
  return (
    <Suspense fallback={null}>
      <SearchBox {...props} />
    </Suspense>
  );
}
