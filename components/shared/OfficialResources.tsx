import { categorizeSources } from '@/lib/resources';

interface OfficialResourcesProps {
  sources: string[];
  githubRepo?: string;
}

export default function OfficialResources({ sources, githubRepo }: OfficialResourcesProps) {
  const categorized = categorizeSources(sources);
  const hasContent =
    categorized.documentation.length > 0 ||
    categorized.papers.length > 0 ||
    categorized.modelCards.length > 0 ||
    categorized.external.length > 0 ||
    !!githubRepo;

  if (!hasContent) return null;

  const linkClass =
    'inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline truncate max-w-full';

  return (
    <section className="rounded-lg border border-border bg-card p-4 space-y-3 select-none">
      <h2 className="text-sm font-semibold text-foreground">Official Resources</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {githubRepo && (
          <div>
            <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              GitHub
            </h3>
            <a href={githubRepo} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Repository
            </a>
          </div>
        )}
        {categorized.documentation.length > 0 && (
          <div>
            <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Documentation
            </h3>
            <ul className="space-y-1">
              {categorized.documentation.map(url => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {new URL(url).hostname}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {categorized.modelCards.length > 0 && (
          <div>
            <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Model Cards
            </h3>
            <ul className="space-y-1">
              {categorized.modelCards.map(url => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {url.split('/').slice(-2).join('/')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {categorized.papers.length > 0 && (
          <div>
            <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Papers
            </h3>
            <ul className="space-y-1">
              {categorized.papers.map(url => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Research paper
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {categorized.external.length > 0 && (
          <div>
            <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              External References
            </h3>
            <ul className="space-y-1">
              {categorized.external.map(url => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {new URL(url).hostname}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
