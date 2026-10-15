// Product card quick add and swatches (snippets/product-card, card-title, card-options, card-quick-add).
// The markup below mirrors the Liquid output for a sized product and a one-size product.
import { shell } from './fixtures/shell.mjs';

const bag = '<svg class="icon icon--bag" aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>';
const close = '<svg class="icon icon--close" aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>';

/**
 * One card. colors: [[name, hex, variants ("id:available" per size, or one pair), image]];
 * sizes: size names (omit for one-size products); soldOut: sizes with no available variant.
 */
export function card({ n, name, details = '', price, colors = [], active = 0, sizes, soldOut = [], img = '', limit = 4, hover = true, icon = true }) {
  const id = `CardQuick-${n}`;
  const title = `CardTitle-${n}`;
  const color = colors[active];
  const pairs = color ? color[2].split(',') : [`${n}00:1`];
  const sized = Array.isArray(sizes) && sizes.length > 1;
  const multiColor = colors.length > 1;
  const sheet = sized || multiColor;
  const quickClass = `card__quick${hover ? ' card__quick--hover' : ''}${icon ? ' card__quick--icon' : ''}`;
  const sizeButtons = sized
    ? `<div class="card__quick-sizes">${sizes.map((s, i) => {
        const [vid, ok] = (pairs[i] || '').split(':');
        return `<button type="submit" name="id" value="${vid || ''}" class="card__quick-size" data-card-variant="${i}" aria-describedby="${title}"${ok === '1' ? '' : ' disabled'}>${s}<span class="visually-hidden" data-sold-out${ok === '1' ? ' hidden' : ''}>, Sold out</span></button>`;
      }).join('')}</div>`
    : `<button type="submit" name="id" value="${pairs[0].split(':')[0]}" class="card__quick-add" data-card-variant="0" aria-describedby="${title}">Add to cart · One size</button>`;
  const iconButton = !icon ? '' : sheet
    ? `<button type="button" class="card__quick-icon js-only" data-card-sheet aria-expanded="false" aria-controls="${id}-panel" aria-label="Quick add" aria-describedby="${title}">${bag}</button>`
    : `<button type="submit" name="id" value="${pairs[0].split(':')[0]}" class="card__quick-icon" data-card-variant="0" aria-label="Add to cart" aria-describedby="${title}">${bag}</button>`;
  const swatches = !multiColor ? '' : `<div class="card__colors"><ul class="card__swatches swatch-shape--circle" role="list" aria-label="Color">${colors.slice(0, limit).map(([cn, hex, variants, image], i) =>
    `<li><button type="button" class="card-swatch" data-card-pick data-name="${cn}" data-url="/products/p${n}?variant=${variants.split(':')[0]}" data-variants="${variants}"${image ? ` data-image="${image}"` : ''} aria-pressed="${i === active}" title="${cn}"><span class="card-swatch__dot" style="--swatch-color: ${hex}"></span><span class="visually-hidden">${cn}</span></button></li>`).join('')}${colors.length > limit ? `<li class="card__swatches-more muted">+${colors.length - limit}</li>` : ''}</ul><span class="card__color-name muted" data-card-color-name>${color[0]}</span></div>`;
  const chips = sized
    ? sizes.map((s) => (soldOut.includes(s) ? `<li class="card-size card-size--sold-out">${s}<span class="visually-hidden">, Sold out</span></li>` : `<li class="card-size">${s}</li>`)).join('')
    : '<li class="card-size">One size</li>';
  return `<li class="card card--ratio-elongated" data-product-card data-product-id="${n}">
  <div class="card__media-wrap">
    <a class="card__media media" href="/products/p${n}" tabindex="-1" aria-hidden="true">${img ? `<img class="card__image card__image--primary" src="${img}" alt="" width="600" height="840">` : '<span class="card__image card__image--primary" style="display:block;background:#d8d2c8"></span>'}</a>
    <div class="card__labels card__labels--top_start"></div>
    <form method="post" action="/cart/add" id="${id}" class="${quickClass}" data-card-form data-product-url="/products/p${n}"><input type="hidden" name="form_type" value="product">
      <div class="card__quick-panel" id="${id}-panel">
        <div class="card__quick-head"><p class="card__quick-label">${sized ? '<span class="card__quick-hint">Choose a size to add</span><span class="card__quick-option">Size</span>' : ''}${multiColor ? `<span class="card__quick-color" data-card-color-name>${color[0]}</span>` : ''}</p>${sheet ? `<button type="button" class="card__quick-close js-only" data-card-sheet aria-controls="${id}-panel" aria-label="Close">${close}</button>` : ''}</div>
        ${sizeButtons}
      </div>
      ${iconButton}
    </form>
  </div>
  <div class="card__body">
    <div class="card__head"><h3 class="card__title" id="${title}"><a class="card__link" href="/products/p${n}">${name}${details ? `<span class="visually-hidden"> – ${details}</span>` : ''}</a></h3><div class="card__price"><div class="price price--small"><span class="price__current">${price}</span></div></div></div>
    ${details ? `<p class="card__subtitle card__subtitle--details muted" aria-hidden="true">${details}</p>` : ''}
    ${swatches}
    <div class="card__sizes"><span class="card__sizes-label" aria-hidden="true">Size</span><ul class="card__size-list" role="list" aria-label="Size">${chips}</ul></div>
  </div>
</li>`;
}

