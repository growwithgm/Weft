/**
 * <product-gallery>: mobile carousel counter, thumbnails, scroll to the variant's media,
 * players for video / external video / 3D on interaction, lightbox and hover magnify.
 */
import { bus, openDialog } from '@weft/core';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

class ProductGallery extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.list = this.querySelector('[data-gallery-list]');
    this.counter = this.querySelector('[data-gallery-counter]');
    if (!this.list) return;
    this.items = [...this.list.children];
    this.list.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.addEventListener('click', (e) => this.onClick(e));
    if (this.dataset.zoom === 'hover' || this.dataset.zoom === 'both') this.initHoverZoom();
    this.unsubscribe = bus.on('variant:change', ({ section, featuredMediaId }) => {
      if (section && section.contains(this) && featuredMediaId) this.show(String(featuredMediaId));
    });
  }

  disconnectedCallback() {
    this.unsubscribe && this.unsubscribe();
  }

  isCarousel() {
    return getComputedStyle(this.list).overflowX === 'auto' || getComputedStyle(this.list).overflowX === 'scroll';
  }

  onScroll() {
    if (!this.isCarousel()) return;
    const width = this.list.clientWidth || 1;
    const index = Math.round(Math.abs(this.list.scrollLeft) / width);
    // While a thumbnail or variant change scrolls smoothly, the slides passed on the way don't count.
    if (this.target != null) {
      if (index !== this.target) return;
      this.target = null;
    }
    this.setActive(index);
  }

  setActive(index) {
    this.items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    if (this.counter) this.counter.textContent = this.counter.dataset.template.replace('__i__', index + 1);
    const activeId = this.items[index] && this.items[index].dataset.mediaId;
    this.querySelectorAll('[data-thumb-target]').forEach((t) => t.toggleAttribute('aria-current', t.dataset.thumbTarget === activeId));
    this.items.forEach((item, i) => {
      if (i !== index) item.querySelectorAll('video').forEach((v) => v.pause());
    });
  }

  show(mediaId) {
    const index = this.items.findIndex((i) => i.dataset.mediaId === mediaId);
    if (index < 0) return;
    const item = this.items[index];
    if (this.isCarousel()) {
      this.target = index;
      clearTimeout(this.targetTimer);
      this.targetTimer = setTimeout(() => (this.target = null), 1000);
      this.list.scrollTo({ left: item.offsetLeft - this.list.offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
    }
    else if (this.dataset.layoutScroll !== 'none' && !this.matches('.gallery--stacked, .gallery--grid, .gallery--grid_even')) item.scrollIntoView({ block: 'nearest' });
    this.setActive(index);
  }

  onClick(e) {
    const thumb = e.target.closest('[data-thumb-target]');
    if (thumb) {
      this.show(thumb.dataset.thumbTarget);
      const item = this.items.find((i) => i.dataset.mediaId === thumb.dataset.thumbTarget);
      if (item && !this.isCarousel()) item.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    const play = e.target.closest('[data-play-media]');
    if (play) {
      this.play(play);
      return;
    }
    const zoom = e.target.closest('[data-open-lightbox]');
    if (zoom) {
      const mobile = matchMedia('(max-width: 989px)').matches;
      if (mobile && this.dataset.lightboxMobile === 'false') return;
      this.openLightbox(zoom.dataset.openLightbox, zoom);
    }
  }

  play(button) {
    const media = button.closest('.gallery__media');
    const tpl = media.querySelector('template[data-media-player]');
    if (!tpl) return;
    const node = tpl.content.cloneNode(true);
    media.querySelectorAll('img, .gallery__play').forEach((n) => n.remove());
    media.append(node);
    media.classList.add('is-playing');
    const video = media.querySelector('video');
    if (video) video.play().catch(() => {});
    const iframe = media.querySelector('iframe');
    if (iframe) iframe.focus();
    if (button.hasAttribute('data-model') && window.Shopify && window.Shopify.loadFeatures) {
      window.Shopify.loadFeatures([
        { name: 'model-viewer-ui', version: '1.0', onLoad: () => {
          const viewer = media.querySelector('model-viewer');
          if (viewer && window.Shopify.ModelViewerUI) new window.Shopify.ModelViewerUI(viewer);
        } },
        { name: 'shopify-xr', version: '1.0', onLoad: () => window.ShopifyXR && window.ShopifyXR.setupXRElements() }
      ]);
    }
  }

  openLightbox(mediaId, opener) {
    const dialog = this.querySelector('[data-lightbox]');
    if (!dialog) return;
    openDialog(dialog, opener);
    const item = dialog.querySelector(`[data-lightbox-item="${mediaId}"]`);
    if (item) item.scrollIntoView({ block: 'start' });
    if (!dialog.dataset.zoomBound) {
      dialog.dataset.zoomBound = '1';
      dialog.addEventListener('click', (e) => {
        const img = e.target.closest('[data-zoomable]');
        if (!img) return;
        img.classList.toggle('is-zoomed');
      });
    }
  }

  initHoverZoom() {
    if (matchMedia('(hover: none)').matches) return;
    this.list.addEventListener('pointermove', (e) => {
      const img = e.target.closest('.gallery__image');
      if (!img || this.isCarousel()) return;
      const r = img.getBoundingClientRect();
      img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      img.classList.add('is-magnified');
    });
    this.list.addEventListener('pointerout', (e) => {
      const img = e.target.closest('.gallery__image');
      if (img) img.classList.remove('is-magnified');
    });
  }
}

if (!customElements.get('product-gallery')) customElements.define('product-gallery', ProductGallery);
