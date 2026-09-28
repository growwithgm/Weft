/**
 * <sticky-bar>: shows while the product's main Add to cart row is out of view (scrolled past)
 * and no drawer is open; hides the chat bubble while it's up (brief §5).
 */
import { bus } from '@weft/core';

class StickyBar extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.section = this.closest('product-section');
    this.passed = false;
    this.overlay = !!document.querySelector('dialog[open]');
    this.observe();
    this.offOpen = bus.on('dialog:open', () => { this.overlay = true; this.update(); });
    this.offClose = bus.on('dialog:close', () => { this.overlay = !!document.querySelector('dialog[open]'); this.update(); });
    this.offVariant = bus.on('variant:change', () => this.observe());
  }

  disconnectedCallback() {
    this.io && this.io.disconnect();
    this.offOpen && this.offOpen();
    this.offClose && this.offClose();
    this.offVariant && this.offVariant();
    const chat = document.querySelector('[data-chat-button]');
    if (chat && !document.querySelector('dialog[open]')) chat.removeAttribute('data-chat-hidden');
  }

  observe() {
    this.io && this.io.disconnect();
    const row = this.section && this.section.querySelector('[data-main-button-row]');
    if (!row) return;
    this.io = new IntersectionObserver(([entry]) => {
      this.passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      this.update();
    });
    this.io.observe(row);
  }

  update() {
    const show = this.passed && !this.overlay;
    this.hidden = !show;
    this.classList.toggle('is-visible', show);
    const chat = document.querySelector('[data-chat-button]');
    if (chat) chat.toggleAttribute('data-chat-hidden', show || this.overlay);
  }
}

if (!customElements.get('sticky-bar')) customElements.define('sticky-bar', StickyBar);
