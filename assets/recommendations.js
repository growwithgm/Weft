/**
 * <recommendation-list>: fills a block or section from Shopify's product recommendations
 * endpoint (related or complementary intent), rendered by the owning section.
 */
import { scan } from '@weft/core';

class RecommendationList extends HTMLElement {
  connectedCallback() {
    if (this.bound || !this.dataset.url) return;
    this.bound = true;
    this.load();
  }

  async load() {
    try {
      const res = await fetch(this.dataset.url);
      if (!res.ok) return;
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const key = this.dataset.complementary || this.dataset.recommendations;
      const selector = this.dataset.complementary ? `[data-complementary="${key}"]` : `[data-recommendations="${key}"]`;
      const fresh = doc.querySelector(selector);
      if (fresh && fresh.children.length) {
        this.replaceChildren(...fresh.childNodes);
        this.classList.add('is-loaded');
        scan(this);
      } else if (this.dataset.hideEmpty !== 'false') {
        this.hidden = true;
      }
    } catch (_) {
      this.hidden = true;
    }
  }
}

if (!customElements.get('recommendation-list')) customElements.define('recommendation-list', RecommendationList);
