// Wholesale ordering (matrix.js): order matrix, quick order list and the one-size buy box.
import { shell } from './fixtures/shell.mjs';

const strings = `<script type="application/json" data-matrix-strings>{
  "belowMin": "Below minimum (__n__)", "rounded": "__line__ rounded to __n__ (packs of __m__)", "capped": "__line__ set to __n__, the most available",
  "inCart": "In cart: __n__", "each": "__price__ each", "maxHint": "Max __n__",
  "attentionOne": "__n__ line needs attention", "attentionOther": "__n__ lines need attention",
  "piecesOne": "__n__ piece", "piecesOther": "__n__ pieces", "linesOne": "__n__ line", "linesOther": "__n__ lines",
  "addOne": "Add __n__ piece to cart", "addOther": "Add __n__ pieces to cart",
  "addedOne": "__n__ piece added to your cart.", "addedOther": "__n__ pieces added to your cart.",
  "rejected": "1 line wasn’t added: __line__. See the message on that line.", "adding": "Adding…", "filterEmpty": "No items match your filter."
}</script>`;

const cell = ({ id, label, col = '', min = 1, step = 1, max = '', tracked = false, available = 0, inCart = 0, price = 1000, breaks = [], disabled = false, line = false }) => `
<div class="matrix__cell" data-cell data-variant-id="${id}" data-min="${min}" data-step="${step}" ${max ? `data-max="${max}"` : ''} data-tracked="${tracked}" data-available="${available}" data-in-cart="${inCart}" data-price="${price}" data-breaks='${JSON.stringify(breaks)}' data-label="${label}">
  <span class="matrix__cell-label">${col}</span>
  <div class="quantity quantity--small matrix__stepper">
    <button type="button" class="quantity__button" data-step="-1" tabindex="-1" aria-label="Decrease ${label}" disabled>-</button>
    <input class="quantity__input matrix__input" type="number" id="c${id}" name="updates[${id}]" value="${inCart}" min="0" step="${step}" data-cell-input ${disabled ? 'disabled' : ''}>
    <button type="button" class="quantity__button" data-step="1" tabindex="-1" aria-label="Increase ${label}" ${disabled ? 'disabled' : ''}>+</button>
  </div>
  <label class="visually-hidden" for="c${id}">${label}</label>
  <span class="matrix__hint">Available</span>
  ${line ? '<span class="quick-order__line" data-cell-line></span>' : ''}
  <span class="matrix__note" data-cell-note></span>
  <span class="matrix__error" role="alert" data-cell-error hidden></span>
</div>`;

const summary = `
<div class="matrix__summary" data-matrix-summary>
  <span data-summary-line></span> <strong data-summary-subtotal></strong>
  <ul class="matrix__messages" data-summary-messages></ul>
  <button type="button" data-matrix-clear>Clear</button>
  <button type="submit" data-matrix-add disabled>Add</button>
</div>`;

const matrix = `
<order-matrix class="matrix" id="matrix">
  ${strings}
  <form action="/cart/update" method="post" data-matrix-form novalidate>
    <div class="matrix__table">
      <div class="matrix__row" data-row data-open>
        <div class="matrix__row-head" data-row-head><span>Black</span><span data-row-total>0</span><span data-row-flag hidden>Needs attention</span></div>
        <div class="matrix__cells">
          ${cell({ id: 1, label: 'Black S', col: 'S', min: 6, step: 6 })}
          ${cell({ id: 2, label: 'Black M', col: 'M', tracked: true, available: 10 })}
        </div>
      </div>
      <div class="matrix__row" data-row data-open>
        <div class="matrix__row-head" data-row-head><span>White</span><span data-row-total>0</span><span data-row-flag hidden>Needs attention</span></div>
        <div class="matrix__cells">
          ${cell({ id: 3, label: 'White S', col: 'S', disabled: true })}
          ${cell({ id: 4, label: 'White M', col: 'M', min: 6, step: 2, inCart: 4, breaks: [{ minimum_quantity: 12, price: 800 }] })}
        </div>
      </div>
    </div>
    ${summary}
  </form>
</order-matrix>`;

