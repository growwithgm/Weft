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
    const list = dialog.querySelector('[data-lightbox-list]');
    if (!list) return;
    const items = [...list.querySelectorAll('[data-lightbox-item]')];
    const thumbs = [...dialog.querySelectorAll('[data-lightbox-thumb]')];
    const counter = dialog.querySelector('[data-lightbox-counter]');
    const progress = dialog.querySelector('.lightbox__progress');
    const sync = () => {
      const index = Math.min(items.length - 1, Math.round(list.scrollTop / (list.clientHeight || 1)));
      thumbs.forEach((t, i) => (i === index ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current')));
      if (thumbs[index]) thumbs[index].scrollIntoView({ block: 'nearest' });
      if (counter) counter.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : '';
      if (progress) {
        progress.style.setProperty('--lb-size', String(1 / (items.length || 1)));
        progress.style.setProperty('--lb-pos', String(index / (items.length || 1)));
      }
    };
    const item = items.find((i) => i.dataset.lightboxItem === mediaId) || items[0];
    if (item) list.scrollTop = item.offsetTop;
    sync();
    if (!dialog.dataset.zoomBound) {
      dialog.dataset.zoomBound = '1';
      list.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
      dialog.addEventListener('close', () => dialog.querySelectorAll('.is-zoomed').forEach((n) => n.classList.remove('is-zoomed')));
      dialog.addEventListener('click', (e) => {
        const thumb = e.target.closest('[data-lightbox-thumb]');
        if (thumb) {
          const target = items.find((i) => i.dataset.lightboxItem === thumb.dataset.lightboxThumb);
          if (target) list.scrollTo({ top: target.offsetTop, behavior: reduced() ? 'auto' : 'smooth' });
          return;
        }
        const img = e.target.closest('[data-zoomable]');
        if (!img) return;
        const box = img.closest('.lightbox__item');
        const r = img.getBoundingClientRect();
        const fx = (e.clientX - r.left) / (r.width || 1);
        const fy = (e.clientY - r.top) / (r.height || 1);
        const zoomed = img.classList.toggle('is-zoomed');
        if (!box) return;
        box.classList.toggle('is-zoomed', zoomed);
        // Keep the clicked spot under the pointer: scroll the zoomed photo to it.
        if (zoomed) box.scrollTo({ left: fx * img.offsetWidth - box.clientWidth / 2, top: fy * img.offsetHeight - box.clientHeight / 2 });
      });
      dialog.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        if (e.target.closest('input, select, textarea')) return;
        e.preventDefault();
        const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
        list.scrollBy({ top: dir * list.clientHeight, behavior: reduced() ? 'auto' : 'smooth' });
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
