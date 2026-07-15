'use client';

import { useState, useMemo } from 'react';
import RegistryDashboardHeader from './RegistryDashboardHeader';
import RegistryFilterChips from './RegistryFilterChips';
import RegistryCard from './RegistryCard';
import { RegistryModel } from '@/lib/schemas/registry';

interface RegistryClientViewProps {
  models: RegistryModel[];
  taskLabel: string;
}

// Priority order for filter chips
const FILTER_PRIORITY: Record<string, number> = {
  'Commercial': 1,
  'Production': 2,
  'Open Weight': 3,
  'Instruction': 4,
  'Reasoning': 5,
  'Vision': 6,
  'Multilingual': 7,
  'Tool Calling': 8,
  'Local': 9,
  'Cloud': 10,
  'Embedding': 11,
};

export default function RegistryClientView({ models, taskLabel }: RegistryClientViewProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  // Generate available filters from data - Priority 1 #3: Sort by priority
  const availableFilters = useMemo(() => {
    const filters = new Set<string>();
    
    models.forEach((m) => {
      // Add capability-based filters
      if (m.capabilities?.instruction_tuned) filters.add('Instruction');
      if (m.capabilities?.reasoning) filters.add('Reasoning');
      if (m.capabilities?.vision) filters.add('Vision');
      if (m.capabilities?.multilingual) filters.add('Multilingual');
      if (m.capabilities?.tool_calling) filters.add('Tool Calling');
      
      // Add commercial/open weight filter
      if (m.license_info?.commercial_use) filters.add('Commercial');
      if (m.license_info?.commercial_use !== false) filters.add('Open Weight');
      
      // Add production filter
      if (m.engineering_snapshot?.production_ready) filters.add('Production');
      
      // Add deployment filters
      if (m.deployment?.cpu_supported) filters.add('Local');
      if (m.deployment?.gpu_supported) filters.add('Cloud');
      
      // Add task-based filter
      if (m.task === 'embedding') filters.add('Embedding');
    });

    // Sort filters by priority
    return Array.from(filters).sort((a, b) => {
      const priorityA = FILTER_PRIORITY[a] || 999;
      const priorityB = FILTER_PRIORITY[b] || 999;
      return priorityA - priorityB;
    });
  }, [models]);

  // Filter models based on active filter
  const filteredModels = useMemo(() => {
    if (activeFilter === 'All') return models;

    return models.filter((m) => {
      switch (activeFilter) {
        case 'Instruction':
          return m.capabilities?.instruction_tuned;
        case 'Reasoning':
          return m.capabilities?.reasoning;
        case 'Vision':
          return m.capabilities?.vision;
        case 'Multilingual':
          return m.capabilities?.multilingual;
        case 'Tool Calling':
          return m.capabilities?.tool_calling;
        case 'Commercial':
          return m.license_info?.commercial_use;
        case 'Open Weight':
          return m.license_info?.commercial_use !== false;
        case 'Production':
          return m.engineering_snapshot?.production_ready;
        case 'Local':
          return m.deployment?.cpu_supported;
        case 'Cloud':
          return m.deployment?.gpu_supported;
        case 'Embedding':
          return m.task === 'embedding';
        default:
          return true;
      }
    });
  }, [models, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <RegistryDashboardHeader models={models} taskLabel={taskLabel} />

      {/* Quick Filters */}
      {availableFilters.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Filters
          </div>
          <RegistryFilterChips
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            availableFilters={availableFilters}
          />
        </div>
      )}

      {/* Registry Cards Grid */}
      {filteredModels.length === 0 ? (
        // Priority 2 #6: Improved empty state messaging
        <div className="p-8 text-center text-xs text-muted-foreground select-none space-y-2">
          <div>No registry entries match the selected filter.</div>
          {activeFilter !== 'All' && (
            <button
              onClick={() => setActiveFilter('All')}
              className="text-[10px] text-primary hover:underline font-medium"
            >
              Clear filter: {activeFilter}
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredModels.map((m) => (
            <RegistryCard key={m.id} model={m} />
          ))}
        </div>
      )}
    </div>
  );
}