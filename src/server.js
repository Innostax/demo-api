import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { ITEMS, paginate, search } from './data.js';
import { detailPage, docsPage, listPage } from './pages.js';

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
app.use('/static', express.static(path.join(here, '..', 'public')));

app.get('/api/items', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  res.json(paginate(search(ITEMS, q), req.query.page));
});

app.get('/api/items/:id', (req, res) => {
  const item = ITEMS.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'No such item' });
  res.json(item);
});

app.get('/', (req, res) => res.type('html').send(listPage()));
app.get('/items/:id', (req, res) => {
  const item = ITEMS.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).type('html').send('<h1>Not found</h1>');
  res.type('html').send(detailPage(item));
});
app.get('/docs', (req, res) => res.type('html').send(docsPage()));
app.get('/health', (req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 4100;
app.listen(port, () => console.log(`demo-api on http://localhost:${port}`));
