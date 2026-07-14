import { getAllPatterns } from '@/lib/data';
import PatternFilterClient from './PatternFilterClient';

export default function PatternsPage() {
  const patterns = getAllPatterns();

  return <PatternFilterClient patterns={patterns} />;
}