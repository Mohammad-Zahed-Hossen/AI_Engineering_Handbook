import { notFound } from 'next/navigation';
import { getDebugGuide, getAllDebugGuideIds } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import DebugSolutionList from '@/components/shared/DebugSolutionList';
import ExpandableText from '@/components/shared/ExpandableText';
import { Prose } from '@/components/shared/Prose';
import { AlertTriangle, CheckCircle2, Activity, Shield } from 'lucide-react';

export async function generateStaticParams() {
  const ids = getAllDebugGuideIds();
  return ids.map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DebugGuidePage({ params }: PageProps) {
  const { id } = await params;
  const debugGuide = getDebugGuide(id);

  if (!debugGuide) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Debug Guides', href: '/debug-guides' },
    { label: debugGuide.title },
  ];

  const toc = [
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'root-causes', label: 'Root Causes' },
    { id: 'diagnosis', label: 'Diagnosis' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'prevention', label: 'Prevention' },
  ];

  // Combine all related content
  const allRelatedContent = [
    ...debugGuide.related_packages.map(r => ({ ...r, type: 'package' as const })),
    ...debugGuide.related_workflows.map(r => ({ ...r, type: 'workflow' as const })),
    ...debugGuide.related_patterns.map(r => ({ ...r, type: 'pattern' as const })),
    ...debugGuide.related_models.map(r => ({ ...r, type: 'model' as const })),
    ...debugGuide.related_registry.map(r => ({ ...r, type: 'registry' as const })),
  ];

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{debugGuide.title}</h1>
        <ExpandableText cacheKey={`debug-desc-${debugGuide.id}`} fadeClass="from-background to-transparent">
          <Prose content={debugGuide.description} className="text-muted-foreground" />
        </ExpandableText>
<MetadataBadges
  type="debug_guide"
  updatedAt={debugGuide.updated_at}
  lastVerified={debugGuide.last_verified}
  category={debugGuide.category}
/>
      </div>

      {/* Symptoms */}
      <section id="symptoms" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Symptoms
        </h2>
        <div className="space-y-3">
          {debugGuide.symptoms.map((symptom, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">{symptom.symptom}</p>
              {symptom.description && (
                <Prose content={symptom.description} className="text-xs text-muted-foreground mt-1" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Root Causes */}
      <section id="root-causes" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          Root Causes
        </h2>
        <div className="space-y-3">
          {debugGuide.root_causes.map((cause, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{cause.cause}</p>
                  {cause.explanation && (
                    <Prose content={cause.explanation} className="text-xs text-muted-foreground mt-1" />
                  )}
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  cause.probability === 'high' 
                    ? 'bg-red-500/10 text-red-700 dark:text-red-400' 
                    : cause.probability === 'medium'
                    ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                    : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                }`}>
                  {cause.probability}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Diagnosis */}
      <section id="diagnosis" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Diagnosis
        </h2>
        <div className="space-y-3">
          {debugGuide.diagnosis.map((diag, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-4">
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Test</span>
                  <p className="text-sm font-medium text-foreground mt-0.5">{diag.test}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expected Result</span>
                  <Prose content={diag.expected_result} className="text-sm text-muted-foreground mt-0.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">How to Perform</span>
                  <Prose content={diag.how_to_perform} className="text-sm text-muted-foreground mt-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Solutions
        </h2>
        <DebugSolutionList solutions={debugGuide.solutions} />
      </section>

      {/* Prevention */}
      <section id="prevention" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          Prevention
        </h2>
        <div className="space-y-3">
          {debugGuide.prevention.map((prev, idx) => (
            <div key={idx} className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
              <Prose content={prev.prevention} className="text-sm font-medium text-purple-700 dark:text-purple-400" />
              {prev.practices && prev.practices.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {prev.practices.map((practice, pIdx) => (
                    <li key={pIdx} className="text-xs text-muted-foreground pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                      {practice}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Content */}
      {allRelatedContent.length > 0 && (
        <RelatedContent items={allRelatedContent} />
      )}
    </ContentPageLayout>
  );
}
