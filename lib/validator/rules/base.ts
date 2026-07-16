import { AENSConfig } from '../../config/loader.js';
import { KnowledgeGraph } from '../context.js';

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface ValidationIssue {
  code: string;       // e.g. 'KQV001'
  ruleId: string;     // e.g. 'schema-validation'
  category: string;   // e.g. 'schema'
  severity: Severity;
  filePath: string;
  message: string;
  suggestedFix?: string;
  priority: number;   // 1 to 10
  relatedPages?: string[];
}

export interface ValidationContext {
  graph: KnowledgeGraph;
  config: AENSConfig;
  registeredTags: Set<string>;
  registeredAliases: Set<string>;
}

export interface RuleMetadata {
  id: string;         // E.g. 'KQV001'
  category: string;   // E.g. 'schema'
  severity: Severity;
  autofix: boolean;
  docs: string;
}

export interface ValidationRule {
  meta: RuleMetadata;
  name: string;
  description: string;
  
  validate(context: ValidationContext): Promise<ValidationIssue[]>;
}
