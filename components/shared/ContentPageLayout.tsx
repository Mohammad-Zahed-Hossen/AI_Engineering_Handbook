'use client';

import { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';
import TableOfContents from './TableOfContents';
import StickyActionBar from './StickyActionBar';
import { ScrollRestore } from './ScrollRestore';

interface ContentPageLayoutProps {
  breadcrumbs: Array<{ label: string; href?: string }>;
  toc?: Array<{ id: string; label: string }>;
  children: ReactNode;
}

export default function ContentPageLayout({ breadcrumbs, toc, children }: ContentPageLayoutProps) {
  return (
    <div className="flex gap-8 items-start">
      <ScrollRestore />
      <div className="min-w-0 flex-1 space-y-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="space-y-8">
          {children}
        </div>
      </div>
      {toc && <TableOfContents items={toc} />}
      <StickyActionBar tocItems={toc} />
    </div>
  );
}
