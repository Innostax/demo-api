const shell = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · demo-api</title><link rel="stylesheet" href="/static/app.css"></head>
<body><header><nav><a href="/">Records</a><a href="/docs">API docs</a></nav></header>
<main>${body}</main><script src="/static/app.js"></script></body></html>`;

export const listPage = () =>
  shell(
    'Records',
    `<h1>Records</h1>
<form id="filter" role="search"><label>Filter <input name="q" placeholder="e.g. invoice Lisbon"></label><button>Apply</button></form>
<table id="list"><thead><tr><th>Title</th><th>Customer</th><th>City</th><th>Amount</th></tr></thead><tbody></tbody></table>
<nav id="pager" aria-label="Pages"></nav>`,
  );

export const detailPage = (item) =>
  shell(
    item.title,
    `<a href="/">← Back to records</a>
<article id="detail" data-id="${item.id}"><h1>${item.title}</h1><dl>
<dt>Customer</dt><dd>${item.customer}</dd><dt>City</dt><dd>${item.city}</dd>
<dt>Amount</dt><dd>$${(item.amountCents / 100).toFixed(2)}</dd><dt>Created</dt><dd>${item.createdAt.slice(0, 10)}</dd>
</dl></article>`,
  );

export const docsPage = () =>
  shell(
    'API docs',
    `<h1>API</h1>
<ul><li><code>GET /api/items?page=1&amp;q=</code> — one page of twenty records; <code>q</code> filters by words</li>
<li><code>GET /api/items/:id</code> — one record</li><li><code>GET /health</code></li></ul>`,
  );
