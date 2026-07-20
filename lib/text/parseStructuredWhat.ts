/**
 * Parse structured workflow step "what" field into description and labeled sections.
 * Returns null if the content doesn't follow the expected pattern.
 * Falls back to plain text rendering for older/unmigrated content.
 */

export interface StructuredWhat {
  description: string;
  sections: { label: string; text: string }[];
}

const STEP_LABELS = [
  'Input Artifact:',
  'Output Artifact:',
  'Required Metadata:',
  'Pipeline Contract:',
  'Primary Consumer:',
  'Input Interface Contract:',
  'Output Interface Contract:',
  'Uses:',
  'Production Metrics:',
];

/**
 * Parse the "what" field to extract description and structured sections.
 * Supports multiple formats:
 * 1. Simple bullet format: "* Label: value"
 * 2. Bold markdown format: "* **Label:**\n  * nested content..."
 * 3. Dash nested format: "* Label:\n  - nested content..."
 */
export function parseStructuredWhat(input: string): StructuredWhat | null {
  if (!input || input.trim().length === 0) {
    return null;
  }

  const text = input.trim();
  
  // Check if at least one label is present
  const hasAnyLabel = STEP_LABELS.some(label => text.includes(label));
  if (!hasAnyLabel) {
    return null;
  }

  // Split by lines
  const lines = text.split('\n');
  const descriptionLines: string[] = [];
  const sections: { label: string; text: string }[] = [];
  
  let currentLabel: string | null = null;
  let currentText: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check for simple bullet format: "* Label: value"
    const simpleLabelMatch = STEP_LABELS.find(label => trimmed.startsWith(`* ${label}`));
    
    // Check for bold markdown format: "* **Label:**"
    const boldLabelMatch = STEP_LABELS.find(label => {
      const boldPattern = `* **${label}**`;
      return trimmed.startsWith(boldPattern);
    });
    
    if (simpleLabelMatch) {
      // Save previous section if exists
      if (currentLabel) {
        sections.push({ label: currentLabel, text: currentText.join('\n').trim() });
        currentText = [];
      }
      // Start new section
      currentLabel = simpleLabelMatch;
      const value = trimmed.substring(2 + simpleLabelMatch.length).trim();
      if (value) {
        currentText = [value];
      }
    } else if (boldLabelMatch) {
      // Save previous section if exists
      if (currentLabel) {
        sections.push({ label: currentLabel, text: currentText.join('\n').trim() });
        currentText = [];
      }
      // Start new section with bold label
      currentLabel = boldLabelMatch;
      currentText = [];
    } else if (trimmed.startsWith('*') && currentLabel) {
      // This is a nested bullet under the current section
      const value = trimmed.substring(1).trim();
      if (value) {
        currentText.push(value);
      }
    } else if (trimmed.startsWith('-') && currentLabel) {
      // This is a nested dash item under the current section
      const value = trimmed.substring(1).trim();
      if (value) {
        currentText.push(value);
      }
    } else if (trimmed && !trimmed.startsWith('*') && !trimmed.startsWith('-')) {
      // This is part of the description
      descriptionLines.push(trimmed);
    }
  }
  
  // Don't forget the last section
  if (currentLabel) {
    sections.push({ label: currentLabel, text: currentText.join('\n').trim() });
  }

  // If we have sections, return structured format
  if (sections.length > 0) {
    return {
      description: descriptionLines.join(' ').replace(/\.\s*$/, '').trim(),
      sections,
    };
  }

  return null;
}