const quickOrder = `
<order-matrix class="matrix quick-order__list" data-static-rows id="quick">
  ${strings}
  <input type="search" data-quick-filter id="filter" aria-label="Filter">
  <p data-quick-empty hidden></p>
  <form action="/cart/update" method="post" data-matrix-form novalidate>
    <div class="quick-order__group" data-group id="g-tee">
      <a href="/products/tee">Tee</a>
      <div class="quick-order__row" data-row data-search="tee black tee-blk">${cell({ id: 11, label: 'Tee – Black', line: true })}</div>
      <div class="quick-order__row" data-row data-search="tee white tee-wht">${cell({ id: 12, label: 'Tee – White', line: true })}</div>
    </div>
    <div class="quick-order__group" data-group id="g-cap">
      <a href="/products/cap">Cap</a>
      <div class="quick-order__row" data-row data-search="cap default cap-01">${cell({ id: 13, label: 'Cap', line: true, breaks: [{ minimum_quantity: 2, price: 700 }] })}</div>
    </div>
    ${summary}
  </form>
</order-matrix>`;

const buyBox = `
<wholesale-quantity class="wholesale-qty" data-min="6" data-step="6" data-tracked="false" data-available="0" data-in-cart="0" data-price="1000" data-breaks='[{"minimum_quantity":12,"price":800}]'>
  <script type="application/json" data-qty-strings>{"line": "__q__ × __price__ = __total__", "belowMin": "Below minimum (__n__)", "notMultiple": "__q__ isn’t a multiple of __m__. Use __a__ or __b__.", "notMultipleOne": "__q__ isn’t a multiple of __m__. Use __b__.", "onlyMore": "Only __n__ more can be added.", "addOne": "Add __n__ piece to cart", "addOther": "Add __n__ pieces to cart"}</script>
  <p class="wholesale-qty__hint wholesale-qty__hint--ok">Available</p>
  <form data-product-form>
    <input type="number" name="quantity" id="qty" value="6" min="6" step="6">
    <p data-line-total></p>
    <div data-form-error hidden><span data-form-error-text></span></div>
    <button type="submit" data-add-button><span data-add-label>Add</span></button>
  </form>
</wholesale-quantity>`;

const head = `<link rel="stylesheet" href="/assets/component-matrix.css">
<script>Object.assign(window.Weft, { moneyFormat: '€{{amount}}' }); window.Weft.routes.cartAdd = '/cart/add'; window.Weft.settings.afterAdd = 'none';</script>`;

async function open(page, base, body) {
  await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(`${body}<span data-cart-count hidden>0</span>`, { head, modules: ['matrix.js'] }) }));
  await page.goto(`${base}/fixture.html`);
  await page.waitForFunction(() => customElements.get('order-matrix') && customElements.get('wholesale-quantity'));
}

const value = (page, id) => page.$eval(`#c${id}`, (i) => i.value);
const messages = (page, root = '#matrix') => page.$$eval(`${root} [data-summary-messages] li`, (lis) => lis.map((li) => li.textContent));
const typeInto = async (page, id, text) => {
  await page.fill(`#c${id}`, text);
  await page.$eval(`#c${id}`, (i) => i.blur());
};

