'use client';

import { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';
import TableOfContents, { useActiveSection } from './TableOfContents';
import StickyActionBar from './StickyActionBar';
import { ScrollRestore } from './ScrollRestore';

interface ContentPageLayoutProps {
  breadcrumbs: Array<{ label: string; href?: string }>;
  toc?: Array<{ id: string; label: string }>;
  children: ReactNode;
}

export default function ContentPageLayout({ breadcrumbs, toc, children }: ContentPageLayoutProps) {
  const activeId = useActiveSection(toc || []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      <ScrollRestore />
      <div className="min-w-0 flex-1 space-y-8 w-full">
        <Breadcrumbs items={breadcrumbs} />
        {toc && <TableOfContents items={toc} variant="horizontal" activeId={activeId} />}
        <div className="space-y-8">
          {children}
        </div>
      </div>
      {toc && <TableOfContents items={toc} variant="sidebar" activeId={activeId} />}
      <StickyActionBar tocItems={toc} />
    </div>
  );
}
