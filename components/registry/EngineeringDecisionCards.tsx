'use client';

import { RegistryFamily } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';
import { Check, X, AlertTriangle, Star, ArrowRight } from 'lucide-react';

interface EngineeringDecisionCardsProps {
  family: RegistryFamily;
}

/**
 * Engineering Decision Cards component for Registry family pages.
 * Displays dense decision support: choose/avoid/watch-out/best-scenario/alternatives.
 */
export default function EngineeringDecisionCards({ family }: EngineeringDecisionCardsProps) {
  const decision = family.engineering_decision;
  
  if (!decision || (!decision.choose_if?.length && !decision.avoid_if?.length && !decision.watch_out_for?.length)) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-base md:text-lg font-semibold text-foreground">Engineering Decision</h2>
      
      <div className="grid gap-3">
        {/* Choose If */}
        {decision.choose_if && decision.choose_if.length > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 md:p-3">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Choose this if</span>
                <ul className="space-y-0.5">
                  {decision.choose_if.map((item, idx) => (
                    <li key={idx} className="text-xs text-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Avoid If */}
        {decision.avoid_if && decision.avoid_if.length > 0 && (
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4 md:p-3">
            <div className="flex items-start gap-2">
              <X className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Avoid this if</span>
                <ul className="space-y-0.5">
                  {decision.avoid_if.map((item, idx) => (
                    <li key={idx} className="text-xs text-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Watch Out For */}
        {decision.watch_out_for && decision.watch_out_for.length > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 md:p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Watch out for</span>
                <ul className="space-y-0.5">
                  {decision.watch_out_for.map((item, idx) => (
                    <li key={idx} className="text-xs text-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Best Deployment Scenario */}
        {decision.best_deployment_scenario && (
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4 md:p-3">
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Best deployment scenario</span>
                <p className="text-xs text-foreground">
                  {decision.best_deployment_scenario}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alternatives */}
        {decision.alternatives && decision.alternatives.length > 0 && (
          <div className="bg-muted/30 border border-border rounded-lg p-4 md:p-3">
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alternatives</span>
                <div className="flex flex-wrap items-center gap-1">
                  {decision.alternatives.map((alt, idx) => (
                    <RegistryBadge key={idx} variant="outline" size="xs" className="font-mono">
                      {alt}
                    </RegistryBadge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}