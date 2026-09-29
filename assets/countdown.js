/** <countdown-timer>: ticks down to a merchant-set end time (seconds since epoch in data-countdown). */
class CountdownTimer extends HTMLElement {
  connectedCallback() {
    if (this.timer) return;
    this.end = Number(this.dataset.countdown) * 1000;
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.timer);
    this.timer = null;
  }

  tick() {
    const left = Math.max(0, this.end - Date.now());
    const s = Math.floor(left / 1000);
    const parts = { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
    for (const [k, v] of Object.entries(parts)) {
      const el = this.querySelector(`[data-part="${k}"]`);
      if (el) el.textContent = String(v).padStart(2, '0');
    }
    if (left <= 0) {
      clearInterval(this.timer);
      const timer = this.querySelector('.countdown__timer');
      const end = this.querySelector('.countdown__end');
      if (timer) timer.hidden = true;
      if (end) end.hidden = false;
      if (this.dataset.hideOnEnd === 'true') this.hidden = true;
    }
  }
}

if (!customElements.get('countdown-timer')) customElements.define('countdown-timer', CountdownTimer);
