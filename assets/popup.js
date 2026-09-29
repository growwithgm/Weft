/**
 * <site-popup>: decides when the pop-up shows (delay, scroll, exit intent), remembers when it
 * was closed (browser storage, per viewer) and runs age verification. In the theme editor it
 * opens when its section is selected. Centered pop-ups are modal; corner pop-ups are not.
 */
const key = (id) => `weft:popup:${id}`;
const read = (id) => {
  try {
    return Number(localStorage.getItem(key(id))) || 0;
  } catch (_) {
    return 0;
  }
};
const remember = (id, days) => {
  try {
    localStorage.setItem(key(id), String(Date.now() + days * 86400000));
  } catch (_) { /* storage unavailable: the pop-up may show again */ }
};

class SitePopup extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    const d = this.dataset;
    this.dialog = this.querySelector('dialog');
    this.id = d.sectionId;
    this.days = Number(d.days) || 14;
    this.addEventListener('click', (e) => {
      if (e.target.closest('[data-popup-close]')) this.close();
      else if (e.target.closest('[data-age-yes]')) {
        remember(this.id, this.days);
        this.answered = true;
        this.close(false);
      } else if (e.target.closest('[data-age-no]')) {
        this.querySelector('[data-age-actions]').hidden = true;
        this.querySelector('[data-age-declined]').hidden = false;
      }
    });
    this.dialog.addEventListener('cancel', (e) => {
      if (d.mode === 'age_verification') e.preventDefault();
      else {
        e.preventDefault();
        this.close();
      }
    });
    // Browsers let Escape close a dialog even when "cancel" is prevented (no recent user
    // activation), so an unanswered age check opens again straight away.
    this.dialog.addEventListener('close', () => {
      if (d.mode === 'age_verification' && !this.answered && !window.Weft?.designMode) this.dialog.showModal();
    });
    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog && d.mode !== 'age_verification') this.close();
    });
    if (window.Weft?.designMode) {
      document.addEventListener('shopify:section:select', (e) => e.detail.sectionId === this.id && this.open());
      document.addEventListener('shopify:section:deselect', (e) => e.detail.sectionId === this.id && this.close(false));
      return;
    }
    if (read(this.id) > Date.now()) return;
    if (d.mode === 'age_verification') return this.open();
    if (/[?&]customer_posted=true/.test(location.search) && this.querySelector('form[action*="contact"]')) return this.open();
    if (d.guestsOnly === 'true' && d.customer === 'true') return;
    if (d.mobile === 'false' && matchMedia('(max-width: 749px)').matches) return;
    this.schedule();
  }

  schedule() {
    const d = this.dataset;
    const delay = (Number(d.delay) || 0) * 1000;
    if (d.trigger === 'scroll') {
      const onScroll = () => {
        if (window.scrollY + innerHeight >= document.documentElement.scrollHeight * 0.5) {
          removeEventListener('scroll', onScroll);
          this.open();
        }
      };
      addEventListener('scroll', onScroll, { passive: true });
    } else if (d.trigger === 'exit' && matchMedia('(hover: hover)').matches) {
      const onLeave = (e) => {
        if (e.clientY <= 0) {
          document.removeEventListener('mouseout', onLeave);
          this.open();
        }
      };
      setTimeout(() => document.addEventListener('mouseout', onLeave), delay);
    } else {
      setTimeout(() => this.open(), delay);
    }
  }

  open() {
    if (this.dialog.open) return;
    if (document.querySelector('dialog[open]') && !window.Weft?.designMode) return;
    if (this.dataset.modal === 'true') this.dialog.showModal();
    else this.dialog.show();
    this.dialog.querySelector('input:not([type="hidden"]), button')?.focus();
  }

  close(save = true) {
    if (save) remember(this.id, this.days);
    this.dialog.close();
  }
}

if (!customElements.get('site-popup')) customElements.define('site-popup', SitePopup);
