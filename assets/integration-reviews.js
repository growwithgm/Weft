/**
 * Integration (store builds only). <reviews-list>: reviews after the first batch wait behind a
 * "Show more reviews" button; without JavaScript every review shows.
 */
class ReviewsList extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.querySelector('[data-reviews-more]')?.addEventListener('click', (e) => {
      this.classList.add('is-expanded');
      e.currentTarget.remove();
      this.querySelector('[data-review-extra]')?.focus();
    });
  }
}

if (!customElements.get('reviews-list')) customElements.define('reviews-list', ReviewsList);
