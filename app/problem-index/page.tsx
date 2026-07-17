import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import { 
  getAllWorkflows, 
  getAllDecisionGuides,
  getPackageNavItems,
  getModelNavItems,
  getPatternNavItems,
  getDebugGuideNavItems,
  getRegistryNavItems
} from '@/lib/data';
import { Taxonomy } from '@/types/problem';
import ProblemIndexDashboard from './ProblemIndexDashboard';

const dataDir = path.join(process.cwd(), 'data');

function loadTaxonomy(): Taxonomy {
  const filePath = path.join(dataDir, 'problem-index', 'taxonomy.json');
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Taxonomy;
}

export default function ProblemIndexPage() {
  const taxonomy = loadTaxonomy();
  const workflows = getAllWorkflows();
  const decisionGuides = getAllDecisionGuides();

  // Pre-process workflow metadata on the server to pass lightweight representations to the client
  const workflowMap: Record<string, {
    id: string;
    title: string;
    description: string;
    type: string;
    difficulty?: string;
    duration?: number;
    tags: string[];
    confidence?: string;
    stability?: string;
    lifecycle?: string;
  }> = {};

  workflows.forEach(w => {
    workflowMap[w.id] = {
      id: w.id,
      title: w.name || w.title,
      description: w.overview || w.description,
      type: w.type,
      difficulty: w.difficulty,
      duration: w.estimated_reading_time,
      tags: w.tags || [],
      confidence: w.confidence,
      stability: w.stability,
      lifecycle: w.lifecycle,
    };
  });

  // Pre-process decision guide metadata on the server to pass lightweight representations to the client
  const decisionGuideMap: Record<string, {
    id: string;
    title: string;
    description: string;
    related_model_subcategory?: {
      category: string;
      subcategory: string;
    };
  }> = {};

  decisionGuides.forEach(dg => {
    decisionGuideMap[dg.id] = {
      id: dg.id,
      title: dg.title,
      description: dg.description,
      related_model_subcategory: dg.related_model_subcategory,
    };
  });

  // Gather other lookup lists to build cross-references on the client side
  const modelMap: Record<string, { name: string; category: string }> = {};
  (['ml', 'dl', 'llm'] as const).forEach(cat => {
    getModelNavItems(cat).forEach(item => {
      modelMap[item.id] = { name: item.name, category: cat };
    });
  });

  const patternMap: Record<string, string> = {};
  getPatternNavItems().forEach(item => {
    patternMap[item.id] = item.name;
  });

  const debugGuideMap: Record<string, string> = {};
  getDebugGuideNavItems().forEach(item => {
    debugGuideMap[item.id] = item.name;
  });

  const packageMap: Record<string, string> = {};
  getPackageNavItems().forEach(item => {
    packageMap[item.id] = item.name;
  });

  const registryMap: Record<string, string> = {};
  getRegistryNavItems().forEach(item => {
    registryMap[item.id] = item.name;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground border border-border p-5 rounded-lg shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
          Problem Index
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed font-sans">
          Browse engineering problems to find relevant workflows. Select a problem to see workflows that solve it.
        </p>
      </div>

      <Suspense fallback={
        <div className="rounded-xl border border-border bg-card p-8 text-center flex flex-col items-center justify-center py-12 select-none">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <p className="text-xs text-muted-foreground">Loading Problem Index...</p>
        </div>
      }>
        <ProblemIndexDashboard 
          taxonomy={taxonomy} 
          workflowMap={workflowMap}
          decisionGuideMap={decisionGuideMap}
          modelMap={modelMap}
          patternMap={patternMap}
          debugGuideMap={debugGuideMap}
          packageMap={packageMap}
          registryMap={registryMap}
        />
      </Suspense>
    </div>
  );
}
