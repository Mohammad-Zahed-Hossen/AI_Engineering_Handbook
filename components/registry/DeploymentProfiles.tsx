'use client';

import { DeploymentProfile } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DeploymentProfilesProps {
  profiles: DeploymentProfile[];
}

/**
 * Deployment Profiles component for Registry family pages.
 * Displays hardware-class-based variant selection guidance.
 */
export default function DeploymentProfiles({ profiles }: DeploymentProfilesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full md:hidden"
      >
        <h2 className="text-base font-semibold text-foreground">Deployment Profiles</h2>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <h2 className="hidden md:block text-base md:text-lg font-semibold text-foreground">Deployment Profiles</h2>
      
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="grid gap-3">
          {profiles.map((profile, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4 md:p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    {profile.profile}
                  </span>
                  <RegistryBadge variant="info" size="xs" className="font-mono">
                    {profile.recommended_variant}
                  </RegistryBadge>
                </div>
                {profile.expected_experience && (
                  <p className="text-xs text-muted-foreground">
                    {profile.expected_experience}
                  </p>
                )}
                {profile.notes && (
                  <p className="text-xs text-muted-foreground">
                    {profile.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}