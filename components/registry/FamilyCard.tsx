'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RegistryBadge } from './RegistryBadge';
import { RegistryFamily } from '@/types/registry';

interface FamilyCardProps {
  family: RegistryFamily;
}

/**
 * Card component for displaying a model family in the registry grid.
 * Shows family name, provider, description, variant count, and production status.
 */
export default function FamilyCard({ family }: FamilyCardProps) {
  return (
    <Link
      href={`/registry/families/${family.id}`}
      className="block"
    >
      <Card className="hover:border-foreground/20 hover:bg-muted/30 transition-colors cursor-pointer h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono flex items-center justify-between">
            <span>{family.name}</span>
            <RegistryBadge variant="info" size="xs" className="font-mono">
              {family.provider}
            </RegistryBadge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <p className="text-[10px] text-muted-foreground line-clamp-2">
            {family.description}
          </p>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-muted-foreground">Variants:</span>
            <span className="font-mono text-foreground">{family.variants.length}</span>
            {family.engineering_snapshot?.production_ready && (
              <span className="text-emerald-600">●</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}