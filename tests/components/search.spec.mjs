// Search drawer (search.js): predictive search request, ARIA combobox keyboard support,
// Escape behaviour and the optional product type filter.
import { shell } from './fixtures/shell.mjs';

const drawer = `
<button type="button" data-open-dialog="SearchDrawer" id="open-search">Search</button>
<dialog id="SearchDrawer" class="drawer drawer--top" aria-label="Search" data-light-dismiss>
  <div class="drawer__panel search-drawer">
    <form action="/search" method="get" role="search" class="search-drawer__form" data-predictive-limit="4" data-predictive-fields="title,variants.sku" data-prompts='["Search dresses","Search bags"]' data-prompts-mobile="false">
      <div class="search-drawer__field">
        <label class="visually-hidden" for="q">Search</label>
        <input id="q" class="search-drawer__input" type="search" name="q" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="PredictiveResults" aria-autocomplete="list">
        <input type="hidden" name="options[prefix]" value="last">
        <select id="type" data-type-filter><option value="">All</option><option value="Dresses">Dresses</option></select>
      </div>
      <div id="PredictiveResults" data-predictive-results aria-live="polite"></div>
    </form>
  </div>
</dialog>`;

const suggestions = (q) => `<div id="shopify-section-predictive-search"><div data-predictive-content>
  <p class="visually-hidden" data-predictive-status role="status">3 suggestions</p>
  <div class="predictive" id="PredictiveListbox" role="listbox" aria-label="Suggestions">
    <div role="group" aria-labelledby="h1"><p id="h1">Suggestions</p><ul role="presentation">
      <li role="option" id="opt-1" aria-selected="false"><a href="/search?q=${q}+dress" tabindex="-1">${q} dress</a></li>
    </ul></div>
    <div role="group" aria-labelledby="h2"><p id="h2">Products</p><ul role="presentation">
      <li role="option" id="opt-2" aria-selected="false"><a href="/products/linen-dress" tabindex="-1">Linen dress</a></li>
    </ul></div>
    <div role="option" id="opt-all" aria-selected="false"><a href="/search?q=${q}" tabindex="-1">Search for “${q}”</a></div>
  </div>
</div></div>`;

async function open(page, base) {
  const requests = [];
  await page.route('**/search/suggest**', (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    route.fulfill({ contentType: 'text/html', body: suggestions(url.searchParams.get('q')) });
  });
  await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(drawer, { modules: ['search.js'], head: "<script>window.Weft.routes.predictiveSearch = '/search/suggest';</script>" }) }));
  await page.goto(`${base}/fixture.html`);
  await page.click('#open-search');
  await page.waitForFunction(() => document.getElementById('SearchDrawer').open && document.querySelector('.search-drawer__form').dataset.bound === '1');
  return requests;
}

export const tests = {
  async 'typing requests predictive results with the theme settings'({ page, base, expect, eventually }) {
    const requests = await open(page, base);
    await page.fill('#q', 'lin');
    await eventually(() => !!document.querySelector('#PredictiveListbox'), 'results inserted');
    const url = requests.at(-1);
    expect(url.searchParams.get('q'), 'terms').toBe('lin');
    expect(url.searchParams.get('section_id'), 'section').toBe('predictive-search');
    expect(url.searchParams.get('resources[limit]'), 'limit from settings').toBe('4');
    expect(url.searchParams.get('resources[options][fields]'), 'fields from settings').toBe('title,variants.sku');
    expect(url.searchParams.get('resources[type]'), 'types').toBe('query,product,collection,page,article');
    expect(await page.$eval('#q', (i) => i.getAttribute('aria-expanded')), 'expanded').toBe('true');
    await page.fill('#q', '');
    await eventually(() => document.querySelector('#q').getAttribute('aria-expanded') === 'false', 'clearing closes results');
  },

  async 'arrow keys move through options and Escape closes results before the drawer'({ page, base, expect, eventually }) {
    await open(page, base);
    await page.fill('#q', 'lin');
    await eventually(() => !!document.querySelector('#PredictiveListbox'), 'results inserted');
    await page.keyboard.press('ArrowDown');
    expect(await page.$eval('#q', (i) => i.getAttribute('aria-activedescendant')), 'first option').toBe('opt-1');
    await page.keyboard.press('ArrowDown');
    expect(await page.$eval('#opt-2', (o) => o.getAttribute('aria-selected')), 'second option selected').toBe('true');
    expect(await page.$eval('#opt-1', (o) => o.getAttribute('aria-selected')), 'first deselected').toBe('false');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    expect(await page.$eval('#q', (i) => i.getAttribute('aria-activedescendant')), 'wraps to the last option').toBe('opt-all');
    await page.keyboard.press('Escape');
    expect(await page.$eval('#q', (i) => i.getAttribute('aria-expanded')), 'results closed').toBe('false');
    expect(await page.$eval('#SearchDrawer', (d) => d.open), 'drawer still open').toBe(true);
    expect(await page.evaluate(() => document.activeElement.id), 'focus stays in the field').toBe('q');
  },

  async 'Enter on an active option follows its link'({ page, base, expect, eventually }) {
    await page.route('**/products/linen-dress', (r) => r.fulfill({ contentType: 'text/html', body: '<title>Linen dress</title>' }));
    await open(page, base);
    await page.fill('#q', 'lin');
    await eventually(() => !!document.querySelector('#PredictiveListbox'), 'results inserted');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForURL('**/products/linen-dress');
    expect(new URL(page.url()).pathname, 'navigated').toBe('/products/linen-dress');
  },

  async 'product type filter only joins the form when a type is chosen'({ page, base, expect }) {
    await open(page, base);
    expect(await page.$eval('#type', (s) => s.hasAttribute('name')), 'no name for All').toBe(false);
    await page.selectOption('#type', 'Dresses');
    expect(await page.$eval('#type', (s) => s.getAttribute('name')), 'named filter').toBe('filter.p.product_type');
  }
};
