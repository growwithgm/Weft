// Product gallery (gallery.js), mobile sticky bar (sticky-bar.js) and quick add (quick-add.js).
import { shell } from './fixtures/shell.mjs';

const img = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22500%22/%3E';

const gallery = (layout = 'stacked') => `
<product-section class="product" data-product-section data-section-id="main">
  <product-gallery class="gallery gallery--${layout}" data-zoom="lightbox" data-lightbox-mobile="true">
    <div class="gallery__viewport">
      <ul class="gallery__list" data-gallery-list>
        <li class="gallery__item is-active" data-media-id="1"><div class="gallery__media media"><img class="gallery__image" src="${img}" alt="Front" width="400" height="500"><button type="button" class="gallery__zoom" data-open-lightbox="1" aria-label="Open image 1">+</button></div></li>
        <li class="gallery__item" data-media-id="2"><div class="gallery__media media"><img class="gallery__image" src="${img}" alt="Back" width="400" height="500"></div></li>
        <li class="gallery__item" data-media-id="3"><div class="gallery__media media"><img src="${img}" alt="" width="400" height="500"><button type="button" class="gallery__play" data-play-media aria-label="Play video" id="play">▶</button><template data-media-player><video id="player" muted playsinline></video></template></div></li>
      </ul>
      <span class="gallery__counter" data-gallery-counter data-template="__i__ / 3">1 / 3</span>
    </div>
    <ul class="gallery__thumbs">
      <li><button type="button" data-thumb-target="1" aria-current="true" id="t1">1</button></li>
      <li><button type="button" data-thumb-target="2" id="t2">2</button></li>
      <li><button type="button" data-thumb-target="3" id="t3">3</button></li>
    </ul>
    <dialog class="lightbox" data-lightbox aria-label="Images" data-light-dismiss>
      <div class="lightbox__layout"><ul class="lightbox__thumbs"><li><button type="button" data-lightbox-thumb="1">1</button></li></ul><ul class="lightbox__list" data-lightbox-list><li class="lightbox__item" data-lightbox-item="1"><img src="${img}" alt="" data-zoomable id="zoom1"></li></ul><span data-lightbox-counter></span></div>
      <button type="button" data-close-dialog>Close</button>
    </dialog>
  </product-gallery>
</product-section>`;

const productPage = `
<product-section class="product" data-product-section data-section-id="main">
  <div style="height: 300px">Gallery</div>
  <div class="buy-buttons__row" data-main-button-row style="height: 60px"><button type="button">Add to cart</button></div>
  <div style="height: 3000px">Details</div>
  <sticky-bar class="sticky-bar" hidden><button type="button">Add</button></sticky-bar>
</product-section>
<wa-chat class="wa" data-chat-button><a class="wa__button" href="#">Chat</a></wa-chat>
<button type="button" data-open-dialog="SomeDrawer" id="open-drawer" style="position: fixed; top: 0; right: 0">Open</button>
<dialog id="SomeDrawer" class="drawer drawer--end"><div data-dialog-body><button type="button" data-close-dialog id="close-drawer">Close</button></div></dialog>`;

const quickAdd = `
<div class="card">
  <a class="card__link" href="/products/tee">Tee</a>
  <button type="button" data-quick-add="/products/tee" aria-haspopup="dialog" id="qa">Choose options</button>
  <form method="post" action="/cart/add" data-card-form id="card-form"><input type="hidden" name="id" value="99"><button type="submit" id="card-add">Add to cart</button></form>
</div>
<span data-cart-count hidden>0</span>
<dialog id="QuickAdd" class="drawer drawer--end" aria-label="Choose options" data-light-dismiss>
  <div class="drawer__panel" data-dialog-body><div class="drawer__body" data-quick-add-body aria-live="polite"></div></div>
</dialog>
<dialog id="CartDrawer" class="drawer drawer--end"><div data-dialog-body>Cart</div></dialog>`;

const emit = (page, name, detail) =>
  page.evaluate(async ([n, d]) => {
    const { bus } = await import('/assets/core.js');
    bus.emit(n, { ...d, section: document.querySelector('product-section') });
  }, [name, detail]);