export const sona = {
  n: 4, name: 'Sona', details: 'Cotton hand-embroidered tiered maxi', price: 'Rs. 10,000', sizes: ['S/M', 'M/L', 'L/XL'], soldOut: ['L/XL'],
  colors: [['Forest', '#1f3d33', '401:1,402:1,403:0'], ['Maroon', '#8c2a2a', '411:0,412:1,413:0'], ['Slate', '#2f4a4a', '421:1,422:1,423:0'], ['Midnight', '#23233a', '431:1,432:1,433:0'], ['Ruby', '#a3263a', '441:1,442:1,443:0']],
};
export const jumani = {
  n: 2, name: 'Jumani', details: 'Cotton hand-embroidered long dress', price: 'Rs. 8,000',
  colors: [['Black', '#1d1d1d', '201:1'], ['Navy', '#3b4f7a', '202:1'], ['Rose', '#e39aa8', '203:0']],
};
export const rasha = { n: 5, name: 'Rasha', details: 'Printed cotton dress with hand embroidery', price: 'Rs. 4,500' };
export const grid = (cards) => `<link rel="stylesheet" href="/assets/component-card.css"><div style="max-width:1320px;margin:0 auto;padding:24px 16px"><ul class="product-grid" role="list" style="--cols: 4">${cards.map(card).join('')}</ul></div>
<span data-cart-count hidden>0</span>
<dialog id="QuickAdd" class="drawer drawer--end"><div data-dialog-body><div data-quick-add-body></div></div></dialog>
<dialog id="CartDrawer" class="drawer drawer--end"><div data-dialog-body>Cart</div></dialog>`;

const head = "<script>Object.assign(window.Weft, { modules: { quickAdd: '/assets/quick-add.js', product: '/assets/product.js' } }); Object.assign(window.Weft.routes, { cartAdd: '/cart/add' }); window.Weft.settings.afterAdd = 'drawer';</script>";

async function open(page, base, cards) {
  const posted = [];
  await page.route('**/products/p*', (r) => r.fulfill({ contentType: 'text/html', body: '<product-section data-product-section></product-section>' }));
  await page.route('**/cart/add.js', (r) => {
    posted.push(new URLSearchParams(r.request().postData() || '').get('id') || r.request().postData());
    r.fulfill({ contentType: 'application/json', body: JSON.stringify({ id: 1, quantity: 1, product_title: 'Sona' }) });
  });
  await page.route('**/cart.js', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ item_count: 1, items: [] }) }));
  await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(grid(cards), { head }) }));
  await page.goto(`${base}/fixture.html`);
  return posted;
}

