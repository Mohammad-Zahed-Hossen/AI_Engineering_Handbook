'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { RegistryBadge } from './RegistryBadge';
import { Download, ExternalLink, Book, FileText, Package, Wrench, Zap, Shield, Cpu, Link2 } from 'lucide-react';
import { Reference, Download as DownloadType, RelatedResource } from '@/types/registry';

interface QuickLinksCardProps {
  downloads?: DownloadType[];
  references?: Reference[];
  relatedResources?: RelatedResource[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  official: <Shield className="h-3 w-3" />,
  documentation: <Book className="h-3 w-3" />,
  papers: <FileText className="h-3 w-3" />,
  benchmarks: <Zap className="h-3 w-3" />,
  deployment: <Wrench className="h-3 w-3" />,
  repositories: <Link2 className="h-3 w-3" />,
  fine_tuning: <Cpu className="h-3 w-3" />,
  leaderboards: <Zap className="h-3 w-3" />,
  tutorials: <Book className="h-3 w-3" />,
  community: <Link2 className="h-3 w-3" />,
};

const categoryLabels: Record<string, string> = {
  official: 'Official',
  documentation: 'Docs',
  papers: 'Paper',
  benchmarks: 'Benchmarks',
  deployment: 'Deploy',
  repositories: 'Repo',
  fine_tuning: 'Fine-tune',
  leaderboards: 'Leaderboard',
  tutorials: 'Tutorial',
  community: 'Community',
};

const resourceTypeIcons: Record<string, React.ReactNode> = {
  workflow: <Wrench className="h-3 w-3" />,
  pattern: <Zap className="h-3 w-3" />,
  package: <Package className="h-3 w-3" />,
  decision_guide: <Book className="h-3 w-3" />,
  debug_guide: <Shield className="h-3 w-3" />,
  principle: <Book className="h-3 w-3" />,
};

const resourceTypeLabels: Record<string, string> = {
  workflow: 'Workflow',
  pattern: 'Pattern',
  package: 'Package',
  decision_guide: 'Guide',
  debug_guide: 'Debug',
  principle: 'Principle',
};

const resourceTypePaths: Record<string, string> = {
  workflow: '/workflows',
  pattern: '/patterns',
  package: '/packages',
  decision_guide: '/decision-guides',
  debug_guide: '/debug-guides',
  principle: '/principles',
};

/**
 * Quick Links card for Registry variant pages.
 * Provides quick access to downloads, documentation, and related resources.
 */
export default function QuickLinksCard({ downloads, references, relatedResources }: QuickLinksCardProps) {
  const hasDownloads = downloads && downloads.length > 0;
  const hasReferences = references && references.length > 0;
  const hasRelatedResources = relatedResources && relatedResources.length > 0;

  if (!hasDownloads && !hasReferences && !hasRelatedResources) return null;

  // Sort references by priority
  const sortedReferences = hasReferences
    ? [...references!].sort((a, b) => (a.priority || 0) - (b.priority || 0))
    : [];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Quick Links</h2>

      <div className="grid gap-2">
        {/* Downloads Section */}
        {hasDownloads && (
          <Card className="p-0">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Download className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">
                  Downloads
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {downloads!.map((download, idx) => (
                  <a
                    key={idx}
                    href={download.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 group hover:bg-muted/30 -mx-1 px-1 py-0.5 rounded"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-foreground group-hover:underline">
                        {download.platform}
                      </span>
                      {download.official && (
                        <RegistryBadge variant="success" size="xs" className="font-mono">
                          Official
                        </RegistryBadge>
                      )}
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* References Section */}
        {hasReferences && (
          <Card className="p-0">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Book className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">
                  Documentation
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {sortedReferences.map((ref, idx) => (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 group hover:bg-muted/30 -mx-1 px-1 py-0.5 rounded"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs text-foreground group-hover:underline truncate">
                        {ref.title}
                      </span>
                      <RegistryBadge variant="outline" size="xs" className="font-mono shrink-0">
                        {categoryLabels[ref.category] || ref.category}
                      </RegistryBadge>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Resources Section */}
        {hasRelatedResources && (
          <Card className="p-0">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Wrench className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">
                  Related Resources
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {relatedResources!.map((resource, idx) => {
                  const href = `${resourceTypePaths[resource.resource_type]}/${resource.resource_slug}`;
                  return (
                    <Link
                      key={idx}
                      href={href}
                      className="flex items-center justify-between gap-2 group hover:bg-muted/30 -mx-1 px-1 py-0.5 rounded"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs text-foreground group-hover:underline truncate">
                          {resource.resource_slug.replace(/-/g, ' ')}
                        </span>
                        <RegistryBadge variant="secondary" size="xs" className="font-mono shrink-0">
                          {resourceTypeLabels[resource.resource_type] || resource.resource_type}
                        </RegistryBadge>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}