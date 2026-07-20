import { getAllPrinciples } from '@/lib/data';
import PrincipleFilterClient from './PrincipleFilterClient';

export default function PrinciplesPage() {
  const principles = getAllPrinciples();

  return <PrincipleFilterClient principles={principles} />;
}
