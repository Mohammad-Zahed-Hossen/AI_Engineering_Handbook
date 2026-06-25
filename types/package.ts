import { BaseMeta, ContentRef } from "./meta";

export interface PackageFunction {
  fn: string;
  purpose: string;
  example: string;        // removed 'syntax' — redundant
  category: string;
}

export interface PackageSection {
  name: string;
  functions: PackageFunction[];
  gotchas: string[];
}

export interface Package extends BaseMeta {
  id: string;
  name: string;
  version: string;
  install: string;
  import_as: string;
  summary: string;
  sections: PackageSection[];
  alternatives: ContentRef[];
}