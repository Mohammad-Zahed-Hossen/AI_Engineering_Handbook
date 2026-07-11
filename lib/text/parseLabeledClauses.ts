export interface LabeledClause {
  label: string;
  text: string;
}

/**
 * Parse a string into labeled clauses based on known label prefixes.
 * Returns null if not all expected labels are found or if parsing fails.
 * This ensures we only parse well-formed structured text and fall back
 * to plain text for older/unmigrated content.
 */
export function parseLabeledClauses(input: string, labels: string[]): LabeledClause[] | null {
  if (!input || input.trim().length === 0) {
    return null;
  }

  const text = input.trim();
  
  // Check if all labels are present in the input
  const missingLabels = labels.filter(label => !text.includes(label));
  if (missingLabels.length > 0) {
    return null;
  }

  // Find all label positions
  const labelPositions: { label: string; index: number }[] = [];
  for (const label of labels) {
    const index = text.indexOf(label);
    if (index !== -1) {
      labelPositions.push({ label, index });
    }
  }

  // Sort by position to maintain order
  labelPositions.sort((a, b) => a.index - b.index);

  // Extract text between labels
  const clauses: LabeledClause[] = [];
  for (let i = 0; i < labelPositions.length; i++) {
    const current = labelPositions[i];
    const next = labelPositions[i + 1];
    
    let clauseText: string;
    if (next) {
      // Text from current label to next label
      clauseText = text.substring(current.index + current.label.length, next.index).trim();
    } else {
      // Text from current label to end
      clauseText = text.substring(current.index + current.label.length).trim();
    }
    
    // Remove trailing period and space artifacts
    clauseText = clauseText.replace(/\.\s*$/, '').trim();
    
    if (!clauseText) {
      return null; // Empty clause text means parsing failed
    }
    
    clauses.push({ label: current.label, text: clauseText });
  }
  
  // Verify we got exactly the right number of clauses
  if (clauses.length !== labels.length) {
    return null;
  }
  
  return clauses;
}

/*
 * Example usage and test cases:
 * 
 * const failureLabels = ['Failure:', 'Trigger:', 'Downstream Effect:', 'Detection:'];
 * const productionLabels = ['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:'];
 * 
 * // Well-formed 4-clause string:
 * parseLabeledClauses(
 *   "Failure: X. Trigger: Y. Downstream Effect: Z. Detection: W.",
 *   failureLabels
 * ) // Returns [{label: "Failure:", text: "X"}, {label: "Trigger:", text: "Y"}, ...]
 * 
 * // Missing one label:
 * parseLabeledClauses(
 *   "Failure: X. Trigger: Y. Downstream Effect: Z.",
 *   failureLabels
 * ) // Returns null (missing "Detection:")
 * 
 * // Empty string:
 * parseLabeledClauses("", failureLabels) // Returns null
 * 
 * // Non-matching format:
 * parseLabeledClauses("Some random text", failureLabels) // Returns null
 */
