import { BaseMeta, ContentRef } from "./meta";

export interface PackageTask {
  task: string;
  mental_trigger: string;
  syntax: string;
  important_params: string[];
  example: string;
  use_when: string;
  avoid_when: string;
  decision_notes: string;
  gotchas: string[];
  official_docs: string;
  related_workflows: string[];
  related_cheatsheets: string[];
}

export interface Package extends BaseMeta {
  id: string;
  name: string;
  version: string;
  install: string;
  import_as: string;
  summary: string;
  tasks: PackageTask[];
  alternatives: ContentRef[];
}