export const tests = {
  async 'steppers follow each cell’s rule, in-cart count and stock cap'({ page, base, expect }) {
    await open(page, base, matrix);
    const plus = (id) => page.click(`[data-variant-id="${id}"] [data-step="1"]`);
    const minus = (id) => page.click(`[data-variant-id="${id}"] [data-step="-1"]`);
    await plus(1);
    expect(await value(page, 1), 'first step jumps to the minimum').toBe('6');
    await plus(1);
    expect(await value(page, 1), 'then one pack').toBe('12');
    await minus(1);
    await minus(1);
    expect(await value(page, 1), 'minimum steps back to 0').toBe('0');
    await plus(4);
    expect(await value(page, 4), 'in-cart 4 of min 6 needs 2 more').toBe('2');
    expect(await page.$eval('[data-variant-id="4"] [data-cell-note]', (n) => n.textContent), 'in-cart note').toContain('In cart: 4');
    await typeInto(page, 2, '25');
    expect(await value(page, 2), 'capped at stock').toBe('10');
    expect((await messages(page)).join(' | '), 'capped note').toContain('Black M set to 10, the most available');
    expect(await page.$eval('[data-variant-id="2"] [data-step="1"]', (b) => b.disabled), 'plus disabled at the cap').toBe(true);
    expect(await page.$eval('[data-variant-id="3"] [data-step="1"]', (b) => b.disabled), 'sold-out cell stays disabled').toBe(true);
  },

  async 'typed values round to the pack size and below-minimum lines block Add'({ page, base, expect }) {
    await open(page, base, matrix);
    await typeInto(page, 1, '7');
    expect(await value(page, 1), 'rounded up to the pack').toBe('12');
    expect((await messages(page)).join(' | '), 'rounding note').toContain('Black S rounded to 12 (packs of 6)');
    await typeInto(page, 4, '1');
    expect(await value(page, 4), 'below-minimum value is kept').toBe('1');
    expect(await page.$eval('[data-variant-id="4"] [data-cell-error]', (e) => e.textContent), 'inline flag').toBe('Below minimum (6)');
    expect(await page.$eval('#c4', (i) => i.getAttribute('aria-invalid')), 'aria-invalid').toBe('true');
    expect((await messages(page)).join(' | '), 'summary flag').toContain('1 line needs attention');
    expect(await page.$eval('[data-matrix-add]', (b) => b.disabled), 'Add disabled').toBe(true);
    await typeInto(page, 4, '2');
    expect(await page.$eval('[data-matrix-add]', (b) => b.disabled), 'fixing the line enables Add').toBe(false);
    expect(await page.$eval('[data-matrix-add]', (b) => b.textContent), 'label counts pieces').toBe('Add 14 pieces to cart');
  },

  async 'summary shows pieces, lines and a tier-aware subtotal'({ page, base, expect }) {
    await open(page, base, matrix);
    await typeInto(page, 1, '6');
    await typeInto(page, 4, '8');
    expect(await page.$eval('[data-summary-line]', (n) => n.textContent), 'pieces and lines').toBe('14 pieces, 2 lines');
    // 6 × €10.00 + 8 × €8.00 (4 in cart + 8 reaches the 12+ break)
    expect(await page.$eval('[data-summary-subtotal]', (n) => n.textContent), 'subtotal').toBe('€124.00');
    expect(await page.$eval('[data-variant-id="4"] [data-cell-note]', (n) => n.textContent), 'break price note').toContain('€8.00 each');
    const totals = await page.$$eval('[data-row-total]', (n) => n.map((x) => x.textContent).join(','));
    expect(totals, 'row totals').toBe('6,8');
    await page.click('[data-matrix-clear]');
    expect(await page.$eval('[data-summary-subtotal]', (n) => n.textContent), 'clear resets').toBe('€0.00');
  },

  async 'keyboard arrows and Enter move across the grid and skip unavailable cells'({ page, base, expect }) {
    await open(page, base, matrix);
    const active = () => page.evaluate(() => document.activeElement.id);
    await page.focus('#c1');
    await page.keyboard.press('ArrowRight');
    expect(await active(), 'right').toBe('c2');
    await page.keyboard.press('ArrowDown');
    expect(await active(), 'down').toBe('c4');
    await page.keyboard.press('ArrowLeft');
    expect(await active(), 'left stops at a sold-out cell').toBe('c4');
    await page.focus('#c2');
    await page.keyboard.press('Enter');
    expect(await active(), 'Enter wraps to the next row and skips sold out').toBe('c4');
  },

  async 'adding several lines checks Shopify’s result per line'({ page, base, expect }) {
    let posted = null;
    await page.route('**/cart/add.js', (r) => {
      posted = JSON.parse(r.request().postData());
      r.fulfill({ contentType: 'application/json', body: JSON.stringify({ items: [] }) });
    });
    await page.route('**/cart.js', (r) =>
      r.fulfill({ contentType: 'application/json', body: JSON.stringify({ item_count: 11, items: [{ variant_id: 1, quantity: 6 }, { variant_id: 2, quantity: 1 }, { variant_id: 4, quantity: 4 }] }) })
    );
    await open(page, base, matrix);
    await typeInto(page, 1, '6');
    await typeInto(page, 2, '3');
    await page.click('[data-matrix-add]');
    await page.waitForFunction(() => document.querySelector('[data-cart-count]').textContent === '11');
    expect(JSON.stringify(posted.items), 'one request with every line').toBe('[{"id":1,"quantity":6},{"id":2,"quantity":3}]');
    expect(await value(page, 1), 'added line resets').toBe('0');
    expect(await value(page, 2), 'rejected part stays').toBe('2');
    expect(await page.$eval('[data-variant-id="2"] [data-cell-error]', (e) => e.textContent), 'inline message on the line').toBe('Black M set to 1, the most available');
    const msgs = (await messages(page)).join(' | ');
    expect(msgs, 'success summary').toContain('7 pieces added to your cart.');
    expect(msgs, 'rejected summary').toContain('1 line wasn’t added: Black M.');
    expect(await page.$eval('[data-variant-id="2"]', (c) => c.dataset.inCart), 'in-cart count follows Shopify').toBe('1');
  },

  async 'quick order list filters rows by name or SKU and shows line totals'({ page, base, expect, eventually }) {
    await open(page, base, quickOrder);
    await page.click('[data-variant-id="13"] [data-step="1"]');
    await page.click('[data-variant-id="13"] [data-step="1"]');
    expect(await page.$eval('[data-variant-id="13"] [data-cell-line]', (n) => n.textContent), 'line total at the 2+ break').toBe('€14.00');
    await page.fill('#filter', 'tee wht');
    await eventually(() => document.querySelector('[data-search="tee black tee-blk"]').hidden, 'non-matching row hidden');
    expect(await page.$eval('[data-search="tee white tee-wht"]', (r) => r.hidden), 'matching row shown').toBe(false);
    expect(await page.$eval('#g-cap', (g) => g.hidden), 'group without matches hidden').toBe(true);
    await page.fill('#filter', 'zzz');
    await eventually(() => !document.querySelector('[data-quick-empty]').hidden, 'empty message shown');
    expect(await page.$eval('[data-quick-empty]', (p) => p.textContent), 'empty text').toBe('No items match your filter.');
    expect(await page.$eval('[data-summary-line]', (n) => n.textContent), 'hidden rows keep their amounts').toBe('2 pieces, 1 line');
    await page.fill('#filter', '');
    await page.focus('#c11');
    await page.keyboard.press('ArrowDown');
    expect(await page.evaluate(() => document.activeElement.id), 'down moves to the next variant row').toBe('c12');
  },

  async 'one-size buy box shows the live line total and rule errors'({ page, base, expect, eventually }) {
    await open(page, base, buyBox);
    await eventually(() => document.querySelector('[data-line-total]').textContent !== '', 'line total rendered');
    expect(await page.$eval('[data-line-total]', (n) => n.textContent), 'base price').toBe('6 × €10.00 = €60.00');
    await page.fill('#qty', '12');
    await page.$eval('#qty', (i) => i.dispatchEvent(new Event('change', { bubbles: true })));
    expect(await page.$eval('[data-line-total]', (n) => n.textContent), 'break price from 12').toBe('12 × €8.00 = €96.00');
    await page.fill('#qty', '7');
    await page.$eval('#qty', (i) => i.dispatchEvent(new Event('change', { bubbles: true })));
    expect(await page.$eval('[data-form-error-text]', (n) => n.textContent), 'not a multiple').toBe('7 isn’t a multiple of 6. Use 6 or 12.');
    expect(await page.$eval('[data-add-button]', (b) => b.disabled), 'Add disabled while invalid').toBe(true);
  }
};
