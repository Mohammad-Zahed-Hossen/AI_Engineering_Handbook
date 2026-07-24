import KnowledgeGraphPanelClient, { KnowledgeGraphNode } from './KnowledgeGraphPanelClient';

interface KnowledgeGraphPanelProps {
  nodes: KnowledgeGraphNode[];
}

export default function KnowledgeGraphPanel({ nodes }: KnowledgeGraphPanelProps) {
  if (!nodes || nodes.length === 0) return null;
  return <KnowledgeGraphPanelClient nodes={nodes} />;
}