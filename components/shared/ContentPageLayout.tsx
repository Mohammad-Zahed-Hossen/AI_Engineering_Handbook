import { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';
import TableOfContents from './TableOfContents';

interface ContentPageLayoutProps {
  breadcrumbs: Array<{ label: string; href?: string }>;
  toc?: Array<{ id: string; label: string }>;
  children: ReactNode;
}

export default function ContentPageLayout({ breadcrumbs, toc, children }: ContentPageLayoutProps) {
  return (
    <div className="flex gap-8 items-start">
      <div className="min-w-0 flex-1 space-y-6">
        <Breadcrumbs items={breadcrumbs} />
        {children}
      </div>
      {toc && <TableOfContents items={toc} />}
    </div>
  );
}
