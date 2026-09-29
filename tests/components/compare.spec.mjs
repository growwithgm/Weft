// Product compare (compare.js): selection with a maximum, stored per viewer, the compare bar,
// the table built from compare-column sections, and sync for cards added later.
import { shell } from './fixtures/shell.mjs';

const card = (handle) => `<div class="card"><label class="card__compare"><input type="checkbox" data-compare-toggle value="${handle}" id="cmp-${handle}"><span>Compare</span></label></div>`;

const drawer = `
<compare-drawer data-max="2" data-width="medium" data-show-empty="false" data-empty="–">
  <script type="application/json" data-compare-strings>{"countOne": "__n__ product selected", "countOther": "__n__ products selected", "limit": "You can compare up to __n__ products.", "remove": "Remove __title__", "caption": "Compare products", "error": "Error"}</script>
  <div class="compare-bar" data-compare-bar role="region" aria-label="Compare products" hidden>
    <p data-compare-count></p>
    <button type="button" data-compare-clear id="clear">Clear</button>
    <button type="button" data-compare-open id="compare" disabled>Compare</button>
    <p role="alert" data-compare-notice id="notice"></p>
  </div>
  <dialog id="CompareDrawer" class="drawer drawer--bottom" aria-labelledby="t"><div class="drawer__panel"><h2 id="t">Compare products</h2><div data-compare-table></div></div></dialog>
</compare-drawer>`;

const column = (handle, title, { vendor = '', material = '' } = {}) => `<div id="shopify-section-compare-column"><div data-compare-column data-handle="${handle}" data-title="${title}">
  <div data-compare-head><a href="/products/${handle}">${title}</a></div>
  <div data-row="price" data-label="Price">€${handle === 'a' ? '10.00' : '12.00'}</div>
  <div data-row="vendor" data-label="Brand">${vendor}</div>
  <div data-row="sku" data-label="SKU"></div>
  <div data-row="mf-custom-material" data-label="Material">${material}</div>
</div></div>`;

async function open(page, base, { cards = ['a', 'b', 'c'], stored } = {}) {
  await page.route('**/products/a?section_id=compare-column', (r) => r.fulfill({ contentType: 'text/html', body: column('a', 'Linen shirt', { vendor: 'Weft', material: 'Linen' }) }));
  await page.route('**/products/b?section_id=compare-column', (r) => r.fulfill({ contentType: 'text/html', body: column('b', 'Cotton shirt', { vendor: '' }) }));
  const head = stored ? `<script>localStorage.setItem('weft:compare', ${JSON.stringify(JSON.stringify(stored))});</script>` : '<script>localStorage.removeItem("weft:compare");</script>';
  await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(`<div id="grid">${cards.map(card).join('')}</div>${drawer}`, { head, modules: ['compare.js'] }) }));
  await page.goto(`${base}/fixture.html`);
  await page.waitForFunction(() => customElements.get('compare-drawer'));
}

export const tests = {
  async 'ticking cards fills the compare bar up to the maximum'({ page, base, expect }) {
    await open(page, base);
    await page.check('#cmp-a');
    expect(await page.$eval('[data-compare-bar]', (b) => b.hidden), 'bar shown').toBe(false);
    expect(await page.$eval('[data-compare-count]', (n) => n.textContent), 'count').toBe('1 product selected');
    expect(await page.$eval('#compare', (b) => b.disabled), 'needs two products').toBe(true);
    await page.check('#cmp-b');
    expect(await page.$eval('#compare', (b) => b.disabled), 'enabled at two').toBe(false);
    await page.click('#cmp-c');
    expect(await page.$eval('#cmp-c', (i) => i.checked), 'third refused').toBe(false);
    expect(await page.$eval('#notice', (n) => n.textContent), 'limit message').toBe('You can compare up to 2 products.');
    expect(await page.evaluate(() => localStorage.getItem('weft:compare')), 'stored per viewer').toBe('["a","b"]');
    await page.click('#clear');
    expect(await page.$eval('[data-compare-bar]', (b) => b.hidden), 'clear hides the bar').toBe(true);
    expect(await page.$eval('#cmp-a', (i) => i.checked), 'clear unticks cards').toBe(false);
  },

  async 'the table lines up rows from each product and hides rows without data'({ page, base, expect, eventually }) {
    await open(page, base, { stored: ['a', 'b'] });
    await page.click('#compare');
    await eventually(() => !!document.querySelector('.compare-table'), 'table built');
    const headers = await page.$$eval('.compare-table thead th', (t) => t.map((x) => x.querySelector('a').textContent));
    expect(headers.join(','), 'one column per product').toBe('Linen shirt,Cotton shirt');
    const rows = await page.$$eval('.compare-table tbody th', (t) => t.map((x) => x.textContent));
    expect(rows.join(','), 'empty SKU row hidden').toBe('Price,Brand,Material');
    const brand = await page.$$eval('.compare-table tbody tr:nth-child(2) td', (t) => t.map((x) => x.textContent));
    expect(brand.join(','), 'missing value shows the empty text').toBe('Weft,–');
    await page.click('[data-compare-remove="b"]');
    await eventually(() => document.querySelectorAll('.compare-table thead th').length === 1, 'removed from the table');
    expect(await page.evaluate(() => localStorage.getItem('weft:compare')), 'removed from storage').toBe('["a"]');
  },

  async 'stored products tick cards on load and on cards added later'({ page, base, expect, eventually }) {
    await open(page, base, { cards: ['a'], stored: ['a', 'b'] });
    expect(await page.$eval('#cmp-a', (i) => i.checked), 'ticked on load').toBe(true);
    await page.evaluate((html) => document.getElementById('grid').insertAdjacentHTML('beforeend', html), card('b'));
    await eventually(() => document.getElementById('cmp-b').checked, 'new card ticked');
  }
};
