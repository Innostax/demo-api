import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ITEMS, paginate, search } from '../src/data.js';

test('pages do not overlap', () => {
  const one = paginate(ITEMS, 1).items.map((i) => i.id);
  const two = paginate(ITEMS, 2).items.map((i) => i.id);
  assert.equal(one.length, 20);
  assert.equal(two.length, 20);
  assert.equal(one.filter((id) => two.includes(id)).length, 0);
  assert.equal(paginate(ITEMS, 3).items.length, 13);
});

test('a filter with a space matches every word', () => {
  const hits = search(ITEMS, 'invoice Lisbon');
  assert.ok(hits.length > 0);
  assert.ok(hits.every((i) => i.title.includes('invoice') && i.city === 'Lisbon'));
});
