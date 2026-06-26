/**
 * Pure code tokenizer with zero dependencies.
 * 
 * This tokenizer follows the rules specified in the AENS V2 Search Architecture:
 * 1. Dot-split — np.linalg.inv → ["np", "linalg", "inv"]
 * 2. Prefix segments — ["np.linalg", "np.linalg.inv"] (for prefix-aware search)
 * 3. Package alias expansion — np → also numpy; torch → also pytorch
 * 4. CamelCase split — CrossEntropyLoss → ["Cross", "Entropy", "Loss", "cross", "entropy", "loss"]
 * 5. Snake/kebab split — learning_rate, max-depth → individual words
 * 6. Abbreviation expansion (via alias map) — inv → ["inverse"]; svd → ["singular value decomposition"]
 * 7. Deduplicate and lowercase — all tokens stored lowercase
 * 
 * This function does not import anything — it's a pure transformation function.
 */

// Hardcoded package alias map (common ML/AI packages)
const PACKAGE_ALIASES: Record<string, string[]> = {
  'np': ['numpy'],
  'numpy': ['np'],
  'torch': ['pytorch'],
  'pytorch': ['torch'],
  'tf': ['tensorflow'],
  'tensorflow': ['tf'],
  'pd': ['pandas'],
  'pandas': ['pd'],
  'sklearn': ['scikit-learn'],
  'scikit-learn': ['sklearn'],
  'plt': ['matplotlib'],
  'matplotlib': ['plt'],
  'sns': ['seaborn'],
  'seaborn': ['sns'],
  'cv2': ['opencv'],
  'opencv': ['cv2'],
};

// Hardcoded abbreviation expansion map (common technical abbreviations)
const ABBREVIATION_EXPANSIONS: Record<string, string[]> = {
  'inv': ['inverse'],
  'svd': ['singular', 'value', 'decomposition'],
  'eig': ['eigenvalue'],
  'eigh': ['eigenvalue'],
  'fft': ['fast', 'fourier', 'transform'],
  'ifft': ['inverse', 'fast', 'fourier', 'transform'],
  'lstm': ['long', 'short', 'term', 'memory'],
  'gru': ['gated', 'recurrent', 'unit'],
  'cnn': ['convolutional', 'neural', 'network'],
  'rnn': ['recurrent', 'neural', 'network'],
  'mlp': ['multi', 'layer', 'perceptron'],
  'adam': ['optimizer'],
  'sgd': ['stochastic', 'gradient', 'descent'],
  'rmsprop': ['optimizer'],
  'adagrad': ['optimizer'],
  'rag': ['retrieval', 'augmented', 'generation'],
  'llm': ['large', 'language', 'model'],
  'nlp': ['natural', 'language', 'processing'],
  'cv': ['computer', 'vision'],
  'rl': ['reinforcement', 'learning'],
  'gan': ['generative', 'adversarial', 'network'],
  'vae': ['variational', 'autoencoder'],
  'gpu': ['graphics', 'processing', 'unit'],
  'cpu': ['central', 'processing', 'unit'],
  'api': ['application', 'programming', 'interface'],
  'json': ['javascript', 'object', 'notation'],
  'csv': ['comma', 'separated', 'values'],
  'html': ['hypertext', 'markup', 'language'],
  'css': ['cascading', 'style', 'sheets'],
  'sql': ['structured', 'query', 'language'],
  'db': ['database'],
  'http': ['hypertext', 'transfer', 'protocol'],
  'https': ['hypertext', 'transfer', 'protocol', 'secure'],
  'url': ['uniform', 'resource', 'locator'],
  'uri': ['uniform', 'resource', 'identifier'],
  'id': ['identifier'],
  'uid': ['unique', 'identifier'],
  'uuid': ['universally', 'unique', 'identifier'],
  'os': ['operating', 'system'],
  'fs': ['file', 'system'],
  'io': ['input', 'output'],
  'env': ['environment'],
  'config': ['configuration'],
  'params': ['parameters'],
  'args': ['arguments'],
  'kwargs': ['keyword', 'arguments'],
  'vars': ['variables'],
  'consts': ['constants'],
  'funcs': ['functions'],
  'methods': ['method'],
  'classes': ['class'],
  'objs': ['objects'],
  'arr': ['array'],
  'dict': ['dictionary'],
  'list': ['list'],
  'tuple': ['tuple'],
  'set': ['set'],
  'str': ['string'],
  'int': ['integer'],
  'float': ['floating', 'point'],
  'bool': ['boolean'],
  'true': ['boolean'],
  'false': ['boolean'],
  'null': ['null', 'none'],
  'none': ['null', 'none'],
  'undefined': ['undefined'],
  'NaN': ['not', 'a', 'number'],
  'inf': ['infinity'],
  'pi': ['pi', '3.14159'],
  'e': ['euler', '2.718'],
  'logarithm': ['log'],
  'exp': ['exponential'],
  'sqrt': ['square', 'root'],
  'abs': ['absolute'],
  'min': ['minimum'],
  'max': ['maximum'],
  'sum': ['sum'],
  'mean': ['mean', 'average'],
  'median': ['median'],
  'mode': ['mode'],
  'std': ['standard', 'deviation'],
  'variance': ['var'],
  'cov': ['covariance'],
  'corr': ['correlation'],
  'norm': ['normalization', 'norm'],
  'dot': ['dot', 'product'],
  'cross': ['cross', 'product'],
  'matmul': ['matrix', 'multiplication'],
  'transpose': ['transpose'],
  'reshape': ['reshape'],
  'flatten': ['flatten'],
  'squeeze': ['squeeze'],
  'expand': ['expand'],
  'concat': ['concatenate'],
  'stack': ['stack'],
  'split': ['split'],
  'slice': ['slice'],
  'index': ['index'],
  'sort': ['sort'],
  'filter': ['filter'],
  'map': ['map'],
  'reduce': ['reduce'],
  'find': ['find'],
  'search': ['search'],
  'replace': ['replace'],
  'match': ['match'],
  'test': ['test'],
  'assert': ['assert'],
  'raise': ['raise', 'error'],
  'throw': ['throw', 'error'],
  'catch': ['catch', 'error'],
  'try': ['try'],
  'except': ['except', 'error'],
  'finally': ['finally'],
  'with': ['with'],
  'as': ['as'],
  'from': ['from'],
  'import': ['import'],
  'export': ['export'],
  'default': ['default'],
  'class': ['class'],
  'def': ['function', 'definition'],
  'function': ['function'],
  'yield': ['yield'],
  'await': ['await'],
  'async': ['async', 'asynchronous'],
  'sync': ['sync', 'synchronous'],
  'const': ['constant'],
  'let': ['let'],
  'variable': ['var'],
  'if': ['if'],
  'else': ['else'],
  'elif': ['else', 'if'],
  'for': ['for', 'loop'],
  'while': ['while', 'loop'],
  'do': ['do'],
  'switch': ['switch'],
  'case': ['case'],
  'break': ['break'],
  'continue': ['continue'],
  'pass': ['pass'],
  'print': ['print'],
  'console': ['console'],
  'error': ['error'],
  'warn': ['warning'],
  'info': ['information'],
  'debug': ['debug'],
  'trace': ['trace'],
};

