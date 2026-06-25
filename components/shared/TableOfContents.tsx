interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length < 2) return null;

  return (
    <aside className="hidden xl:block w-48 shrink-0">
      <div className="sticky top-6 rounded-lg border border-border bg-card p-3 select-none">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </h2>
        <nav aria-label="Table of contents">
          <ul className="space-y-1.5">
            {items.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block text-[11px] text-muted-foreground hover:text-foreground leading-snug"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
