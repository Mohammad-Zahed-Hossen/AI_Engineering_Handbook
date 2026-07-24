import { notFound } from 'next/navigation';
import { getAllRegistryFamilyIds, getRegistryFamily, getRegistryVariantsByFamily } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import VariantCard from '@/components/registry/VariantCard';
import VariantComparisonTable from '@/components/registry/VariantComparisonTable';
import EngineeringDecisionCards from '@/components/registry/EngineeringDecisionCards';
import PerformanceDimensions from '@/components/registry/PerformanceDimensions';
import DeploymentProfiles from '@/components/registry/DeploymentProfiles';
import RuntimeDecisionCard from '@/components/registry/RuntimeDecisionCard';
import EngineeringContinuation from '@/components/registry/EngineeringContinuation';
import QuickLinksCard from '@/components/registry/QuickLinksCard';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import FavoriteButton from '@/components/shared/FavoriteButton';
import { getCanonicalRelationshipsForEntity, resolveGraphNodes, shouldRenderKnowledgeGraph } from '@/lib/data';
import KnowledgeGraphPanel from '@/components/shared/KnowledgeGraphPanel';

/**
 * Pre-generates family params for static rendering.
 */
export async function generateStaticParams() {
  return getAllRegistryFamilyIds().map((family) => ({ family }));
}

interface PageProps {
  params: Promise<{ family: string }>;
}

export default async function RegistryFamilyPage({ params }: PageProps) {
  const { family } = await params;

  let familyData;
  try {
    familyData = getRegistryFamily(family);
  } catch {
    notFound();
  }

  const variants = getRegistryVariantsByFamily(family);

  const toc = [
    { id: 'family-header', label: familyData.name },
    { id: 'decisions', label: 'Engineering Decisions' },
    ...(familyData.engineering_decision?.performance_dimensions ? [{ id: 'performance', label: 'Performance Dimensions' }] : []),
    ...(familyData.engineering_decision?.deployment_profiles ? [{ id: 'deployment', label: 'Deployment Profiles' }] : []),
    ...(variants.length > 0 ? [{ id: 'variants', label: 'Available Variants' }] : []),
  ];

  const rawGraphItems = getCanonicalRelationshipsForEntity('registry', family);
  const graphNodes = resolveGraphNodes(rawGraphItems, 'registry', family).filter(n => n.type !== 'package_task');
  const shouldShowGraph = shouldRenderKnowledgeGraph([], graphNodes);

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Registry', href: '/registry' },
        { label: familyData.name },
      ]}
      toc={toc}
    >

      <ReadingSessionTracker id={family} href={`/registry/families/${family}`} name={familyData.name} type="registry" category={family} />
      
      <div className="space-y-4">
        {/* Family Header */}
        <div id="family-header" className="flex items-start justify-between gap-3 scroll-mt-24">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              {familyData.name}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {familyData.description}
            </p>
          </div>
          <FavoriteButton type="registry" id={family} name={familyData.name} href={`/registry/families/${family}`} />
        </div>

        {/* Family Stats - Full-width rows on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Provider</div>
            <div className="text-sm font-medium text-foreground">{familyData.provider}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Variants</div>
            <div className="text-sm font-medium text-foreground font-mono">{variants.length}</div>
          </div>
          {familyData.engineering_snapshot?.production_ready && (
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</div>
              <div className="text-sm font-medium text-emerald-600">Production Ready</div>
            </div>
          )}
        </div>

        {/* Engineering Decision Cards */}
        <div id="decisions" className="scroll-mt-24">
          <EngineeringDecisionCards family={familyData} />
        </div>

        {/* Performance Dimensions */}
        {familyData.engineering_decision?.performance_dimensions && (
          <div id="performance" className="scroll-mt-24">
            <PerformanceDimensions dimensions={familyData.engineering_decision.performance_dimensions} />
          </div>
        )}

        {/* Deployment Profiles */}
        {familyData.engineering_decision?.deployment_profiles && (
          <div id="deployment" className="scroll-mt-24">
            <DeploymentProfiles profiles={familyData.engineering_decision.deployment_profiles} />
          </div>
        )}

        {/* Runtime Decision - Answers: Why this runtime? When not to use it? */}
        {familyData.engineering_decision?.runtime_matrix && (
          <RuntimeDecisionCard 
            runtimeMatrix={familyData.engineering_decision.runtime_matrix}
          />
        )}

        {/* Variants Section */}
        {variants.length > 0 ? (
          <div id="variants" className="space-y-4 scroll-mt-24">
            <h2 className="text-base md:text-lg font-semibold text-foreground">Available Variants</h2>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {variants.map((variant) => (
                <VariantCard key={variant.id} variant={variant} familyId={family} />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No variants have been added for this family yet.
          </div>
        )}

        {/* Comparison Table */}
        {variants.length > 1 && (
          <div className="space-y-4">
            <h2 className="text-base md:text-lg font-semibold text-foreground">Variant Comparison</h2>
            <VariantComparisonTable variants={variants} />
          </div>
        )}

        {/* Quick Links - Downloads, Documentation */}
        <QuickLinksCard
          references={familyData.references}
        />

        {/* Engineering Continuation - Answers: What should I do next? */}
        {familyData.related_resources && familyData.related_resources.length > 0 && (
          <EngineeringContinuation resources={familyData.related_resources} />
        )}

        {shouldShowGraph && <KnowledgeGraphPanel nodes={graphNodes} />}
      </div>

    </ContentPageLayout>
  );
}