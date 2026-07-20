import { getAllDebugGuides } from '@/lib/data';
import DebugGuideFilterClient from './DebugGuideFilterClient';

export default function DebugGuidesPage() {
  const debugGuides = getAllDebugGuides();

  return <DebugGuideFilterClient debugGuides={debugGuides} />;
}