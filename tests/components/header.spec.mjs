// Header menus, mobile drawer and dialogs (core.js + header.js).
import { shell } from './fixtures/shell.mjs';

const header = `
<a class="skip-link visually-hidden-focusable" href="#MainContent">Skip to content</a>
<header class="site-header" data-header>
  <div class="page-width header header--logo-left">
    <div class="header__start"><button type="button" class="icon-button header__menu-toggle js-only" data-open-dialog="MenuDrawer" aria-label="Open menu" id="burger">≡</button></div>
    <div class="header__logo-wrap"><a class="header__logo" href="/">Shop</a></div>
    <nav class="header__nav" aria-label="Main">
      <ul class="menu menu--center" role="list" data-menu>
        <li class="menu__item">
          <details class="menu__details" data-menu-item id="shop">
            <summary class="menu__link"><span>Shop</span></summary>
            <div class="menu__panel"><ul class="menu__dropdown" role="list"><li><a class="menu__sublink" href="/collections/dresses">Dresses</a></li></ul></div>
          </details>
        </li>
        <li class="menu__item">
          <details class="menu__details menu__details--mega" data-menu-item id="mega">
            <summary class="menu__link"><span>Brands</span></summary>
            <div class="menu__panel mega"><div class="mega__inner page-width">
              <ul class="mega__columns" role="list"><li class="mega__column"><a class="mega__heading" href="/a"><span class="mega__thumb" data-thumb="0"></span><span>A</span></a></li></ul>
              <template data-mega-extras><span data-thumb-for="0"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" id="thumb-img"></span><div class="mega__promos" data-mega-promos><a class="mega__promo" href="/p">Promo</a></div></template>
            </div></div>
          </details>
        </li>
        <li class="menu__item"><a class="menu__link" href="/pages/about">About</a></li>
      </ul>
    </nav>
    <div class="header__end"><a class="icon-button" href="/cart" data-open-dialog="CartDrawer" id="cart">Cart</a></div>
  </div>
</header>
<dialog id="MenuDrawer" class="drawer drawer--start" aria-label="Menu" data-light-dismiss>
  <div class="drawer__panel" data-dialog-body>
    <div class="drawer__header"><span>Shop</span><button type="button" class="icon-button" data-close-dialog aria-label="Close menu" id="close">×</button></div>
    <template data-deferred><div class="drawer__body"><nav data-menu-drawer-nav></nav></div></template>
  </div>
</dialog>
<main id="MainContent" tabindex="-1"><p>Content</p></main>`;

export const tests = {
  async 'mega menu hydrates its extras on open and closes other menus'({ page, base, expect, eventually }) {
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(header, { modules: ['header.js'] }) }));
    await page.goto(`${base}/fixture.html`);
    await page.waitForFunction(() => document.querySelector('#shop').dataset.bound === '1');
    await page.click('#shop > summary');
    expect(await page.$eval('#shop', (d) => d.open), 'shop open').toBe(true);
    await eventually(() => document.querySelector('#shop > summary').getAttribute('aria-expanded') === 'true', 'aria-expanded follows open');
    await page.click('#mega > summary');
    await eventually(() => !document.querySelector('#shop').open, 'shop closed when mega opens');
    await eventually(() => document.querySelectorAll('#thumb-img').length === 1, 'thumb hydrated');
    expect(await page.$$eval('#mega [data-mega-promos]', (n) => n.length), 'promos hydrated').toBe(1);
    await page.keyboard.press('Escape');
    await eventually(() => !document.querySelector('#mega').open, 'Escape closes');
    await eventually(() => document.querySelector('#mega > summary').getAttribute('aria-expanded') === 'false', 'aria-expanded after close');
  },

  async 'mobile drawer opens, clones the menu once, closes on Escape and returns focus'({ page, base, expect }) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(header, { modules: ['header.js'] }) }));
    await page.goto(`${base}/fixture.html`);
    await page.waitForFunction(() => document.querySelector('#shop').dataset.bound === '1');
    await page.click('#burger');
    expect(await page.$eval('#MenuDrawer', (d) => d.open), 'drawer open').toBe(true);
    expect(await page.$$eval('#MenuDrawer .menu--drawer', (n) => n.length), 'menu cloned').toBe(1);
    expect(await page.$$eval('#MenuDrawer [data-menu-drawer-nav] a', (n) => n.length) >= 3, 'links present').toBeTruthy();
    await page.click('#MenuDrawer .menu--drawer summary');
    expect(await page.$eval('#MenuDrawer .menu--drawer details', (d) => d.open), 'accordion opens').toBe(true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('MenuDrawer').open);
    expect(await page.evaluate(() => document.activeElement.id), 'focus returned').toBe('burger');
    await page.click('#burger');
    expect(await page.$$eval('#MenuDrawer .menu--drawer', (n) => n.length), 'cloned only once').toBe(1);
  },

  async 'links to missing dialogs keep their normal navigation'({ page, base, expect }) {
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(header, { modules: ['header.js'] }) }));
    await page.route('**/cart', (r) => r.fulfill({ contentType: 'text/html', body: '<title>Cart page</title>' }));
    await page.goto(`${base}/fixture.html`);
    await page.click('#cart');
    await page.waitForURL('**/cart');
    expect(await page.title(), 'navigated to cart').toBe('Cart page');
  },

  async 'skip link is reachable first by keyboard'({ page, base, expect }) {
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(header, { modules: ['header.js'] }) }));
    await page.goto(`${base}/fixture.html`);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement.className), 'skip link focused').toContain('skip-link');
  }
};
