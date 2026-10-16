/**
 * <deferred-video>: shows a poster until the visitor presses play (inline videos), or loads a
 * muted, looping background video once it scrolls into view. The player markup waits in a
 * <template>, so no video or iframe loads before it's needed. Background videos get a pause
 * button (WCAG 2.2.2) and stay paused for visitors who prefer reduced motion.
 */
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

class DeferredVideo extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.addEventListener('click', (e) => {
      if (e.target.closest('[data-video-play]')) this.load(true);
      else if (e.target.closest('[data-video-toggle]')) this.toggle();
    });
    if (this.dataset.autoplay === 'true' && !reduced()) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          this.load(false);
        }
      }, { rootMargin: '200px 0px' });
      io.observe(this);
    }
  }

  load(focus) {
    if (this.loaded) return;
    const tpl = this.querySelector('template[data-video-template]');
    if (!tpl) return;
    this.loaded = true;
    const node = tpl.content.cloneNode(true);
    this.querySelector('[data-video-poster]')?.remove();
    this.querySelector('[data-video-slot]').append(node);
    this.classList.add('is-loaded');
    const video = this.querySelector('video');
    if (video) {
      video.play().catch(() => {});
      if (focus && video.controls) video.focus();
    }
    const iframe = this.querySelector('iframe');
    if (iframe && focus) iframe.focus();
    this.querySelector('[data-video-toggle]')?.removeAttribute('hidden');
  }

  toggle() {
    const video = this.querySelector('video');
    const button = this.querySelector('[data-video-toggle]');
    if (!video || !button) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
    const paused = video.paused;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? button.dataset.playLabel : button.dataset.pauseLabel);
  }
}

if (!customElements.get('deferred-video')) customElements.define('deferred-video', DeferredVideo);
