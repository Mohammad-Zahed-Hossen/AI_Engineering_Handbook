'use client';

import { FileText, Video, GraduationCap, BookOpen, Globe, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ResourceType = 'article' | 'video' | 'course' | 'guide' | 'documentation' | 'tutorial';

export interface LearningResource {
  title: string;
  url: string;
  type: ResourceType;
  why_to_read: string;
  expected_outcome: string;
  reading_time?: number;
}

interface LearningResourcesProps {
  resources?: LearningResource[];
}

const typeConfig = {
  article: {
    icon: FileText,
    label: 'Article',
    colorClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 dark:bg-blue-900/30 dark:border-blue-500/30',
  },
  video: {
    icon: Video,
    label: 'Video',
    colorClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 dark:bg-rose-900/30 dark:border-rose-500/30',
  },
  course: {
    icon: GraduationCap,
    label: 'Course',
    colorClass: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 dark:bg-indigo-900/30 dark:border-indigo-500/30',
  },
  guide: {
    icon: BookOpen,
    label: 'Guide',
    colorClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:bg-emerald-900/30 dark:border-emerald-500/30',
  },
  documentation: {
    icon: Globe,
    label: 'Docs',
    colorClass: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20 dark:bg-teal-900/30 dark:border-teal-500/30',
  },
  tutorial: {
    icon: BookOpen,
    label: 'Tutorial',
    colorClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 dark:bg-purple-900/30 dark:border-purple-500/30',
  },
} as const;

function getDomainName(urlString: string): string {
  try {
    const url = new URL(urlString);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'External Resource';
  }
}

export default function LearningResources({ resources }: LearningResourcesProps) {
  if (!resources || resources.length === 0) return null;

  return (
    <section id="learning-resources" className="scroll-mt-24 space-y-4">
      <div className="border-b border-border pb-3">
        <h2 className="text-base font-bold text-foreground font-sans m-0 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Curated Learning Resources
        </h2>
        <p className="text-xs text-muted-foreground mt-1 font-sans">
          Hand-picked educational references and guides chosen for their technical depth and clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => {
          const config = typeConfig[resource.type] || typeConfig.article;
          const IconComponent = config.icon;
          const domain = getDomainName(resource.url);

          return (
            <div
              key={resource.url}
              className={cn(
                "rounded-xl border border-border bg-card/40 p-4.5 transition-all duration-300",
                "hover:border-primary/30 hover:bg-card/80 hover:shadow-md hover:-translate-y-0.5",
                "flex flex-col justify-between group relative overflow-hidden"
              )}
            >
              {/* Card content */}
              <div className="space-y-3 font-sans">
                {/* Header: Resource Type & Reading Time */}
                <div className="flex items-center justify-between text-[10px] font-medium">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold",
                      config.colorClass
                    )}
                  >
                    <IconComponent className="w-3 h-3" />
                    {config.label}
                  </span>

                  {resource.reading_time && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {resource.reading_time} min read
                    </span>
                  )}
                </div>

                {/* Title and Source */}
                <div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1 text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug cursor-pointer"
                  >
                    <span>{resource.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <span className="block text-[10px] font-mono text-muted-foreground/80 mt-0.5">
                    Source: {domain}
                  </span>
                </div>

                {/* Rationale/Why to read */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {resource.why_to_read}
                </p>
              </div>

              {/* expected learning outcome panel */}
              <div className="mt-4 border-t border-border/50 pt-3">
                <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40 text-[11px] leading-relaxed text-muted-foreground font-sans">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                    Expected Outcome
                  </span>
                  {resource.expected_outcome}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