/**
 * Split camelCase and PascalCase identifiers into component words.
 * Example: "CrossEntropyLoss" → ["Cross", "Entropy", "Loss", "cross", "entropy", "loss"]
 */
function splitCamelCase(input: string): string[] {
  const words: string[] = [];
  let currentWord = '';
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    
    // Check if this is an uppercase letter that starts a new word
    if (char === char.toUpperCase() && char !== char.toLowerCase() && currentWord.length > 0) {
      if (currentWord.length > 0) {
        words.push(currentWord);
        currentWord = '';
      }
    }
    
    currentWord += char;
  }
  
  if (currentWord.length > 0) {
    words.push(currentWord);
  }
  
  // Add lowercase versions
  const result: string[] = [...words];
  words.forEach(word => {
    if (word.length > 1) {
      result.push(word.toLowerCase());
    }
  });
  
  return result;
}

/**
 * Split snake_case and kebab-case identifiers into component words.
 * Example: "learning_rate" → ["learning", "rate"]
 */
function splitSnakeKebab(input: string): string[] {
  // Replace both underscores and hyphens with spaces, then split
  const normalized = input.replace(/[_-]/g, ' ');
  return normalized.split(/\s+/).filter(w => w.length > 0);
}

/**
 * Split dot-notation identifiers into component parts.
 * Example: "np.linalg.inv" → ["np", "linalg", "inv"]
 */
function splitDotNotation(input: string): string[] {
  return input.split('.').filter(part => part.length > 0);
}

/**
 * Generate prefix segments for dot-notation identifiers.
 * Example: "np.linalg.inv" → ["np", "np.linalg", "np.linalg.inv"]
 */
function generatePrefixSegments(parts: string[]): string[] {
  const segments: string[] = [];
  let current = '';
  
  for (let i = 0; i < parts.length; i++) {
    if (i > 0) {
      current += '.';
    }
    current += parts[i];
    segments.push(current);
  }
  
  return segments;
}

