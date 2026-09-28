/**
 * <hot-spots>: hotspots for shoppable images and product features. Each hotspot is a <details>
 * element, so it opens without JavaScript; this closes the others when one opens, closes on
 * Escape (focus back on the dot) and on outside clicks, and flips a card that would overflow.
 */
class HotSpots extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.spots = [...this.querySelectorAll('details[data-hotspot]')];
    this.spots.forEach((spot) => spot.addEventListener('toggle', () => spot.open && this.opened(spot)));
    this.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const open = this.spots.find((s) => s.open);
      if (!open) return;
      open.open = false;
      open.querySelector('summary').focus();
    });
    this.outside = (e) => !this.contains(e.target) && this.spots.forEach((s) => (s.open = false));
    document.addEventListener('click', this.outside);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.outside);
    this.bound = false;
  }

  opened(spot) {
    this.spots.forEach((other) => other !== spot && (other.open = false));
    const card = spot.querySelector('.hotspot__card');
    if (!card) return;
    spot.classList.remove('hotspot--flip-x', 'hotspot--flip-start', 'hotspot--flip-y');
    const box = this.getBoundingClientRect();
    const r = card.getBoundingClientRect();
    // Past the start edge the card aligns to the dot's start; past the end edge, to its end.
    const rtl = getComputedStyle(this).direction === 'rtl';
    const overStart = rtl ? r.right > box.right : r.left < box.left;
    const overEnd = rtl ? r.left < box.left : r.right > box.right;
    if (overStart) spot.classList.add('hotspot--flip-start');
    else if (overEnd) spot.classList.add('hotspot--flip-x');
    if (r.bottom > box.bottom) spot.classList.add('hotspot--flip-y');
  }
}

if (!customElements.get('hot-spots')) customElements.define('hot-spots', HotSpots);
