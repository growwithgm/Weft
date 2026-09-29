// Cart page (cart.js) and shipping calculator (shipping-calculator.js).
import { shell } from './fixtures/shell.mjs';

const page = ({ qty = 2, total = '€40.00', error = '' } = {}) => `
<div id="shopify-section-main-cart">
  <div class="section cart-page" data-cart-section="main-cart">
    <form action="/cart" method="post" id="CartPageForm" data-cart-page novalidate>
      <ul class="cart-lines cart-lines--page" role="list">
        <li class="cart-line" data-line="1" data-line-key="k1" data-variant-id="11">
          <div class="cart-line__body">
            <a class="cart-line__title" href="/products/tee">Tee</a>
            <a class="icon-button cart-line__remove" href="/cart/change?line=1&quantity=0" data-line-remove aria-label="Remove Tee">×</a>
            <div class="cart-line__foot">
              <label for="CartQty-page-1">Quantity</label>
              <input class="quantity__input" type="number" id="CartQty-page-1" name="updates[]" value="${qty}" min="0">
              <span class="cart-line__total" data-total>${total}</span>
            </div>
            <p class="cart-line__error" role="alert" data-line-error ${error ? '' : 'hidden'}>${error}</p>
          </div>
        </li>
      </ul>
      <button type="submit" name="checkout" data-checkout>Check out</button>
    </form>
  </div>
</div>`;

const calculator = `
<shipping-calculator class="shipping-calc" data-default-country="Spain">
  <details class="shipping-calc__details" open>
    <summary>Estimate shipping</summary>
    <select id="country" data-shipping-country>
      <option value="Canada" data-provinces='[["Ontario","Ontario"],["Quebec","Québec"]]'>Canada</option>
      <option value="Spain" data-provinces='[]'>Spain</option>
    </select>
    <div data-shipping-province-field hidden><select id="province" data-shipping-province></select></div>
    <input id="zip" data-shipping-zip>
    <button type="button" data-shipping-submit id="calc">Calculate</button>
    <div role="status" data-shipping-result id="result"></div>
  </details>
  <script type="application/json" data-shipping-strings>{"one": "There is __n__ shipping rate for this address:", "other": "There are __n__ shipping rates for this address:", "none": "We don’t ship to this address.", "free": "Free", "error": "Shipping rates couldn’t be calculated.", "loading": "Loading…"}</script>
</shipping-calculator>`;

const head = `<script>Object.assign(window.Weft, { moneyFormat: '€{{amount}}' }); Object.assign(window.Weft.routes, { cart: '/cart', cartChange: '/cart/change', cartUpdate: '/cart/update' }); window.Weft.strings.cartUpdated = 'Cart updated';</script>`;

async function open(p, base, body) {
  await p.route('**/cart', (r) => r.fulfill({ contentType: 'text/html', body: shell(body, { head, modules: ['cart.js', 'shipping-calculator.js'] }) }));
  await p.goto(`${base}/cart`);
  await p.waitForFunction(() => customElements.get('shipping-calculator'));
}

export const tests = {
  async 'changing a quantity posts /cart/change with sections and re-renders the page'({ page: p, base, expect, eventually }) {
    let body = null;
    await p.route('**/cart/change.js', (r) => {
      body = JSON.parse(r.request().postData());
      r.fulfill({ contentType: 'application/json', body: JSON.stringify({ item_count: 3, items: [], sections: { 'main-cart': page({ qty: 3, total: '€60.00' }) } }) });
    });
    await open(p, base, page());
    await p.fill('#CartQty-page-1', '3');
    await p.$eval('#CartQty-page-1', (i) => i.dispatchEvent(new Event('change', { bubbles: true })));
    await eventually(() => document.querySelector('[data-total]').textContent === '€60.00', 'page re-rendered from the section');
    expect(JSON.stringify({ line: body.line, quantity: body.quantity, sections: body.sections }), 'request').toBe('{"line":1,"quantity":3,"sections":"main-cart"}');
    expect(body.sections_url, 'sections_url').toBe('/cart');
    await eventually(() => document.activeElement && document.activeElement.id === 'CartQty-page-1', 'focus returns to the quantity field');
  },

  async 'Shopify errors show on the line and restore the previous quantity'({ page: p, base, expect, eventually }) {
    await p.route('**/cart/change.js', (r) => r.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ status: 422, message: 'Cart Error', description: 'You can only add 2 of this item.' }) }));
    await open(p, base, page());
    await p.focus('#CartQty-page-1');
    await p.fill('#CartQty-page-1', '9');
    await p.$eval('#CartQty-page-1', (i) => i.dispatchEvent(new Event('change', { bubbles: true })));
    await eventually(() => !document.querySelector('[data-line-error]').hidden, 'inline error shown');
    expect(await p.$eval('[data-line-error]', (e) => e.textContent), 'Shopify message').toBe('You can only add 2 of this item.');
    expect(await p.$eval('#CartQty-page-1', (i) => i.value), 'previous value restored').toBe('2');
  },

  async 'shipping calculator polls async rates and lists Shopify’s prices'({ page: p, base, expect, eventually }) {
    const calls = [];
    let polls = 0;
    await p.route('**/cart/prepare_shipping_rates.json**', (r) => {
      calls.push(['prepare', r.request().method(), new URL(r.request().url())]);
      r.fulfill({ contentType: 'application/json', body: 'null' });
    });
    await p.route('**/cart/async_shipping_rates.json**', (r) => {
      polls += 1;
      calls.push(['async', r.request().method(), new URL(r.request().url())]);
      const body = polls < 2 ? 'null' : JSON.stringify({ shipping_rates: [{ name: 'Standard', presentment_name: 'Standard', price: '4.95' }, { name: 'Pickup', price: '0.00' }] });
      r.fulfill({ contentType: 'application/json', body });
    });
    await open(p, base, calculator);
    expect(await p.$eval('#country', (s) => s.value), 'default country').toBe('Spain');
    await p.selectOption('#country', 'Canada');
    expect(await p.$eval('[data-shipping-province-field]', (f) => f.hidden), 'provinces shown').toBe(false);
    expect(await p.$$eval('#province option', (o) => o.map((x) => x.textContent).join(',')), 'province names').toBe('Ontario,Québec');
    await p.fill('#zip', 'K1N 5T2');
    await p.click('#calc');
    await eventually(() => document.querySelectorAll('#result li').length === 2, 'rates listed');
    expect(calls[0][1], 'prepare is a POST').toBe('POST');
    expect(calls[0][2].searchParams.get('shipping_address[province]'), 'province sent').toBe('Ontario');
    expect(calls[0][2].searchParams.get('shipping_address[zip]'), 'zip sent').toBe('K1N 5T2');
    expect(polls, 'polled until ready').toBe(2);
    expect(await p.$eval('#result', (r) => r.textContent), 'heading, formatted price and free rate').toBe('There are 2 shipping rates for this address:Standard€4.95PickupFree');
  }
};
