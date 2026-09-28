/**
 * Carousels for the section library.
 * - <slide-show>: slideshow, testimonials, navigation slideshow. The track is a scroll-snap row,
 *   so slides swipe and scroll without JavaScript; this adds arrows, dots, fade transitions and
 *   autoplay with a pause button (autoplay is off for reduced motion, pauses on hover / focus /
 *   hidden tab).
 * - <scroll-row>: previous / next buttons for scroll-snap rows (product, collection and column
 *   carousels), disabled at either end.
 * - <marquee-row>: continuous scrolling banner, stopped for reduced motion.
 */
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

class SlideShow extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.track = this.querySelector('[data-track]');
    this.slides = [...this.querySelectorAll('[data-slide]')];
    if (!this.track || this.slides.length < 2) return;
    this.fade = this.dataset.transition === 'fade';
    this.index = 0;
    this.classList.add('is-ready');
    this.addEventListener('click', (e) => {
      if (e.target.closest('[data-prev]')) this.go(this.index - 1, true);
      else if (e.target.closest('[data-next]')) this.go(this.index + 1, true);
      else if (e.target.closest('[data-dot]')) this.go(Number(e.target.closest('[data-dot]').dataset.dot), true);
      else if (e.target.closest('[data-autoplay-toggle]')) this.toggleAutoplay();
    });
    this.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') this.go(this.index + (document.dir === 'rtl' ? -1 : 1), true);
      if (e.key === 'ArrowLeft') this.go(this.index + (document.dir === 'rtl' ? 1 : -1), true);
    });
    if (!this.fade) {
      this.track.addEventListener('scroll', () => {
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => this.syncFromScroll(), 60);
      }, { passive: true });
    }
    this.render();
    this.autoplay = this.dataset.autoplay === 'true' && !reduced();
    this.paused = false;
    if (this.autoplay) {
      if (this.dataset.pauseHover !== 'false') {
        this.addEventListener('pointerenter', () => this.hold(true));
        this.addEventListener('pointerleave', () => this.hold(false));
      }
      this.addEventListener('focusin', () => this.hold(true));
      this.addEventListener('focusout', (e) => !this.contains(e.relatedTarget) && this.hold(false));
      document.addEventListener('visibilitychange', () => this.hold(document.hidden));
      this.start();
    } else {
      this.querySelector('[data-autoplay-toggle]')?.setAttribute('hidden', '');
    }
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }

  syncFromScroll() {
    const left = Math.abs(this.track.scrollLeft);
    let best = 0;
    this.slides.forEach((slide, i) => {
      if (Math.abs(slide.offsetLeft - this.track.offsetLeft - left) < Math.abs(this.slides[best].offsetLeft - this.track.offsetLeft - left)) best = i;
    });
    // A second smooth scroll started while one is running can be dropped by the browser:
    // keep going until the slide we were asked for is reached.
    if (this.target != null) {
      if (best !== this.target && this.retries++ < 3) {
        this.scrollToSlide(this.target);
        return;
      }
      this.target = null;
    }
    if (best !== this.index) {
      this.index = best;
      this.render();
    }
  }

  go(i, user = false) {
    const n = this.slides.length;
    this.index = (i + n) % n;
    if (!this.fade) {
      this.target = this.index;
      this.retries = 0;
      this.scrollToSlide(this.index);
    }
    this.render();
    if (user && this.autoplay && !this.paused) this.start();
  }

  scrollToSlide(i) {
    const slide = this.slides[i];
    this.track.scrollTo({ left: slide.offsetLeft - this.track.offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
  }

  render() {
    this.slides.forEach((slide, i) => {
      const active = i === this.index;
      slide.classList.toggle('is-active', active);
      if (this.fade) slide.inert = !active;
    });
    this.querySelectorAll('[data-dot]').forEach((dot) => dot.toggleAttribute('aria-current', Number(dot.dataset.dot) === this.index));
  }

  start() {
    clearInterval(this.timer);
    const ms = (Number(this.dataset.speed) || 5) * 1000;
    this.timer = setInterval(() => !this.held && this.go(this.index + 1), ms);
    this.track.setAttribute('aria-live', 'off');
  }

  hold(on) {
    this.held = on;
  }

  toggleAutoplay() {
    const button = this.querySelector('[data-autoplay-toggle]');
    this.paused = !this.paused;
    if (this.paused) {
      clearInterval(this.timer);
      this.track.setAttribute('aria-live', 'polite');
    } else this.start();
    button.setAttribute('aria-pressed', String(this.paused));
    button.setAttribute('aria-label', this.paused ? button.dataset.playLabel : button.dataset.pauseLabel);
  }
}

class ScrollRow extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.list = this.querySelector('[data-scroll-list]');
    this.prev = this.querySelector('[data-scroll-prev]');
    this.next = this.querySelector('[data-scroll-next]');
    if (!this.list || !this.prev || !this.next) return;
    // Steps add up from the last target, so quick repeated clicks move several pages even when
    // the browser drops a smooth scroll that starts while another is running.
    const step = (dir) => {
      const max = this.list.scrollWidth - this.list.clientWidth;
      const from = this.targetLeft ?? Math.abs(this.list.scrollLeft);
      this.targetLeft = Math.min(max, Math.max(0, from + dir * this.list.clientWidth * 0.9));
      this.retries = 0;
      this.scrollToTarget();
    };
    this.prev.addEventListener('click', () => step(-1));
    this.next.addEventListener('click', () => step(1));
    this.list.addEventListener('scroll', () => {
      this.update();
      clearTimeout(this.settle);
      this.settle = setTimeout(() => {
        if (this.targetLeft == null) return;
        if (Math.abs(Math.abs(this.list.scrollLeft) - this.targetLeft) > 2 && this.retries++ < 3) this.scrollToTarget();
        else this.targetLeft = null;
      }, 80);
    }, { passive: true });
    new ResizeObserver(() => this.update()).observe(this.list);
    this.update();
  }

  scrollToTarget() {
    const rtl = getComputedStyle(this.list).direction === 'rtl' ? -1 : 1;
    this.list.scrollTo({ left: this.targetLeft * rtl, behavior: reduced() ? 'auto' : 'smooth' });
  }

  update() {
    const max = this.list.scrollWidth - this.list.clientWidth;
    const pos = Math.abs(this.list.scrollLeft);
    this.prev.disabled = pos <= 2;
    this.next.disabled = pos >= max - 2;
    this.toggleAttribute('data-scrollable', max > 2);
  }
}

/** <marquee-row>: repeats the items until the row is wide enough, then once more for a seamless loop. */
class MarqueeRow extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    const track = this.querySelector('[data-marquee-track]');
    if (!track || !track.children.length || reduced()) return;
    const copy = (nodes) =>
      nodes.forEach((node) => {
        const c = node.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.removeAttribute('data-shopify-editor-block');
        c.inert = true;
        track.append(c);
      });
    const items = [...track.children];
    for (let i = 0; i < 12 && track.scrollWidth < this.clientWidth; i++) copy(items);
    copy([...track.children]);
    const speed = Number(getComputedStyle(this).getPropertyValue('--marquee-speed')) || 4;
    this.style.setProperty('--marquee-duration', `${Math.max(6, track.scrollWidth / 2 / (speed * 25))}s`);
    this.classList.add('is-animated');
  }
}

if (!customElements.get('marquee-row')) customElements.define('marquee-row', MarqueeRow);
if (!customElements.get('slide-show')) customElements.define('slide-show', SlideShow);
if (!customElements.get('scroll-row')) customElements.define('scroll-row', ScrollRow);
