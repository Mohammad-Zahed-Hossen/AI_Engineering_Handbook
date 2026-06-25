import { BaseMeta } from "./meta";

export interface CheatsheetItem {
  fn: string;
  purpose: string;
}

export interface CheatsheetGroup {
  group: string;
  items: CheatsheetItem[];
}

export interface Cheatsheet extends BaseMeta {
  id: string;
  name: string;
  groups: CheatsheetGroup[];
}