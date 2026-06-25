export interface ContentRef {
  id: string;
  type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry';
}

export interface BaseMeta {
  created_at: string;
  updated_at: string;
  sources: string[];
  github_repo?: string;
}
