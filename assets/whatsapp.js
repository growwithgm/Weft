/**
 * <wa-chat>: the floating WhatsApp button (sections/whatsapp-chat.liquid).
 * - Steps aside (data-chat-overlap) while an add-to-cart, buy or checkout button sits underneath it,
 *   so it never covers one. core.js and sticky-bar.js use data-chat-hidden for overlays.
 * - The chat window is a <details>: close button, Escape and a click outside close it.
 * - Optional automatic opening after a delay, once per visit.
 */
const TARGETS = [
  '[data-add-button]', '[data-sticky-add]', '[data-buy-now]', '[data-matrix-add]', '[data-checkout]',
  'button[name="add"]', 'button[name="checkout"]', '.shopify-payment-button', 'shopify-accelerated-checkout',
  'shopify-accelerated-checkout-cart'
].join(',');
const GAP = 8;

class WaChat extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.details = this.querySelector('[data-wa-details]');
    this.button = this.querySelector('.wa__button');
    this.frame = 0;
    this.check = () => {
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => { this.frame = 0; this.guard(); });
    };
    addEventListener('scroll', this.check, { passive: true });
    addEventListener('resize', this.check, { passive: true });
    this.mo = new MutationObserver(this.check);
    this.mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class', 'open', 'style'] });
    // Sliding bars (the mobile sticky bar) settle after a transition.
    document.addEventListener('transitionend', this.check, { passive: true });
    this.check();

    if (!this.details) return;
    this.onKey = (e) => {
      if (e.key === 'Escape' && this.details.open) { this.details.open = false; this.button.focus(); }
    };
    this.onClick = (e) => {
      if (this.details.open && !this.contains(e.target)) this.details.open = false;
    };
    document.addEventListener('keydown', this.onKey);
    document.addEventListener('click', this.onClick);
    this.querySelector('[data-wa-close]')?.addEventListener('click', () => { this.details.open = false; this.button.focus(); });
    this.autoOpen();
  }

  disconnectedCallback() {
    removeEventListener('scroll', this.check);
    removeEventListener('resize', this.check);
    document.removeEventListener('transitionend', this.check);
    this.mo && this.mo.disconnect();
    this.onKey && document.removeEventListener('keydown', this.onKey);
    this.onClick && document.removeEventListener('click', this.onClick);
    clearTimeout(this.timer);
  }

  autoOpen() {
    const delay = Number(this.dataset.delay) || 0;
    if (!delay || window.Shopify?.designMode) return;
    const key = `weft:wa-opened:${this.dataset.sectionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch (_) { /* storage blocked: open anyway */ }
    this.timer = setTimeout(() => {
      if (this.hasAttribute('data-chat-hidden') || this.hasAttribute('data-chat-overlap')) return;
      this.details.open = true;
      try { sessionStorage.setItem(key, '1'); } catch (_) { /* ignore */ }
    }, delay * 1000);
  }

  // True while a visible buy or checkout button overlaps the button's box (plus a small gap).
  guard() {
    if (!this.button || this.details?.open) return;
    const box = this.button.getBoundingClientRect();
    if (!box.width) return;
    let hit = false;
    for (const el of document.querySelectorAll(TARGETS)) {
      if (this.contains(el)) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) continue;
      if (r.left < box.right + GAP && r.right > box.left - GAP && r.top < box.bottom + GAP && r.bottom > box.top - GAP) {
        if (getComputedStyle(el).visibility === 'hidden') continue;
        hit = true;
        break;
      }
    }
    this.toggleAttribute('data-chat-overlap', hit);
  }
}

if (!customElements.get('wa-chat')) customElements.define('wa-chat', WaChat);
