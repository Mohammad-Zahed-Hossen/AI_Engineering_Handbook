import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import configSchema from '../../schema/config.schema.json';

export interface AENSConfig {
  version: string;
  content_types: string[];
  schema_version_mapping: Record<string, string>;
  size_budgets: {
    package_max_common_tasks: number;
    workflow_max_steps: number;
    cheatsheet_max_entries: number;
    max_relationships_per_type: number;
    max_total_relationships: number;
  };
  stability_tiers: {
    stable: { review_cadence_days: number; verification_required: boolean };
    semi_stable: { review_cadence_days: number; verification_required: boolean };
    volatile: { review_cadence_days: number; verification_required: boolean };
  };
  validation_rules: {
    require_bidirectional_relationships: boolean;
    allow_unregistered_tags: boolean;
    allow_unregistered_aliases: boolean;
  };
  registry_asset_types: string[];
}

export class ConfigNotFoundError extends Error {
  constructor() {
    super('aens.config.json not found in repository root');
    this.name = 'ConfigNotFoundError';
  }
}

export class ConfigParseError extends Error {
  constructor(message: string) {
    super(`Failed to parse aens.config.json: ${message}`);
    this.name = 'ConfigParseError';
  }
}

export class ConfigValidationError extends Error {
  constructor(errors: string[]) {
    super(`aens.config.json validation failed:\n${errors.join('\n')}`);
    this.name = 'ConfigValidationError';
  }
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateConfig(config: unknown): ValidationResult {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(configSchema);
  const valid = validate(config);
  
  if (valid) {
    return { valid: true, errors: [] };
  }
  
  const errors = validate.errors?.map(err => 
    `${err.instancePath || 'root'}: ${err.message}`
  ) || [];
  
  return { valid: false, errors };
}

export async function loadConfig(): Promise<AENSConfig> {
  const configPath = path.join(process.cwd(), 'aens.config.json');
  
  try {
    await fs.access(configPath);
  } catch {
    throw new ConfigNotFoundError();
  }
  
  let configRaw: string;
  try {
    configRaw = await fs.readFile(configPath, 'utf-8');
  } catch (error) {
    throw new ConfigParseError(error instanceof Error ? error.message : String(error));
  }
  
  let config: unknown;
  try {
    config = JSON.parse(configRaw);
  } catch (error) {
    throw new ConfigParseError(error instanceof Error ? error.message : String(error));
  }
  
  const validationResult = validateConfig(config);
  if (!validationResult.valid) {
    throw new ConfigValidationError(validationResult.errors);
  }
  
  return config as AENSConfig;
}