const sentId = (body) => {
  // multipart FormData: pull the value of the "id" field
  const m = /name="id"\r?\n\r?\n(\d*)/.exec(body);
  return m ? m[1] : body;
};

export const tests = {
  async 'hover shows the size buttons; a swatch re-points them; a size adds that variant'({ page, base, expect, eventually }) {
    const posted = await open(page, base, [sona]);
    const panel = '#CardQuick-4-panel';
    expect(await page.$eval(panel, (p) => getComputedStyle(p).transform !== 'none'), 'panel parked below the image').toBe(true);
    await page.hover('[data-product-card]');
    await eventually((sel) => getComputedStyle(document.querySelector(sel)).transform === 'none', 'panel slides up on hover', panel);
    expect(await page.$eval('[data-card-variant="2"]', (b) => b.disabled), 'sold-out size disabled').toBe(true);
    await page.click('[data-name="Maroon"]');
    expect(await page.$eval('[data-name="Maroon"]', (b) => b.getAttribute('aria-pressed')), 'swatch pressed').toBe('true');
    expect(await page.$eval('[data-name="Forest"]', (b) => b.getAttribute('aria-pressed')), 'previous swatch released').toBe('false');
    expect(await page.$eval('.card__color-name', (s) => s.textContent), 'color name follows').toBe('Maroon');
    expect(await page.$$eval('[data-card-variant]', (bs) => bs.map((b) => `${b.value}:${b.disabled ? 0 : 1}`).join(',')), 'buttons re-pointed').toBe('411:0,412:1,413:0');
    expect(await page.$eval('[data-card-variant="0"] [data-sold-out]', (s) => s.hidden), 'sold-out note shown').toBe(false);
    expect(await page.$eval('.card__link', (a) => new URL(a.href).search), 'link opens that color').toBe('?variant=411');
    await page.click('[data-card-variant="1"]');
    await eventually(() => document.getElementById('CartDrawer').open, 'cart drawer opens');
    expect(sentId(posted[0]), 'the clicked size was added').toBe('412');
  },

  async 'touch screens: the bag icon opens the size sheet; Escape closes it; one-size icons add straight away'({ page, base, expect, eventually }) {
    await page.setViewportSize({ width: 390, height: 844 });
    const posted = await open(page, base, [sona, jumani, rasha]);
    expect(await page.$eval('#CardQuick-4-panel', (p) => getComputedStyle(p).display), 'sheet hidden').toBe('none');
    await page.click('#CardQuick-4 .card__quick-icon');
    await eventually(() => document.getElementById('CardQuick-4').classList.contains('is-open'), 'sheet open');
    expect(await page.$eval('#CardQuick-4 .card__quick-icon', (b) => b.getAttribute('aria-expanded')), 'expanded state').toBe('true');
    expect(await page.evaluate(() => document.activeElement.value), 'focus on the first size').toBe('401');
    await page.keyboard.press('Escape');
    await eventually(() => !document.getElementById('CardQuick-4').classList.contains('is-open'), 'Escape closes the sheet');
    expect(await page.evaluate(() => document.activeElement.classList.contains('card__quick-icon')), 'focus back on the icon').toBe(true);
    expect(await page.$eval('.card-swatch', (b) => getComputedStyle(b.closest('ul')).pointerEvents), 'dots are display-only on narrow cards').toBe('none');
    await page.click('#CardQuick-4 .card__quick-icon');
    await page.click('#CardQuick-4 [data-card-variant="1"]');
    await eventually(() => document.getElementById('CartDrawer').open, 'added from the sheet');
    expect(sentId(posted[0]), 'size from the sheet').toBe('402');
    expect(await page.$eval('#CardQuick-4', (f) => f.classList.contains('is-open')), 'sheet closes after adding').toBe(false);
    await page.evaluate(() => document.getElementById('CartDrawer').close());
    await page.click('#CardQuick-5 .card__quick-icon');
    await eventually(() => document.getElementById('CartDrawer').open, 'one color, one size: the icon adds straight away');
    expect(sentId(posted[1]), 'the only variant').toBe('500');
  },
};
