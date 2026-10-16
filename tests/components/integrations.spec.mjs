// Store integrations: <reviews-list> (integration-reviews.js) and the back-in-stock service path
// in back-in-stock.js. Both are removed from the Theme Store package.
import { shell } from './fixtures/shell.mjs';

const card = (n, extra) => `<li class="review-card"${extra ? ' data-review-extra tabindex="-1"' : ''} id="r${n}"><p class="review-card__name">Reviewer ${n}</p><p class="review-card__body">Lovely ${n}</p></li>`;
const reviews = `
<reviews-list class="reviews-list">
  <ul class="reviews-list__grid" role="list">${[1, 2, 3, 4, 5].map((n) => card(n, n > 2)).join('')}</ul>
  <button type="button" class="button reviews-list__more js-only" data-reviews-more id="more">Show more reviews</button>
</reviews-list>`;

const bis = (service) => `
<back-in-stock class="back-in-stock" data-none-selected="Choose at least one option.">
  ${service ? '<script type="application/json" data-bis-service>{"endpoint": "https://service.test/api/stock/subscribe", "shop": "demo.myshopify.com", "locale": "es", "country": "ES", "productId": 42, "productTitle": "Tunic", "productUrl": "https://demo.test/products/tunic", "phoneError": "Check the phone number."}</script>' : ''}
  <form method="post" action="/contact" class="back-in-stock__form" data-bis-form id="bis">
    <fieldset><label><input type="checkbox" name="contact[Variant 1]" value="S (11)" data-variant-id="11" data-variant-title="S" checked><span>S</span></label>
    <label><input type="checkbox" name="contact[Variant 2]" value="M (12)" data-variant-id="12" data-variant-title="M"><span>M</span></label></fieldset>
    <div class="field"><input name="contact[name]" id="name" value="Ana"></div>
    <div class="field"><input name="contact[phone]" id="phone" value="+34600000000"></div>
    <div class="field"><input type="email" name="contact[email]" id="email" value="ana@example.com" required></div>
    <p data-bis-error hidden id="error"></p>
    <button type="submit" id="submit">Notify me</button>
    <p data-bis-success hidden id="success">Done.</p>
  </form>
</back-in-stock>`;

const open = async (page, base, body, modules, head = '') => {
  await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(body, { head: `<link rel="stylesheet" href="/assets/integration-reviews.css">${head}`, modules }) }));
  await page.goto(`${base}/fixture.html`);
};

export const tests = {
  async 'reviews after the first batch wait behind "Show more", which reveals them and moves focus'({ page, base, expect, eventually }) {
    await open(page, base, reviews, ['integration-reviews.js']);
    await page.waitForFunction(() => customElements.get('reviews-list'));
    expect(await page.$eval('#r3', (r) => getComputedStyle(r).display), 'extra review hidden').toBe('none');
    expect(await page.$eval('#r2', (r) => getComputedStyle(r).display !== 'none'), 'first batch shown').toBe(true);
    await page.click('#more');
    await eventually(() => getComputedStyle(document.getElementById('r5')).display !== 'none', 'all reviews shown');
    expect(await page.$$eval('#more', (b) => b.length), 'button removed').toBe(0);
    expect(await page.evaluate(() => document.activeElement.id), 'focus on the first new review').toBe('r3');
  },

  async 'back-in-stock sends JSON to the service when an endpoint is set'({ page, base, expect, eventually }) {
    let payload = null;
    await page.route('https://service.test/**', (r) => {
      payload = JSON.parse(r.request().postData());
      r.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"ok":true}' });
    });
    let contactPosted = false;
    await page.route('**/contact', (r) => { contactPosted = true; r.fulfill({ status: 200, body: '' }); });
    await open(page, base, bis(true), ['back-in-stock.js']);
    await page.waitForFunction(() => customElements.get('back-in-stock'));
    await page.click('#submit');
    await eventually(() => !document.getElementById('success').hidden, 'success shown');
    expect(payload.email, 'email').toBe('ana@example.com');
    expect(payload.shop, 'shop').toBe('demo.myshopify.com');
    expect(JSON.stringify(payload.variants), 'chosen variants with titles').toBe('[{"id":11,"title":"S"}]');
    expect(contactPosted, 'contact form not used').toBe(false);
  },

  async 'a refused phone number shows the translated hint'({ page, base, expect, eventually }) {
    await page.route('https://service.test/**', (r) => r.fulfill({ status: 422, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"error":"Invalid phone number"}' }));
    await open(page, base, bis(true), ['back-in-stock.js']);
    await page.waitForFunction(() => customElements.get('back-in-stock'));
    await page.click('#submit');
    await eventually(() => !document.getElementById('error').hidden, 'error shown');
    expect(await page.$eval('#error', (e) => e.textContent), 'hint').toBe('Check the phone number.');
    expect(await page.$eval('#submit', (b) => b.hidden), 'form still usable').toBe(false);
  },

  async 'without an endpoint the request goes through the contact form'({ page, base, expect, eventually }) {
    let contactPosted = false;
    await page.route('**/contact', (r) => { contactPosted = true; r.fulfill({ status: 200, contentType: 'text/html', body: '<p>ok</p>' }); });
    await open(page, base, bis(false), ['back-in-stock.js']);
    await page.waitForFunction(() => customElements.get('back-in-stock'));
    await page.click('#submit');
    await eventually(() => !document.getElementById('error').hidden || !document.getElementById('success').hidden, 'answered');
    expect(contactPosted, 'contact form used').toBe(true);
  }
};
