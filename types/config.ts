/**
 * TypeScript types for AENS configuration
 * Generated from schema/config.schema.json
 */

/**
 * AENS Configuration Interface
 * Central configuration authority for the AI Engineering Navigation System
 */
export interface AENSConfig {
  /**
   * Configuration version
   * Format: major.minor (e.g., "2.0")
   */
  version: string;

  /**
   * Supported content types
   * List of all content type identifiers supported by the system
   */
  content_types: string[];

  /**
   * Schema version mapping
   * Maps config versions to schema directory paths
   * Example: { "2.0": "schema/v2" }
   */
  schema_version_mapping: Record<string, string>;

  /**
   * Size budgets for content validation
   * Defines maximum limits for various content elements
   */
  size_budgets: {
    /** Maximum number of common tasks per package */
    package_max_common_tasks: number;
    /** Maximum number of steps per workflow */
    workflow_max_steps: number;
    /** Maximum number of entries per cheatsheet */
    cheatsheet_max_entries: number;
    /** Maximum relationships per content type */
    max_relationships_per_type: number;
    /** Maximum total relationships across all types */
    max_total_relationships: number;
  };

  /**
   * Stability tier configurations
   * Defines review cadence and verification requirements per stability tier
   */
  stability_tiers: {
    /** Stable content tier configuration */
    stable: {
      /** Review cadence in days */
      review_cadence_days: number;
      /** Whether verification is required */
      verification_required: boolean;
    };
    /** Semi-stable content tier configuration */
    semi_stable: {
      /** Review cadence in days */
      review_cadence_days: number;
      /** Whether verification is required */
      verification_required: boolean;
    };
    /** Volatile content tier configuration */
    volatile: {
      /** Review cadence in days */
      review_cadence_days: number;
      /** Whether verification is required */
      verification_required: boolean;
    };
  };

  /**
   * Validation rules
   * Global validation behavior settings
   */
  validation_rules: {
    /** Whether relationships must be bidirectional */
    require_bidirectional_relationships: boolean;
    /** Whether unregistered tags are allowed */
    allow_unregistered_tags: boolean;
    /** Whether unregistered aliases are allowed */
    allow_unregistered_aliases: boolean;
  };

  /**
   * Registry asset types
   * List of asset types supported in the registry
   */
  registry_asset_types: string[];
}
