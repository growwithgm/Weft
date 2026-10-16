// WhatsApp chat (whatsapp.js): never covers a buy button; the chat window closes by button, Escape and outside click.
import { shell } from './fixtures/shell.mjs';

const page = (addBottom) => `
<div style="height: 2000px">
  <button type="button" id="outside">Somewhere else</button>
  <div style="position: fixed; inset-inline: 0; bottom: ${addBottom}px; height: 56px; display: flex; justify-content: flex-end; padding-inline: 16px">
    <button type="submit" name="add" data-add-button style="width: 240px">Add to cart</button>
  </div>
</div>
<wa-chat class="wa wa--end wa--show-all" style="--wa-bg: #25D366; --wa-fg: #fff; --wa-size: 56px; --wa-offset: 20px; --wa-offset-mobile: 20px; --wa-side: 20px;" data-chat-button data-delay="0" data-section-id="wa">
  <details class="wa__details" data-wa-details>
    <summary class="wa__button" aria-label="Chat on WhatsApp">WA</summary>
    <div class="wa__window"><div class="wa__head"><button type="button" class="wa__close" data-wa-close aria-label="Close" id="wa-close">×</button></div><div class="wa__body"><a class="wa__start" href="https://wa.me/34600000000">Start chat</a></div></div>
  </details>
</wa-chat>`;

const open = (p) => p.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(page(p.addBottom), { head: '<link rel="stylesheet" href="/assets/component-whatsapp.css">', modules: ['whatsapp.js'] }) }));

export const tests = {
  async 'steps aside while an add-to-cart button sits underneath it'({ page: p, base, expect, eventually }) {
    await p.setViewportSize({ width: 390, height: 700 });
    p.addBottom = 12;
    await open(p);
    await p.goto(`${base}/fixture.html`);
    await p.waitForFunction(() => customElements.get('wa-chat'));
    await eventually(() => document.querySelector('wa-chat').hasAttribute('data-chat-overlap'), 'hidden over the button');
    expect(await p.$eval('wa-chat', (w) => getComputedStyle(w).pointerEvents), 'not clickable').toBe('none');
    await p.$eval('[data-add-button]', (b) => { b.parentElement.style.bottom = '300px'; });
    await eventually(() => !document.querySelector('wa-chat').hasAttribute('data-chat-overlap'), 'back once the button moves away');
  },

  async 'chat window closes with its button, Escape and a click outside'({ page: p, base, expect, eventually }) {
    await p.setViewportSize({ width: 1280, height: 800 });
    p.addBottom = 400;
    await open(p);
    await p.goto(`${base}/fixture.html`);
    await p.waitForFunction(() => customElements.get('wa-chat'));
    await p.click('.wa__button');
    expect(await p.$eval('[data-wa-details]', (d) => d.open), 'opens').toBe(true);
    await p.click('#wa-close');
    expect(await p.$eval('[data-wa-details]', (d) => d.open), 'close button').toBe(false);
    await p.click('.wa__button');
    await p.keyboard.press('Escape');
    expect(await p.$eval('[data-wa-details]', (d) => d.open), 'Escape').toBe(false);
    await p.click('.wa__button');
    await p.click('#outside');
    await eventually(() => !document.querySelector('[data-wa-details]').open, 'outside click');
  }
};
