/** Recently viewed: renders cards for handles kept in localStorage (card-fragment section). */
document.querySelectorAll('[data-recently-viewed]').forEach(async (section) => {
  if (section.dataset.bound) return;
  section.dataset.bound = '1';
  let handles = [];
  try {
    handles = JSON.parse(localStorage.getItem('weft:viewed') || '[]');
  } catch (_) { /* storage blocked */ }
  handles = handles.filter((h) => h && h !== section.dataset.exclude).slice(0, Number(section.dataset.limit) || 8);
  if (!handles.length) return;
  const root = (section.dataset.root || '/').replace(/\/$/, '');
  const list = section.querySelector('[data-recently-viewed-list]');
  const cards = await Promise.all(handles.map(async (handle) => {
    try {
      const res = await fetch(`${root}/products/${encodeURIComponent(handle)}?section_id=card-fragment`);
      if (!res.ok) return null;
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      return doc.querySelector('[data-card-fragment] > *');
    } catch (_) {
      return null;
    }
  }));
  const items = cards.filter(Boolean).map((card) => {
    const li = document.createElement('li');
    li.append(card);
    return li;
  });
  if (!items.length) return;
  list.replaceChildren(...items);
  section.hidden = false;
});
