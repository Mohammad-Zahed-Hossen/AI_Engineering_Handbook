import { ModelStatus } from '@/types/registry';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ModelStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20',
    experimental: 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20',
    deprecated: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border uppercase tracking-wider font-sans select-none",
        styles[status] || 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
      )}
    >
      {status}
    </span>
  );
}
