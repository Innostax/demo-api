// The detail page: an instant "cached" render when going back, refreshed after.
(function () {
  const article = document.getElementById('detail');
  if (!article) return;
  const cached = sessionStorage.getItem('detail');
  if (cached) article.innerHTML = cached;
  sessionStorage.setItem('detail', article.innerHTML);
})();

// The list page: loads a page of records from the API, keeps the filter and page in the URL.
(function () {
  const list = document.querySelector('#list tbody');
  if (!list) return;
  const pager = document.getElementById('pager');
  const form = document.getElementById('filter');
  const params = new URLSearchParams(location.search);
  form.q.value = params.get('q') || '';

  async function load() {
    const q = form.q.value.trim();
    const page = Number(params.get('page')) || 1;
    const res = await fetch(`/api/items?page=${page}&q=${encodeURIComponent(q)}`);
    if (!res.ok) {
      list.innerHTML = `<tr><td colspan="4">Could not load records (${res.status}).</td></tr>`;
      return;
    }
    const data = await res.json();
    list.innerHTML = data.items
      .map(
        (i) =>
          `<tr><td><a href="/items/${i.id}">${i.title}</a></td><td>${i.customer}</td><td>${i.city}</td><td>$${(i.amountCents / 100).toFixed(2)}</td></tr>`,
      )
      .join('');
    pager.innerHTML = Array.from({ length: data.pages }, (_, k) => {
      const n = k + 1;
      const href = `/?page=${n}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
      return n === data.page ? `<span aria-current="page">${n}</span>` : `<a href="${href}">${n}</a>`;
    }).join('');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    params.set('q', form.q.value.trim());
    params.delete('page');
    history.pushState(null, '', `/?${params}`);
    load();
  });
  load();
})();
