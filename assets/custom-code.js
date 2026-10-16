/**
 * Injects merchant code kept in <template data-custom-code> after page load or first
 * interaction. Code marked data-consent="true" waits for marketing consent through Shopify's
 * Customer Privacy API.
 */
const templates = [...document.querySelectorAll('template[data-custom-code]')];

function inject(tpl) {
  if (tpl.dataset.injected) return;
  tpl.dataset.injected = '1';
  const frag = tpl.content.cloneNode(true);
  // Scripts from a template don't run; recreate them.
  frag.querySelectorAll('script').forEach((old) => {
    const s = document.createElement('script');
    for (const { name, value } of old.attributes) s.setAttribute(name, value);
    s.textContent = old.textContent;
    old.replaceWith(s);
  });
  (tpl.parentElement === document.head ? document.head : document.body).append(frag);
}

function consentGiven() {
  const api = window.Shopify && window.Shopify.customerPrivacy;
  if (!api) return false;
  if (typeof api.marketingAllowed === 'function') return api.marketingAllowed();
  if (typeof api.userCanBeTracked === 'function') return api.userCanBeTracked();
  return false;
}

function whenConsented(fn) {
  if (consentGiven()) return fn();
  document.addEventListener('visitorConsentCollected', (e) => {
    if (e.detail && e.detail.marketingAllowed) fn();
  });
  if (window.Shopify && window.Shopify.loadFeatures) {
    window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }], (err) => {
      if (!err && consentGiven()) fn();
    });
  }
}

function run(tpl) {
  const go = () => inject(tpl);
  if (tpl.dataset.consent === 'true') whenConsented(go);
  else go();
}

for (const tpl of templates) {
  const mode = tpl.dataset.customCode;
  if (mode === 'immediately') run(tpl);
  else if (mode === 'after_load') {
    if (document.readyState === 'complete') run(tpl);
    else addEventListener('load', () => run(tpl), { once: true });
  } else {
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    const trigger = () => {
      events.forEach((ev) => removeEventListener(ev, trigger));
      run(tpl);
    };
    events.forEach((ev) => addEventListener(ev, trigger, { once: true, passive: true }));
  }
}
