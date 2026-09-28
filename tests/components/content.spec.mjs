// Content islands: <product-tabs> (tabs.js), <hot-spots> (hotspots.js), <site-popup> (popup.js)
// and the discount code copy button (core.js).
import { shell } from './fixtures/shell.mjs';

const tabs = `
<product-tabs class="tabs">
  <div class="tabs__list" role="tablist" data-tablist></div>
  ${['Description', 'Specification', 'Care'].map((t, i) => `<section class="tabs__panel" id="p${i}" data-tab-panel data-tab-title="${t}"><h3 class="tabs__heading">${t}</h3><div class="rte"><p>${t} text</p></div></section>`).join('')}
</product-tabs>`;

const hotspots = `
<hot-spots class="hotspots" style="display: block; position: relative; width: 600px; height: 400px">
  ${[1, 2].map((n) => `<details class="hotspot" data-hotspot id="h${n}" style="--x: ${n * 30}%; --y: 50%;"><summary class="hotspot__dot" aria-label="Product ${n}"><span></span></summary><div class="hotspot__card">Card ${n}</div></details>`).join('')}
</hot-spots>
<p id="outside" style="margin-top: 40px">Outside</p>`;

const popup = ({ mode = 'newsletter', delay = 0, customer = 'false', guests = 'true' } = {}) => `
<site-popup data-mode="${mode}" data-trigger="delay" data-delay="${delay}" data-days="14" data-mobile="true" data-guests-only="${guests}" data-customer="${customer}" data-modal="true" data-section-id="popup1">
  <dialog class="popup popup--center" aria-labelledby="pt">
    <div class="popup__panel"><div class="popup__body">
      <span id="pt">Newsletter</span>
      <input type="email" id="email" aria-label="Email">
      ${mode === 'age_verification' ? '<div data-age-actions><button type="button" data-age-yes id="yes">Yes</button><button type="button" data-age-no id="no">No</button></div><div data-age-declined hidden id="declined">Sorry</div>' : ''}
    </div>
    ${mode === 'age_verification' ? '' : '<button type="button" data-popup-close id="close">Close</button>'}
    </div>
  </dialog>
</site-popup>`;

const open = async (page, base, body, modules, head = '') => {
  await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(body, { head: `<link rel="stylesheet" href="/assets/section-content.css"><link rel="stylesheet" href="/assets/section-library.css"><link rel="stylesheet" href="/assets/component-popup.css">${head}`, modules }) }));
  await page.goto(`${base}/fixture.html`);
};

