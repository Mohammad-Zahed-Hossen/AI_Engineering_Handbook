'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary border border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border border-border',
        outline: 'border border-border bg-background text-foreground',
        success: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400',
        warning: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400',
        destructive: 'bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400',
        info: 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 dark:text-indigo-400',
        muted: 'bg-muted text-muted-foreground border border-border',
      },
      size: {
        default: 'text-[10px] px-2 py-0.5',
        xs: 'text-[8px] px-1.5 py-0.25',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface RegistryBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export function RegistryBadge({
  className,
  variant,
  size,
  children,
  ...props
}: RegistryBadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </span>
  );
}

// Pre-defined badge variants for common use cases
export function ProviderBadge({ provider }: { provider: string }) {
  return (
    <RegistryBadge variant="info" className="font-semibold">
      {provider}
    </RegistryBadge>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const variants: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'muted'> = {
    production: 'success',
    experimental: 'warning',
    deprecated: 'destructive',
    research: 'default',
    legacy: 'muted',
  };
  return (
    <RegistryBadge variant={variants[status || 'default'] || 'default'} className="font-mono uppercase">
      {status || 'unknown'}
    </RegistryBadge>
  );
}

export function LicenseBadge({ license, commercial }: { license?: string; commercial?: boolean }) {
  return (
    <RegistryBadge variant={commercial ? 'success' : 'outline'} className="font-mono">
      {license || 'Unknown'}
    </RegistryBadge>
  );
}

export function RuntimeBadge({ runtime }: { runtime: string }) {
  return (
    <RegistryBadge variant="secondary" className="font-mono">
      {runtime}
    </RegistryBadge>
  );
}

export function QuantizationBadge({ quantization }: { quantization: string }) {
  return (
    <RegistryBadge variant="outline" className="font-mono">
      {quantization}
    </RegistryBadge>
  );
}

export function ContextBadge({ contextWindow }: { contextWindow?: number }) {
  if (!contextWindow) return null;
  const display = contextWindow >= 1000 ? `${contextWindow / 1000}K` : `${contextWindow}`;
  return (
    <RegistryBadge variant="muted" className="font-mono">
      {display}
    </RegistryBadge>
  );
}

export function CapabilityBadge({ capability }: { capability: string }) {
  const labels: Record<string, string> = {
    instruction_tuned: 'Instruction',
    reasoning: 'Reasoning',
    vision: 'Vision',
    multilingual: 'Multilingual',
    tool_calling: 'Tool Calling',
    function_calling: 'Function',
    thinking_model: 'Thinking',
  };
  return (
    <RegistryBadge variant="default" className="font-mono">
      {labels[capability] || capability}
    </RegistryBadge>
  );
}