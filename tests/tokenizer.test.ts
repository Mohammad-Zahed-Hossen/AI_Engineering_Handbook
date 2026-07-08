import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenizeCodeField, tokenize } from '../lib/search/tokenizer';

test('tokenizeCodeField handles inherited object properties safely', () => {
  assert.doesNotThrow(() => tokenizeCodeField('constructor'));
  assert.doesNotThrow(() => tokenize('constructor'));

  const codeTokens = tokenizeCodeField('constructor');
  assert.match(codeTokens, /constructor/);
});
