'use client';

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ScrollRestoreInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo) {
      const scrollY = parseInt(scrollTo, 10);
      if (!isNaN(scrollY) && scrollY > 0) {
        // Allow content to render before scrolling
        setTimeout(() => {
          window.scrollTo({ top: scrollY, behavior: 'instant' });
          
          // Clean up the URL by removing the scrollTo param
          const url = new URL(window.location.href);
          url.searchParams.delete('scrollTo');
          router.replace(url.pathname + url.search, { scroll: false });
        }, 150);
      }
    }
  }, [searchParams, router]);

  return null;
}

export function ScrollRestore() {
  return (
    <Suspense fallback={null}>
      <ScrollRestoreInner />
    </Suspense>
  );
}
