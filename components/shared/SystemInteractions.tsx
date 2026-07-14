import { cn } from '@/lib/utils';

interface SystemInteraction {
  interacts_with: string;
  condition: string;
  effect: string;
}

interface SystemInteractionsProps {
  interactions?: SystemInteraction[];
  className?: string;
}

export default function SystemInteractions({ interactions = [], className }: SystemInteractionsProps) {
  if (interactions.length === 0) {
    return null;
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left font-semibold text-foreground px-4 py-2.5 uppercase tracking-wider">
              Interacts With
            </th>
            <th className="text-left font-semibold text-foreground px-4 py-2.5 uppercase tracking-wider">
              Condition
            </th>
            <th className="text-left font-semibold text-foreground px-4 py-2.5 uppercase tracking-wider">
              Effect
            </th>
          </tr>
        </thead>
        <tbody>
          {interactions.map((interaction, idx) => (
            <tr key={idx} className="border-b border-border last:border-b-0">
              <td className="px-4 py-2.5 text-muted-foreground font-medium">
                {interaction.interacts_with}
              </td>
              <td className="px-4 py-2.5 text-foreground">
                {interaction.condition}
              </td>
              <td className="px-4 py-2.5 text-foreground">
                {interaction.effect}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
