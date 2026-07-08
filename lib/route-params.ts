import { ModelCategorySchema, ModelSubcategorySchema } from './schemas/model';
import { RegistryTaskSchema } from './schemas/registry';
import { ModelCategory, ModelSubcategory } from '@/types/model';
import { RegistryTask } from '@/types/registry';

/**
 * Validates a string category parameter against the ModelCategorySchema.
 * Returns the validated ModelCategory or null if invalid.
 */
export function validateModelCategory(category: string): ModelCategory | null {
  const result = ModelCategorySchema.safeParse(category);
  return result.success ? result.data : null;
}

/**
 * Validates a string subcategory parameter against the ModelSubcategorySchema.
 * Returns the validated ModelSubcategory or null if invalid.
 */
export function validateModelSubcategory(subcategory: string): ModelSubcategory | null {
  const result = ModelSubcategorySchema.safeParse(subcategory);
  return result.success ? result.data : null;
}

/**
 * Validates a string task parameter against the RegistryTaskSchema.
 * Returns the validated RegistryTask or null if invalid.
 */
export function validateRegistryTask(task: string): RegistryTask | null {
  const result = RegistryTaskSchema.safeParse(task);
  return result.success ? result.data : null;
}
