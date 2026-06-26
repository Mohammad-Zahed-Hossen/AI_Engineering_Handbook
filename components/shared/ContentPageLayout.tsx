import { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';
import MobileTOC from './MobileTOC';
import TableOfContents from './TableOfContents';

interface ContentPageLayoutProps {
  breadcrumbs: Array<{ label: string; href?: string }>;
  toc?: Array<{ id: string; label: string }>;
  children: ReactNode;
}

export default function ContentPageLayout({ breadcrumbs, toc, children }: ContentPageLayoutProps) {
  return (
    <div className="flex gap-8 items-start">
      <div className="min-w-0 flex-1 space-y-8">
        <Breadcrumbs items={breadcrumbs} />
        {toc && toc.length >= 2 && <MobileTOC items={toc} />}
        <div className="space-y-8">
          {children}
        </div>
      </div>
      {toc && <TableOfContents items={toc} />}
    </div>
  );
}
