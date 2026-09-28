// Product section: variant change via Section Rendering, add to cart, inline errors, rules stepper.
import { shell } from './fixtures/shell.mjs';

const section = ({ variantId, price, label = 'Add to cart', disabled = false, selected = 'S', min = 1, step = 1, max = '' }) => `
<div id="shopify-section-main">
<product-section class="section product" data-product-section data-section-id="main" data-product-url="/products/tunic">
  <div class="product__info">
    <script type="application/json" data-product-state data-swap="state-main">{"variantId": ${variantId}, "available": ${!disabled}, "title": "Tunic", "featuredMediaId": null}</script>
    <div class="product-price" data-swap="price1"><div class="price"><span class="price__current">${price}</span></div></div>
    <div class="variant-picker" data-variant-picker data-swap="picker1" data-section-id="main" data-product-url="/products/tunic">
      <fieldset class="variant-picker__option">
        <legend>Size: <strong data-selected-value>${selected}</strong></legend>
        <input type="radio" class="visually-hidden" id="main-picker1-1-0" name="main-picker1-1" value="S" data-option-value-id="101" ${selected === 'S' ? 'checked' : ''}><label class="option-button" for="main-picker1-1-0">S</label>
        <input type="radio" class="visually-hidden" id="main-picker1-1-1" name="main-picker1-1" value="M" data-option-value-id="102" ${selected === 'M' ? 'checked' : ''}><label class="option-button" for="main-picker1-1-1">M</label>
      </fieldset>
    </div>
    <div class="buy-buttons" data-swap="buy1">
      <form method="post" action="/cart/add" id="ProductForm-main" data-product-form novalidate>
        <input type="hidden" name="id" value="${variantId}" data-variant-input data-js-enable disabled>
        <div class="form-message form-message--error" role="alert" data-form-error hidden><span data-form-error-text></span></div>
        <div class="buy-buttons__row" data-main-button-row>
          <quantity-input class="quantity" data-quantity data-min="${min}" data-step="${step}" ${max ? `data-max="${max}"` : ''}>
            <button type="button" class="quantity__button" data-quantity-step="-1" aria-label="Decrease">-</button>
            <input class="quantity__input" type="number" id="Quantity-main" name="quantity" value="${min}" min="${min}" step="${step}">
            <button type="button" class="quantity__button" data-quantity-step="1" aria-label="Increase">+</button>
          </quantity-input>
          <button type="submit" name="add" class="button" data-add-button data-label-adding="Adding…" data-label-added="Added" ${disabled ? 'disabled' : ''}><span data-add-label>${label}</span></button>
        </div>
      </form>
    </div>
  </div>
</product-section>
</div>`;

const page = (opts) => shell(`${section(opts)}<span data-cart-count hidden>0</span><dialog id="CartDrawer"><div data-dialog-body>Drawer</div></dialog>`, { head: '<script>window.Weft.routes.cartAdd="/cart/add";window.Weft.settings.afterAdd="drawer";</script>', modules: ['product.js'] });

async function setup(pageObj, base, opts = { variantId: 11, price: '€79.95', min: 1, step: 1 }) {
  await pageObj.route('**/products/tunic', (r) => r.fulfill({ contentType: 'text/html', body: page(opts) }));
  await pageObj.goto(`${base}/products/tunic`);
  await pageObj.waitForFunction(() => customElements.get('product-section') && !document.querySelector('[data-variant-input]').disabled);
}

export const tests = {
  async 'selecting a value swaps price, state, hidden id and URL through Section Rendering'({ page: p, base, expect }) {
    let requested = null;
    await p.route('**/products/tunic?*', (r) => {
      requested = new URL(r.request().url());
      r.fulfill({ contentType: 'text/html', body: section({ variantId: 12, price: '€84.95', selected: 'M' }) });
    });
    await setup(p, base);
    await p.click('label[for="main-picker1-1-1"]');
    await p.waitForFunction(() => document.querySelector('.price__current').textContent === '€84.95');
    expect(requested.searchParams.get('section_id'), 'section id').toBe('main');
    expect(requested.searchParams.get('option_values'), 'option values').toBe('102');
    expect(await p.$eval('[data-variant-input]', (i) => i.value), 'hidden id').toBe('12');
    expect(await p.evaluate(() => location.search), 'url').toBe('?variant=12');
    expect(await p.evaluate(() => document.activeElement.id), 'focus kept').toBe('main-picker1-1-1');
  },

  async 'add to cart posts the form, updates the count and opens the drawer'({ page: p, base, expect }) {
    let body = null;
    await p.route('**/cart/add.js', async (r) => {
      body = r.request().postData();
      r.fulfill({ contentType: 'application/json', body: JSON.stringify({ id: 11, quantity: 1, product_title: 'Tunic' }) });
    });
    await p.route('**/cart.js', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ item_count: 3, items: [] }) }));
    await setup(p, base);
    await p.click('[data-add-button]');
    await p.waitForFunction(() => document.getElementById('CartDrawer').open);
    expect(body, 'form data').toContain('name="id"\r\n\r\n11');
    expect(await p.$eval('[data-cart-count]', (e) => e.textContent), 'count').toBe('3');
    expect(await p.$eval('[data-cart-count]', (e) => e.hidden), 'count visible').toBe(false);
  },

  async 'Shopify errors show inline above the button, never as alert()'({ page: p, base, expect }) {
    await p.route('**/cart/add.js', (r) => r.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ status: 422, message: 'Cart Error', description: 'All 2 Tunic - S are in your cart.' }) }));
    let dialogs = 0;
    p.on('dialog', () => dialogs++);
    await setup(p, base);
    await p.click('[data-add-button]');
    await p.waitForSelector('[data-form-error]:not([hidden])');
    expect(await p.$eval('[data-form-error-text]', (e) => e.textContent), 'message').toBe('All 2 Tunic - S are in your cart.');
    expect(await p.$eval('[data-add-label]', (e) => e.textContent), 'label restored').toBe('Add to cart');
    expect(dialogs, 'no alert').toBe(0);
  },

  async 'stepper follows quantity rules (min 4, packs of 2, max 10)'({ page: p, base, expect }) {
    await setup(p, base, { variantId: 11, price: '€31.50', min: 4, step: 2, max: 10 });
    await p.waitForFunction(() => customElements.get('quantity-input'));
    const plus = '[data-quantity-step="1"]';
    const minus = '[data-quantity-step="-1"]';
    expect(await p.$eval(minus, (b) => b.disabled), 'minus disabled at min').toBe(true);
    await p.click(plus);
    expect(await p.$eval('#Quantity-main', (i) => i.value), 'step').toBe('6');
    await p.click(plus);
    await p.click(plus);
    expect(await p.$eval('#Quantity-main', (i) => i.value), 'max').toBe('10');
    expect(await p.$eval(plus, (b) => b.disabled), 'plus disabled at max').toBe(true);
    await p.fill('#Quantity-main', '7');
    await p.click('body');
    expect(await p.$eval('#Quantity-main', (i) => i.value), 'typed value rounded to pack').toBe('8');
  }
};
