import { getAllDecisionGuides } from '@/lib/data';
import DecisionGuideFilterClient from './DecisionGuideFilterClient';

export default function DecisionGuidesPage() {
  const decisionGuides = getAllDecisionGuides();

  return <DecisionGuideFilterClient decisionGuides={decisionGuides} />;
}