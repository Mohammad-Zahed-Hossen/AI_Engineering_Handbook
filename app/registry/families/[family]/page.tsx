import { notFound } from 'next/navigation';
import { getAllRegistryFamilyIds, getRegistryFamily, getRegistryVariantsByFamily } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import VariantCard from '@/components/registry/VariantCard';
import VariantComparisonTable from '@/components/registry/VariantComparisonTable';

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

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Registry', href: '/registry' },
        { label: familyData.name },
      ]}
    >
      <div className="space-y-6">
        {/* Family Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {familyData.name}
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {familyData.description}
          </p>
        </div>

        {/* Family Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

        {/* Variants Section */}
        {variants.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Available Variants</h2>
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
            <h2 className="text-lg font-semibold text-foreground">Variant Comparison</h2>
            <VariantComparisonTable variants={variants} />
          </div>
        )}

        {/* Quick Links */}
        {familyData.references.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Quick Links</h2>
            <div className="flex flex-col gap-1">
              {familyData.references.slice(0, 5).map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  {ref.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Family References */}
        {familyData.references.length > 5 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">All References</h2>
            <div className="flex flex-col gap-1">
              {familyData.references.slice(5).map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  {ref.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </ContentPageLayout>
  );
}