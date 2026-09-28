// Collection results (facets.js): filters and sorting through Section Rendering, active chips,
// history, the filter drawer (one form moved in and out), "Show more", "Load more", layout toggle.
import { shell } from './fixtures/shell.mjs';

const results = ({ count = 3, chips = '', items = 3, next = true }) => `
<div class="collection__results" data-facets-results aria-live="polite">
  <div class="active-facets" data-facets-active>${chips}</div>
  <ul class="product-grid collection__grid" role="list" data-product-grid data-layout="grid">
    ${Array.from({ length: items }, (_, i) => `<li class="card"><a class="card__link" href="/products/p${i}">Product ${i}</a></li>`).join('')}
  </ul>
  <div class="collection__load-more" data-load-more-wrap>${next ? '<a class="button" href="/collections/all?page=2" data-load-more>Load more</a>' : ''}</div>
</div>`;

const facet = ({ redCount = 2, redChecked = false }) => `
<details class="facet" data-facet="filter.v.option.color" open>
  <summary class="facet__summary"><span class="facet__title">Color</span>${redChecked ? '<span class="facet__active-count">(1)</span>' : ''}</summary>
  <div class="facet__body" data-facet-body>
    <fieldset><legend class="visually-hidden">Color</legend>
      <ul class="facet__list" role="list">
        <li><input class="facet__input visually-hidden" type="checkbox" id="f-red" name="filter.v.option.color" value="Red" ${redChecked ? 'checked' : ''}><label class="facet__option" for="f-red"><span class="facet__label">Red</span> <span class="facet__value-count">(${redCount})</span></label></li>
        <li><input class="facet__input visually-hidden" type="checkbox" id="f-blue" name="filter.v.option.color" value="Blue"><label class="facet__option" for="f-blue"><span class="facet__label">Blue</span></label></li>
        <li class="facet__extra" data-facet-extra id="extra"><input class="facet__input visually-hidden" type="checkbox" id="f-green" name="filter.v.option.color" value="Green"><label class="facet__option" for="f-green"><span class="facet__label">Green</span></label></li>
      </ul>
      <button type="button" class="link facet__more" data-facet-more aria-expanded="false" data-less="See less">Show 1 more</button>
    </fieldset>
  </div>
</details>
<details class="facet" data-facet="filter.v.price" open>
  <summary class="facet__summary"><span class="facet__title">Price</span></summary>
  <div class="facet__body" data-facet-body>
    <input class="input" type="number" id="price-min" name="filter.v.price.gte" value="" data-facet-price>
    <input class="input" type="number" id="price-max" name="filter.v.price.lte" value="" data-facet-price>
  </div>
</details>`;

const section = (opts = {}) => `
<div id="shopify-section-main">
<collection-results class="section collection" data-section-id="main">
  <div class="collection__toolbar">
    <button type="button" class="button collection__filter-toggle collection__filter-toggle--small" data-open-dialog="FacetsDrawer-main" id="toggle">Filter and sort</button>
    <p class="collection__count" data-product-count>${opts.countText || '3 products'}</p>
    <select id="sort" name="sort_by" form="FacetsForm-main" data-facets-sort>
      <option value="manual" selected>Featured</option><option value="price-ascending">Price, low to high</option>
    </select>
    <div class="collection__layout-toggle" role="group" aria-label="Layout">
      <button type="button" data-layout-option="grid" aria-pressed="true" id="grid">Grid</button>
      <button type="button" data-layout-option="list" aria-pressed="false" id="list">List</button>
    </div>
  </div>
  <div class="collection__layout collection__layout--sidebar">
    <aside class="collection__facets" data-facets-home aria-label="Filters">
      <form id="FacetsForm-main" class="facets" action="/collections/all" method="get" data-facets-form>${facet(opts)}</form>
    </aside>
    ${results(opts)}
  </div>
  <dialog id="FacetsDrawer-main" class="drawer drawer--start facets-drawer" aria-label="Filter and sort" data-light-dismiss>
    <div class="drawer__panel">
      <div class="drawer__header"><button type="button" data-close-dialog id="close-drawer">Close</button></div>
      <div class="drawer__body" data-facets-slot></div>
      <div class="drawer__footer"><button type="button" data-close-dialog data-facets-show>${opts.showText || 'Show 3 results'}</button></div>
    </div>
  </dialog>
</collection-results>
</div>`;

const head = '<link rel="stylesheet" href="/assets/section-collection.css">';

async function open(page, base, onSection) {
  const requests = [];
  await page.route('**/collections/all**', (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get('section_id') === 'main') {
      requests.push(url);
      return route.fulfill({ contentType: 'text/html', body: onSection(url) });
    }
    return route.fulfill({ contentType: 'text/html', body: shell(section(), { head, modules: ['facets.js'] }) });
  });
  await page.goto(`${base}/collections/all`);
  await page.waitForFunction(() => customElements.get('collection-results'));
  return requests;
}

