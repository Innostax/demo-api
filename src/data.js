/** Fifty-three records, in memory: enough for three pages of twenty. */
const CITIES = ['Lisbon', 'Porto', 'Madrid', 'Paris', 'Berlin', 'Oslo', 'Rome', 'Vienna', 'Prague', 'Dublin'];
const KINDS = ['invoice', 'receipt', 'credit note', 'purchase order'];

export const ITEMS = Array.from({ length: 53 }, (_, i) => {
  const n = i + 1;
  return {
    id: String(n),
    title: `${KINDS[n % KINDS.length]} ${String(n).padStart(3, '0')}`,
    customer: `Customer ${String.fromCharCode(65 + (n % 26))}`,
    city: CITIES[n % CITIES.length],
    amountCents: 1500 + ((n * 7919) % 90000),
    createdAt: new Date(Date.UTC(2026, 0, 1 + n)).toISOString(),
  };
});

export const PAGE_SIZE = 20;

/** Items whose title, customer or city contains every word of `q` (case-insensitive). */
export function search(items, q) {
  const words = (q || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return items;
  return items.filter((item) => {
    const hay = `${item.title} ${item.customer} ${item.city}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

/** One page of a list: `page` is 1-based. */
export function paginate(items, page) {
  const current = Math.max(1, Number(page) || 1);
  const start = (current - 1) * PAGE_SIZE;
  // One slice for the page and the one before it (prefetched for a snappier "previous").
  const window = items.slice(current > 1 ? start - PAGE_SIZE : 0, start + PAGE_SIZE);
  return {
    page: current,
    pages: Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
    total: items.length,
    items: window.slice(0, PAGE_SIZE),
  };
}
