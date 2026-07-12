'use client';

import { useState } from 'react';
import { categorizeSources, parseResourceUrl, toTitleCase } from '@/lib/resources';
import { 
  FileText, 
  BookOpen, 
  ExternalLink, 
  Globe,
  Link2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface OfficialResourcesProps {
  sources: Array<string | { title: string; url: string }>;
  githubRepo?: string;
  /** When a dedicated Learning Resources section already exists for this content,
   *  suppress the generic "Further Reading" fallback bucket here so the same kind
   *  of link doesn't appear twice on the page with two different levels of context. */
  hasLearningResources?: boolean;
}

interface ResourceCategoryProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  urls: string[];
  category: string;
  sources: Array<string | { title: string; url: string }>;
}

function ResourceCategory({ icon, iconBg, title, urls, category, sources }: ResourceCategoryProps) {
  const [expanded, setExpanded] = useState(false);
  const showMore = urls.length > 3;
  const visibleUrls = expanded ? urls : urls.slice(0, 3);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors">
      <div className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 font-sans">
          {title}
        </h3>
        <ul className="space-y-1.5">
          {visibleUrls.map((url, urlIdx) => {
            const matchObj = sources.find(s => typeof s === 'string' ? s === url : s.url === url);
            const customTitle = matchObj && typeof matchObj !== 'string' ? matchObj.title : undefined;
            const info = parseResourceUrl(url, category);
            const resourceId = `resource-${category}-${urlIdx}`;
            return (
              <li key={url} id={resourceId}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group block font-sans"
                >
                  <div className="flex items-center gap-2 text-xs text-foreground hover:text-primary transition-colors">
                    <span className="truncate font-medium">{customTitle || info.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {info.subtitle && !customTitle && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {info.subtitle}
                    </div>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
        {showMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-sans cursor-pointer"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                See more ({urls.length - 3})
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OfficialResources({ sources, githubRepo, hasLearningResources = false }: OfficialResourcesProps) {
  const sourceUrls = sources.map(s => typeof s === 'string' ? s : s.url);
  const categorized = categorizeSources(sourceUrls);
  // If a dedicated Learning Resources section is already rendering curated educational
  // content elsewhere on the page, don't also surface the generic "external" bucket here —
  // that would show the same kind of link twice, once with rich context (why to read,
  // expected outcome) and once without. Fall back to showing it only for models that
  // haven't been migrated to `learning_resources` yet, so nothing is silently lost.
  const showExternal = categorized.external.length > 0 && !hasLearningResources;
  const hasContent =
    categorized.documentation.length > 0 ||
    categorized.papers.length > 0 ||
    categorized.modelCards.length > 0 ||
    showExternal ||
    !!githubRepo;

  if (!hasContent) return null;

  return (
    <section className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 font-sans">
          <BookOpen className="w-4 h-4 text-primary" />
          Further Study
        </h2>
      </div>
      
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* GitHub */}
        {githubRepo && (() => {
          const info = parseResourceUrl(githubRepo, 'external');
          return (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Link2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 font-sans">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Source Code
                </h3>
                <a 
                  href={githubRepo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group block"
                >
                  <div className="flex items-center gap-2 text-xs text-foreground hover:text-primary transition-colors">
                    <span className="truncate font-medium">{info.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {info.subtitle && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {info.subtitle}
                    </div>
                  )}
                </a>
              </div>
            </div>
          );
        })()}

        {/* Documentation */}
        {categorized.documentation.length > 0 && (
          <ResourceCategory
            icon={<FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            iconBg="bg-blue-500/10"
            title="Documentation"
            urls={categorized.documentation}
            category="documentation"
            sources={sources}
          />
        )}

        {/* Model Cards */}
        {categorized.modelCards.length > 0 && (
          <ResourceCategory
            icon={<BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
            iconBg="bg-purple-500/10"
            title="Model Cards"
            urls={categorized.modelCards}
            category="modelCards"
            sources={sources}
          />
        )}

        {/* Papers */}
        {categorized.papers.length > 0 && (
          <ResourceCategory
            icon={<FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            iconBg="bg-amber-500/10"
            title="Research Papers"
            urls={categorized.papers}
            category="papers"
            sources={sources}
          />
        )}

        {/* Further Reading (fallback only — suppressed when Learning Resources exists) */}
        {showExternal && (
          <ResourceCategory
            icon={<Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            iconBg="bg-indigo-500/10"
            title="Further Reading"
            urls={categorized.external}
            category="external"
            sources={sources}
          />
        )}
      </div>
    </section>
  );
}