export function tokenizeCodeField(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const tokens = new Set<string>();

  input
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .forEach(part => {
      const normalized = part.trim().toLowerCase();
      if (!normalized) return;

      tokens.add(normalized);

      const dotParts = splitDotNotation(normalized);
      dotParts.forEach(dotPart => {
        tokens.add(dotPart);
        const aliases = PACKAGE_ALIASES[dotPart];
        if (aliases) {
          aliases.forEach(alias => tokens.add(alias));
        }
        const camelParts = splitCamelCase(dotPart);
        camelParts.forEach(word => {
          const normalizedWord = word.trim().toLowerCase();
          if (normalizedWord.length >= 2) tokens.add(normalizedWord);
        });
        const snakeParts = splitSnakeKebab(dotPart);
        snakeParts.forEach(word => {
          const normalizedWord = word.trim().toLowerCase();
          if (normalizedWord.length >= 2) tokens.add(normalizedWord);
        });
        const expansions = ABBREVIATION_EXPANSIONS[dotPart];
        if (expansions) {
          expansions.forEach(expansion => tokens.add(expansion));
        }
      });

      if (dotParts.length > 1) {
        generatePrefixSegments(dotParts).forEach(segment => tokens.add(segment));
      }
    });

  return Array.from(tokens)
    .filter(token => token.length >= 2)
    .join(' ');
}

/**
 * Main tokenizer function - pure function with zero dependencies.
 * 
 * @param input - The code identifier or text to tokenize
 * @returns Array of lowercase, deduplicated tokens
 * 
 * Example:
 * tokenize("np.linalg.inv") → ["np", "numpy", "linalg", "inv", "inverse", "np.linalg", "np.linalg.inv"]
 */
export function tokenize(input: string): string[] {
  if (!input || typeof input !== 'string') {
    return [];
  }
  
  const tokens: Set<string> = new Set();
  const normalized = input.trim().toLowerCase();
  
  // Rule 1: Dot-split
  const dotParts = splitDotNotation(normalized);
  dotParts.forEach(part => tokens.add(part));
  
  // Rule 2: Prefix segments (for dot notation)
  if (dotParts.length > 1) {
    const prefixes = generatePrefixSegments(dotParts);
    prefixes.forEach(prefix => tokens.add(prefix));
  }
  
  // Rule 3: Package alias expansion
  dotParts.forEach(part => {
    const aliases = PACKAGE_ALIASES[part];
    if (aliases) {
      aliases.forEach(alias => tokens.add(alias));
    }
  });
  
  // Rule 4: CamelCase split (for each dot part)
  dotParts.forEach(part => {
    const camelWords = splitCamelCase(part);
    camelWords.forEach(word => tokens.add(word.toLowerCase()));
  });
  
  // Rule 5: Snake/kebab split (for each dot part)
  dotParts.forEach(part => {
    const snakeWords = splitSnakeKebab(part);
    snakeWords.forEach(word => tokens.add(word.toLowerCase()));
  });
  
  // Rule 6: Abbreviation expansion (for each dot part)
  dotParts.forEach(part => {
    const expansions = ABBREVIATION_EXPANSIONS[part];
    if (expansions) {
      expansions.forEach(exp => tokens.add(exp));
    }
  });
  
  // Rule 7: Return as array (already deduplicated via Set)
  return Array.from(tokens);
}

/**
 * Tokenize prose text (descriptions, mental triggers, etc.)
 * This is a simpler tokenizer for natural language text.
 * 
 * @param input - The prose text to tokenize
 * @returns Array of lowercase, deduplicated words (filtered stop words)
 */
export function tokenizeProse(input: string): string[] {
  if (!input || typeof input !== 'string') {
    return [];
  }
  
  const stopWords = new Set([
    'i', 'need', 'a', 'to', 'the', 'is', 'for', 'or', 'when', 'you', 'and',
    'in', 'on', 'at', 'with', 'by', 'from', 'of', 'that', 'this', 'it', 'as',
    'be', 'are', 'will', 'can', 'not', 'an', 'if', 'use', 'my', 'me', 'we',
    'our', 'us', 'your', 'they', 'them', 'their', 'his', 'her', 'its', 'who',
    'what', 'where', 'why', 'how', 'which', 'each', 'every', 'all', 'some',
    'any', 'more', 'most', 'less', 'least', 'very', 'just', 'also', 'then',
    'than', 'into', 'over', 'after', 'before', 'between', 'under', 'again'
  ]);
  
  // Split on word boundaries, filter short words and stop words
  const words = input
    .toLowerCase()
    .match(/\b[a-z]{3,}\b/g) || [];
  
  return [...new Set(words.filter(word => !stopWords.has(word)))];
}
