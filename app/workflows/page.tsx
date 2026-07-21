import { getAllWorkflows } from '@/lib/data';
import WorkflowFilterClient from './WorkflowFilterClient';

export default function WorkflowsPage() {
  const workflows = getAllWorkflows();

  return <WorkflowFilterClient workflows={workflows} />;
}