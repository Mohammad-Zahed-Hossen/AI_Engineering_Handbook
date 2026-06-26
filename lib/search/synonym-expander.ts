import synonymsData from '@/data/search/synonyms.json';
import conceptGroupsData from '@/data/search/concept-groups.json';

const synonyms = synonymsData as Record<string, string[]>;
const conceptGroups = conceptGroupsData as Record<string, string[]>;

function normalizeToken(token: string): string {
  return token.toLowerCase().trim();
}

export function expandQuery(query: string): {
  expandedTokens: string[];
  conceptGroupIds: string[];
} {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return { expandedTokens: [], conceptGroupIds: [] };
  }

  const tokens = normalizedQuery
    .split(/[^a-z0-9]+/)
    .map(token => token.trim())
    .filter(Boolean);

  const expandedTokens = new Set<string>();
  const conceptGroupIds = new Set<string>();

  tokens.forEach(token => {
    expandedTokens.add(token);

    const aliasValues = synonyms[token];
    if (aliasValues) {
      aliasValues.forEach(value => expandedTokens.add(normalizeToken(value)));
    }

    const conceptValue = conceptGroups[token];
    if (conceptValue) {
      conceptValue.forEach(entry => {
        expandedTokens.add(normalizeToken(entry));
        conceptGroupIds.add(entry);
      });
    }
  });

  const fullQuery = normalizedQuery.replace(/\s+/g, ' ');
  if (conceptGroups[fullQuery]) {
    conceptGroups[fullQuery].forEach(entry => {
      expandedTokens.add(normalizeToken(entry));
      conceptGroupIds.add(entry);
    });
  }

  return {
    expandedTokens: Array.from(expandedTokens),
    conceptGroupIds: Array.from(conceptGroupIds),
  };
}
