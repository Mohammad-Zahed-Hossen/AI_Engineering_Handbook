'use client';

import { DeploymentProfile } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';

interface DeploymentProfilesProps {
  profiles: DeploymentProfile[];
}

/**
 * Deployment Profiles component for Registry family pages.
 * Displays hardware-class-based variant selection guidance.
 */
export default function DeploymentProfiles({ profiles }: DeploymentProfilesProps) {
  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Deployment Profiles</h2>
      <div className="grid gap-3">
        {profiles.map((profile, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-3">
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
  );
}