export const tests = {
  async 'mobile carousel counts slides and follows the selected variant’s media'({ page, base, expect, eventually }) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(gallery('stacked'), { head: '<link rel="stylesheet" href="/assets/section-product.css">', modules: ['gallery.js'] }) }));
    await page.goto(`${base}/fixture.html`);
    await page.waitForFunction(() => customElements.get('product-gallery'));
    await page.$eval('[data-gallery-list]', (l) => l.scrollTo({ left: l.clientWidth }));
    await eventually(() => document.querySelector('[data-gallery-counter]').textContent === '2 / 3', 'counter follows the swipe');
    expect(await page.$eval('[data-media-id="2"]', (i) => i.classList.contains('is-active')), 'active slide').toBe(true);
    await emit(page, 'variant:change', { featuredMediaId: 3 });
    await eventually(() => document.querySelector('[data-gallery-counter]').textContent === '3 / 3', 'variant media shown');
  },

  async 'thumbnails, video on demand and the lightbox'({ page, base, expect, eventually }) {
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(gallery('thumbnails'), { head: '<link rel="stylesheet" href="/assets/section-product.css">', modules: ['gallery.js'] }) }));
    await page.goto(`${base}/fixture.html`);
    await page.waitForFunction(() => customElements.get('product-gallery'));
    await page.click('#t2');
    expect(await page.$eval('#t2', (t) => t.hasAttribute('aria-current')), 'thumb marked current').toBe(true);
    expect(await page.$eval('#t1', (t) => t.hasAttribute('aria-current')), 'previous thumb released').toBe(false);
    await page.$eval('#play', (b) => b.click());
    expect(await page.$$eval('#player', (v) => v.length), 'player inserted from its template').toBe(1);
    expect(await page.$$eval('#play', (b) => b.length), 'poster button removed').toBe(0);
    await page.$eval('[data-open-lightbox="1"]', (b) => b.click());
    await eventually(() => document.querySelector('[data-lightbox]').open, 'lightbox open');
    await page.click('#zoom1');
    expect(await page.$eval('#zoom1', (i) => i.classList.contains('is-zoomed')), 'tap to zoom').toBe(true);
  },

  async 'sticky bar appears after the main button scrolls away and hides behind drawers'({ page, base, expect, eventually }) {
    await page.setViewportSize({ width: 390, height: 700 });
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(productPage, { modules: ['sticky-bar.js'] }) }));
    await page.goto(`${base}/fixture.html`);
    await page.waitForFunction(() => customElements.get('sticky-bar'));
    expect(await page.$eval('sticky-bar', (b) => b.hidden), 'hidden while the button is visible').toBe(true);
    await page.evaluate(() => window.scrollTo(0, 1200));
    await eventually(() => !document.querySelector('sticky-bar').hidden, 'shown after scrolling past');
    expect(await page.$eval('[data-chat-button]', (c) => c.hasAttribute('data-chat-hidden')), 'chat bubble hidden').toBe(true);
    await page.click('#open-drawer');
    await eventually(() => document.querySelector('sticky-bar').hidden, 'hidden while a drawer is open');
    await page.click('#close-drawer');
    await eventually(() => !document.querySelector('sticky-bar').hidden, 'back after closing');
    await page.evaluate(() => window.scrollTo(0, 0));
    await eventually(() => document.querySelector('sticky-bar').hidden, 'hidden again at the top');
  },

  async 'quick add loads the product into the drawer; card forms add directly'({ page, base, expect, eventually }) {
    let requested = null;
    await page.route('**/products/tee?*', (r) => {
      requested = new URL(r.request().url());
      r.fulfill({ contentType: 'text/html', body: '<div id="shopify-section-quick-add"><product-section data-quick-add-content data-section-id="quick-add"><h2>Tee</h2><select id="qa-size"><option>S</option></select></product-section></div>' });
    });
    await page.route('**/cart/add.js', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ id: 99, quantity: 1, product_title: 'Tee' }) }));
    await page.route('**/cart.js', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ item_count: 1, items: [] }) }));
    const head = "<script>Object.assign(window.Weft, { modules: { quickAdd: '/assets/quick-add.js', product: '/assets/product.js' } }); Object.assign(window.Weft.routes, { cartAdd: '/cart/add' }); window.Weft.settings.afterAdd = 'drawer';</script>";
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(quickAdd, { head }) }));
    await page.goto(`${base}/fixture.html`);
    await page.click('#qa');
    await eventually(() => document.getElementById('QuickAdd').open && !!document.querySelector('[data-quick-add-body] #qa-size'), 'product rendered in the drawer');
    expect(requested.searchParams.get('section_id'), 'section rendering').toBe('quick-add');
    expect(await page.evaluate(() => document.activeElement.id), 'focus moves into the drawer').toBe('qa-size');
    await page.keyboard.press('Escape');
    await eventually(() => !document.getElementById('QuickAdd').open, 'closed');
    await page.click('#card-add');
    await eventually(() => document.getElementById('CartDrawer').open, 'cart drawer opens after a card add');
    expect(await page.$eval('[data-cart-count]', (c) => c.textContent), 'count updated').toBe('1');
  },

  async 'quick add copies required and marked custom options; a card add with a required option opens quick add'({ page, base, expect, eventually }) {
    const productPage = `<product-section data-product-section data-section-id="main">
      <div class="custom-option field" data-custom-option data-required="true" data-in-quick-add="false"><label for="Option-a">Engraving</label><input id="Option-a" name="properties[Engraving]" form="ProductForm-main" required></div>
      <div class="custom-option field" data-custom-option data-required="false" data-in-quick-add="true"><label for="Option-b">Gift note</label><input id="Option-b" name="properties[Gift note]" form="ProductForm-main"></div>
      <div class="custom-option field" data-custom-option data-required="false" data-in-quick-add="false"><label for="Option-c">Hidden</label><input id="Option-c" name="properties[Hidden]" form="ProductForm-main"></div>
    </product-section>`;
    await page.route('**/products/tee', (r) => r.fulfill({ contentType: 'text/html', body: productPage }));
    await page.route('**/products/tee?*', (r) => r.fulfill({ contentType: 'text/html', body: '<product-section data-quick-add-content data-section-id="quick-add" data-custom-options="true"><div data-buy-buttons><form id="ProductForm-quick-add" data-product-form><button type="submit">Add</button></form></div></product-section>' }));
    let added = false;
    await page.route('**/cart/add.js', (r) => { added = true; r.fulfill({ contentType: 'application/json', body: '{}' }); });
    const head = "<script>Object.assign(window.Weft, { modules: { quickAdd: '/assets/quick-add.js', product: '/assets/product.js' } }); Object.assign(window.Weft.routes, { cartAdd: '/cart/add' });</script>";
    const card = quickAdd.replace('data-card-form id="card-form"', 'data-card-form data-product-url="/products/tee" id="card-form"');
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(card, { head }) }));
    await page.goto(`${base}/fixture.html`);
    await page.click('#card-add');
    await eventually(() => document.getElementById('QuickAdd').open && !!document.querySelector('[data-quick-add-body] #QA-Option-a'), 'required option shown in quick add instead of adding');
    expect(added, 'nothing added while a required option is empty').toBe(false);
    expect(await page.$eval('#QA-Option-a', (i) => i.getAttribute('form')), 'field posts with the quick add form').toBe('ProductForm-quick-add');
    expect(await page.$eval('label[for="QA-Option-a"]', (l) => l.textContent), 'label follows the new id').toBe('Engraving');
    expect(await page.$$eval('#QA-Option-b', (e) => e.length), 'marked option copied').toBe(1);
    expect(await page.$$eval('#QA-Option-c', (e) => e.length), 'unmarked optional field left out').toBe(0);
  },

  async 'card slideshow cycles images on hover and resets on leave'({ page, base, expect, eventually }) {
    const card = `<div class="card" style="width: 300px"><a class="card__media media" href="/products/tee" data-card-slideshow style="display: block; position: relative; aspect-ratio: 4 / 5">
      ${[1, 2, 3, 4].map((n) => `<img class="card__image ${n === 1 ? 'card__image--primary' : n === 2 ? 'card__image--secondary' : 'card__image--slide'}" src="${img}" alt="" id="img${n}">`).join('')}
    </a></div><p style="margin-top: 400px" id="away">Away</p>`;
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(card, { head: '<link rel="stylesheet" href="/assets/component-card.css">' }) }));
    await page.goto(`${base}/fixture.html`);
    await page.hover('[data-card-slideshow]');
    await eventually(() => document.getElementById('img2').classList.contains('is-shown'), 'second image first');
    await eventually(() => document.getElementById('img3').classList.contains('is-shown'), 'then the next one');
    await page.hover('#away');
    await eventually(() => !document.querySelector('[data-card-slideshow]').classList.contains('is-sliding'), 'reset on leave');
  },

  async 'a refused card add shows Shopify’s message on the card'({ page, base, expect, eventually }) {
    await page.route('**/cart/add.js', (r) => r.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ status: 422, message: 'Cart Error', description: 'Tee is sold out.' }) }));
    const head = "<script>Object.assign(window.Weft, { modules: { quickAdd: '/assets/quick-add.js', product: '/assets/product.js' } }); Object.assign(window.Weft.routes, { cartAdd: '/cart/add' }); window.Weft.settings.afterAdd = 'drawer';</script>";
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(quickAdd, { head }) }));
    await page.goto(`${base}/fixture.html`);
    await page.click('#card-add');
    await eventually(() => !!document.querySelector('[data-card-error]'), 'error shown');
    expect(await page.$eval('[data-card-error]', (e) => e.textContent), 'message').toBe('Tee is sold out.');
    expect(new URL(page.url()).pathname, 'no navigation').toBe('/fixture.html');
  }
};