export const tests = {
  async 'product tabs build an ARIA tablist with arrow keys, Home and End'({ page, base, expect }) {
    await open(page, base, tabs, ['tabs.js']);
    await page.waitForFunction(() => document.querySelector('product-tabs').classList.contains('is-ready'));
    expect(await page.$$eval('[role="tab"]', (t) => t.map((x) => x.textContent).join(',')), 'tabs from panel titles').toBe('Description,Specification,Care');
    expect(await page.$eval('#p1', (p) => p.hidden), 'second panel hidden').toBe(true);
    expect(await page.$eval('#p0', (p) => p.getAttribute('aria-labelledby')), 'panel labelled by its tab').toBe('p0-tab');
    await page.focus('#p0-tab');
    await page.keyboard.press('ArrowRight');
    expect(await page.evaluate(() => document.activeElement.id), 'focus moves right').toBe('p1-tab');
    expect(await page.$eval('#p1', (p) => p.hidden), 'panel follows').toBe(false);
    expect(await page.$eval('#p0-tab', (t) => t.tabIndex), 'roving tabindex').toBe(-1);
    await page.keyboard.press('End');
    expect(await page.evaluate(() => document.activeElement.id), 'End').toBe('p2-tab');
    await page.keyboard.press('ArrowRight');
    expect(await page.evaluate(() => document.activeElement.id), 'wraps').toBe('p0-tab');
    await page.keyboard.press('Home');
    expect(await page.$eval('#p0-tab', (t) => t.getAttribute('aria-selected')), 'Home selects the first').toBe('true');
  },

  async 'hotspots open one at a time and close on Escape or outside clicks'({ page, base, expect, eventually }) {
    await open(page, base, hotspots, ['hotspots.js']);
    await page.waitForFunction(() => customElements.get('hot-spots'));
    await page.click('#h1 summary');
    expect(await page.$eval('#h1', (d) => d.open), 'first open').toBe(true);
    await page.click('#h2 summary');
    await eventually(() => !document.getElementById('h1').open, 'first closes when the second opens');
    await page.keyboard.press('Escape');
    expect(await page.$eval('#h2', (d) => d.open), 'Escape closes').toBe(false);
    expect(await page.evaluate(() => document.activeElement.closest('details')?.id), 'focus back on the dot').toBe('h2');
    await page.click('#h1 summary');
    await page.click('#outside');
    expect(await page.$eval('#h1', (d) => d.open), 'outside click closes').toBe(false);
  },

  async 'newsletter pop-up opens after its delay and stays closed after dismissal'({ page, base, expect, eventually }) {
    await open(page, base, popup(), ['popup.js'], '<script>if (!sessionStorage.getItem("seeded")) { localStorage.removeItem("weft:popup:popup1"); sessionStorage.setItem("seeded", "1"); }</script>');
    await eventually(() => document.querySelector('site-popup dialog').open, 'opens after the delay');
    expect(await page.evaluate(() => document.activeElement.id), 'focus inside').toBe('email');
    await page.click('#close');
    expect(await page.$eval('site-popup dialog', (d) => d.open), 'closed').toBe(false);
    const until = await page.evaluate(() => Number(localStorage.getItem('weft:popup:popup1')));
    expect(until > Date.now() + 13 * 86400000, 'remembered for the chosen days').toBe(true);
    await page.reload();
    await page.waitForFunction(() => customElements.get('site-popup'));
    await page.waitForTimeout(400);
    expect(await page.$eval('site-popup dialog', (d) => d.open), 'not shown again').toBe(false);
  },

  async 'pop-up skips signed-in customers when set to guests only'({ page, base, expect }) {
    await open(page, base, popup({ customer: 'true' }), ['popup.js'], '<script>if (!sessionStorage.getItem("seeded")) { localStorage.removeItem("weft:popup:popup1"); sessionStorage.setItem("seeded", "1"); }</script>');
    await page.waitForFunction(() => customElements.get('site-popup'));
    await page.waitForTimeout(400);
    expect(await page.$eval('site-popup dialog', (d) => d.open), 'not shown').toBe(false);
  },

  async 'age verification needs an answer and remembers yes'({ page, base, expect, eventually }) {
    await open(page, base, popup({ mode: 'age_verification' }), ['popup.js'], '<script>if (!sessionStorage.getItem("seeded")) { localStorage.removeItem("weft:popup:popup1"); sessionStorage.setItem("seeded", "1"); }</script>');
    await eventually(() => document.querySelector('site-popup dialog').open, 'shown at once');
    await page.keyboard.press('Escape');
    expect(await page.$eval('site-popup dialog', (d) => d.open), 'Escape does not dismiss').toBe(true);
    await page.click('#no');
    expect(await page.$eval('#declined', (d) => d.hidden), 'declined message').toBe(false);
    expect(await page.$eval('[data-age-actions]', (d) => d.hidden), 'buttons hidden').toBe(true);
    await page.evaluate(() => {
      document.querySelector('[data-age-actions]').hidden = false;
    });
    await page.click('#yes');
    expect(await page.$eval('site-popup dialog', (d) => d.open), 'closed after yes').toBe(false);
    expect(await page.evaluate(() => Number(localStorage.getItem('weft:popup:popup1')) > Date.now()), 'remembered').toBe(true);
  },

  async 'discount code copies to the clipboard and confirms'({ page, base, expect, eventually }) {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await open(page, base, '<div class="discount-code"><code>WELCOME10</code><button type="button" data-copy-text="WELCOME10" data-copied-label="Copied" id="copy">Copy code</button></div>', []);
    await page.waitForFunction(() => window.Weft && document.querySelector('#copy'));
    await page.click('#copy');
    await eventually(() => document.getElementById('copy').textContent === 'Copied', 'confirmation shown');
    expect(await page.evaluate(() => navigator.clipboard.readText()), 'copied').toBe('WELCOME10');
  }
};
