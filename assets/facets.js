/**
 * Collection and search results (brief §14.3): filters, sorting, active filter chips, "Load more"
 * and the grid/list toggle, re-rendered through the Section Rendering API so the URL, counts and
 * filter values always come from Shopify. The filter form is a normal GET form: without this
 * module it submits and paginates as plain pages.
 * On small screens the same form moves into the filter drawer while it is open, so there is only
 * one copy of every input in the DOM.
 */
import { bus, announce, fetchSection, scan } from '@weft/core';

const LAYOUT_KEY = 'weft:collection-layout';

const storedLayout = () => {
  try {
    return localStorage.getItem(LAYOUT_KEY);
  } catch (_) {
    return null;
  }
};

class CollectionResults extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.sectionId = this.dataset.sectionId;
    this.form = this.querySelector('[data-facets-form]');
    this.drawer = this.querySelector('dialog.facets-drawer');

    this.addEventListener('change', (e) => {
      if (e.target.matches('[data-facet-price]')) return;
      if ((this.form && e.target.form === this.form) || e.target.matches('[data-facets-sort]')) this.submit();
    });
    this.addEventListener('input', (e) => {
      if (!e.target.matches('[data-facet-price]')) return;
      clearTimeout(this.priceTimer);
      this.priceTimer = setTimeout(() => this.submit(), 700);
    });
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });
    this.addEventListener('click', (e) => this.onClick(e));

    this.offOpen = bus.on('dialog:open', ({ id }) => this.drawer && id === this.drawer.id && this.moveForm(true));
    this.offClose = bus.on('dialog:close', ({ id }) => this.drawer && id === this.drawer.id && this.moveForm(false));
    if (this.drawer?.open) this.moveForm(true);

    this.onPop = () => this.render(location.href, false);
    window.addEventListener('popstate', this.onPop);
    if (this.querySelector('[data-layout-option]')) this.applyLayout(storedLayout());
    this.watchInfinite();
  }

  /** Infinite scroll (Theme settings > Layout > Pagination): loads the next page near the end of the grid. */
  watchInfinite() {
    const link = this.querySelector('a[data-load-more][data-infinite]');
    if (!link || !('IntersectionObserver' in window)) return;
    this.observer?.disconnect();
    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        this.observer.disconnect();
        this.loadMore(link, false);
      }
    }, { rootMargin: '600px 0px' });
    this.observer.observe(link);
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    window.removeEventListener('popstate', this.onPop);
    this.offOpen?.();
    this.offClose?.();
    this.bound = false;
  }

  onClick(e) {
    const link = e.target.closest('a[data-facet-link]');
    if (link) {
      e.preventDefault();
      this.render(link.href);
      return;
    }
    const more = e.target.closest('[data-facet-more]');
    if (more) {
      const list = more.closest('fieldset')?.querySelector('.facet__list');
      const open = more.getAttribute('aria-expanded') !== 'true';
      list?.classList.toggle('is-expanded', open);
      more.setAttribute('aria-expanded', String(open));
      if (!more.dataset.more) more.dataset.more = more.textContent;
      more.textContent = open ? more.dataset.less : more.dataset.more;
      if (open) list?.querySelector('[data-facet-extra] input:not(:disabled)')?.focus();
      return;
    }
    const loadMore = e.target.closest('a[data-load-more]');
    if (loadMore) {
      e.preventDefault();
      this.loadMore(loadMore);
      return;
    }
    const layout = e.target.closest('[data-layout-option]');
    if (layout) {
      this.applyLayout(layout.dataset.layoutOption);
      try {
        localStorage.setItem(LAYOUT_KEY, layout.dataset.layoutOption);
      } catch (_) { /* per-viewer convenience only */ }
    }
  }

  /** Builds the URL from the form (sort select included through its form attribute). */
  submit() {
    if (!this.form) return;
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(this.form)) if (value !== '') params.append(key, value);
    const action = this.form.getAttribute('action') || location.pathname;
    const query = params.toString();
    this.render(query ? `${action}?${query}` : action);
  }

  async render(url, push = true) {
    this.controller?.abort();
    this.controller = new AbortController();
    const results = this.querySelector('[data-facets-results]');
    results?.setAttribute('aria-busy', 'true');
    try {
      const doc = await fetchSection(this.sectionId, url, this.controller.signal);
      const fresh = doc.querySelector('collection-results');
      if (!fresh) throw new Error('No results section in the response');
      this.swap(fresh);
      if (push) history.pushState({ facets: true }, '', url);
      announce(fresh.querySelector('[data-product-count]')?.textContent.trim());
    } catch (err) {
      if (err.name === 'AbortError') return;
      location.assign(url);
    } finally {
      results?.removeAttribute('aria-busy');
    }
  }

  swap(fresh) {
    const results = this.querySelector('[data-facets-results]');
    const freshResults = fresh.querySelector('[data-facets-results]');
    if (results && freshResults) {
      results.replaceChildren(...freshResults.childNodes);
      scan(results);
    }
    const text = (sel) => fresh.querySelector(sel)?.textContent;
    this.querySelectorAll('[data-product-count]').forEach((n) => (n.textContent = text('[data-product-count]') ?? n.textContent));
    this.querySelectorAll('[data-facets-show]').forEach((n) => (n.textContent = text('[data-facets-show]') ?? n.textContent));

    // Filters: new counts, disabled values and active state; open/closed state stays as the buyer left it.
    const freshFacets = [...fresh.querySelectorAll('[data-facet]')];
    const current = new Map([...this.querySelectorAll('[data-facet]')].map((d) => [d.dataset.facet, d]));
    const sameSet = freshFacets.length === current.size && freshFacets.every((d) => current.has(d.dataset.facet));
    if (!sameSet && this.form) {
      const freshForm = fresh.querySelector('[data-facets-form]');
      if (freshForm) this.form.replaceChildren(...freshForm.childNodes);
    } else {
      for (const next of freshFacets) {
        const facet = current.get(next.dataset.facet);
        const summary = facet.querySelector('summary');
        summary.replaceChildren(...next.querySelector('summary').childNodes);
        // Keep the group the buyer is typing in (price inputs) as it is.
        if (facet.contains(document.activeElement) && document.activeElement.matches('[data-facet-price]')) continue;
        const focusedId = facet.contains(document.activeElement) ? document.activeElement.id : null;
        const expanded = facet.querySelector('.facet__list.is-expanded') !== null;
        facet.querySelector('[data-facet-body]').replaceChildren(...next.querySelector('[data-facet-body]').childNodes);
        if (expanded) {
          facet.querySelector('.facet__list')?.classList.add('is-expanded');
          const more = facet.querySelector('[data-facet-more]');
          if (more) {
            more.dataset.more = more.textContent;
            more.textContent = more.dataset.less;
            more.setAttribute('aria-expanded', 'true');
          }
        }
        if (focusedId) document.getElementById(focusedId)?.focus();
      }
    }
    if (this.querySelector('[data-layout-option]')) this.applyLayout(storedLayout());
    this.watchInfinite();
  }

  async loadMore(link, moveFocus = true) {
    link.setAttribute('aria-busy', 'true');
    try {
      const doc = await fetchSection(this.sectionId, link.href);
      const grid = this.querySelector('[data-product-grid]');
      const items = [...doc.querySelectorAll('[data-product-grid] > li')];
      grid.append(...items);
      const wrap = this.querySelector('[data-load-more-wrap]');
      const next = doc.querySelector('[data-load-more-wrap]');
      if (wrap) next ? wrap.replaceWith(next) : wrap.remove();
      scan(grid);
      if (moveFocus) items[0]?.querySelector('a.card__link, a')?.focus({ preventScroll: true });
      this.watchInfinite();
    } catch (_) {
      location.assign(link.href);
    }
  }

  moveForm(intoDrawer) {
    const slot = this.querySelector('[data-facets-slot]');
    const home = this.querySelector('[data-facets-home]');
    if (!this.form || !slot || !home) return;
    if (intoDrawer) slot.append(this.form);
    else home.prepend(this.form);
  }

  applyLayout(layout) {
    const grid = this.querySelector('[data-product-grid]');
    if (!grid || (layout !== 'grid' && layout !== 'list')) return;
    grid.dataset.layout = layout;
    this.querySelectorAll('[data-layout-option]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.layoutOption === layout)));
  }
}

if (!customElements.get('collection-results')) customElements.define('collection-results', CollectionResults);
