'use client';

import { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';
import { ScrollRestore } from './ScrollRestore';

interface PackagePageLayoutProps {
  breadcrumbs: Array<{ label: string; href?: string }>;
  children: ReactNode;
}

export default function PackagePageLayout({ breadcrumbs, children }: PackagePageLayoutProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <ScrollRestore />
      <div className="min-w-0 flex-1 w-full">
        <Breadcrumbs items={breadcrumbs} />
        <div className="space-y-4 sm:space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}