const filtered = (url) =>
  url.searchParams.get('page') === '2'
    ? section({ items: 2, next: false })
    : section({ countText: '1 product', showText: 'Show 1 result', redCount: 1, redChecked: url.searchParams.getAll('filter.v.option.color').includes('Red'), items: 1, next: false, chips: '<a class="active-facets__chip" href="/collections/all?sort_by=manual" data-facet-link id="chip">Color: Red</a>' });

export const tests = {
  async 'checking a filter re-renders results through Section Rendering and updates the URL'({ page, base, expect, eventually }) {
    const requests = await open(page, base, filtered);
    await page.click('label[for="f-red"]');
    await eventually(() => document.querySelector('[data-product-count]').textContent === '1 product', 'count updated');
    expect(requests.length, 'one request').toBe(1);
    expect(requests[0].searchParams.getAll('filter.v.option.color').join(','), 'filter param').toBe('Red');
    expect(requests[0].searchParams.has('filter.v.price.gte'), 'empty price inputs are dropped').toBe(false);
    expect(requests[0].searchParams.get('sort_by'), 'sort select joins through its form attribute').toBe('manual');
    const search = await page.evaluate(() => [...new URLSearchParams(location.search)].map(([k, v]) => `${k}=${v}`).sort().join('&'));
    expect(search, 'URL keeps the filters and sort, without section_id').toBe('filter.v.option.color=Red&sort_by=manual');
    expect(await page.$$eval('[data-product-grid] > li', (l) => l.length), 'grid swapped').toBe(1);
    expect(await page.$eval('#f-red', (i) => i.checked), 'filter stays checked').toBe(true);
    expect(await page.$eval('[data-facet="filter.v.option.color"] .facet__value-count', (n) => n.textContent), 'counts refreshed').toBe('(1)');
    expect(await page.$eval('[data-facets-show]', (n) => n.textContent), 'drawer button count').toBe('Show 1 result');
  },

  async 'sorting, chips and the back button re-render in place'({ page, base, expect, eventually }) {
    const requests = await open(page, base, filtered);
    await page.selectOption('#sort', 'price-ascending');
    await eventually(() => location.search.includes('sort_by=price-ascending'), 'sort in URL');
    await page.click('#chip');
    await eventually(() => location.search === '?sort_by=manual', 'chip URL pushed');
    expect(requests.length, 'two renders').toBe(2);
    await page.goBack();
    await eventually(() => location.search.includes('price-ascending'), 'back restores the previous URL');
    // The grid already shows one item, so wait for the popstate request itself.
    for (let i = 0; i < 60 && requests.length < 3; i++) await page.waitForTimeout(50);
    expect(requests.length, 'popstate fetched once more').toBe(3);
    expect(requests[2].searchParams.get('sort_by'), 'popstate renders the restored URL').toBe('price-ascending');
  },

  async 'the filter drawer holds the same form while open'({ page, base, expect, eventually }) {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, base, filtered);
    await page.click('#toggle');
    await eventually(() => document.getElementById('FacetsDrawer-main').open, 'drawer open');
    await eventually(() => !!document.querySelector('[data-facets-slot] [data-facets-form]'), 'form moved into the drawer');
    expect(await page.$$eval('form[data-facets-form]', (f) => f.length), 'one form in the DOM').toBe(1);
    await page.click('#close-drawer');
    await eventually(() => !!document.querySelector('[data-facets-home] [data-facets-form]'), 'form moved back');
  },

  async '"Show more" reveals extra values and "Load more" appends the next page'({ page, base, expect, eventually }) {
    const requests = await open(page, base, filtered);
    expect(await page.$eval('#extra', (li) => getComputedStyle(li).display), 'extra value hidden').toBe('none');
    await page.click('[data-facet-more]');
    expect(await page.$eval('#extra', (li) => getComputedStyle(li).display), 'extra value shown').toBe('list-item');
    expect(await page.$eval('[data-facet-more]', (b) => b.getAttribute('aria-expanded')), 'expanded').toBe('true');
    await page.click('[data-load-more]');
    await eventually(() => document.querySelectorAll('[data-product-grid] > li').length === 5, 'next page appended');
    expect(requests[0].searchParams.get('page'), 'page 2 requested').toBe('2');
    expect(await page.$$eval('[data-load-more]', (l) => l.length), 'last page removes the button').toBe(0);
    expect(await page.evaluate(() => document.activeElement.getAttribute('href')), 'focus moves to the first new product').toBe('/products/p0');
  },

  async 'layout toggle switches grid and list'({ page, base, expect }) {
    await open(page, base, filtered);
    await page.click('#list');
    expect(await page.$eval('[data-product-grid]', (g) => g.dataset.layout), 'list layout').toBe('list');
    expect(await page.$eval('#list', (b) => b.getAttribute('aria-pressed')), 'pressed').toBe('true');
    expect(await page.$eval('#grid', (b) => b.getAttribute('aria-pressed')), 'other released').toBe('false');
  }
};
