/**
 * <guided-finder>: one question at a time with Back / Next and a progress line. The form stays a
 * plain GET form to the collection, so submitting builds the filter URL; unanswered questions
 * send nothing.
 */
class GuidedFinder extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.form = this.querySelector('[data-finder-form]');
    this.steps = [...this.querySelectorAll('[data-finder-step]')];
    this.back = this.querySelector('[data-finder-back]');
    this.next = this.querySelector('[data-finder-next]');
    this.submit = this.querySelector('[data-finder-submit]');
    this.progress = this.querySelector('[data-finder-progress]');
    if (this.steps.length < 2) return;
    this.index = 0;
    this.back.addEventListener('click', () => this.go(this.index - 1));
    this.next.addEventListener('click', () => this.go(this.index + 1));
    this.form.addEventListener('change', (e) => {
      if (e.target.matches('[data-finder-answer]') && this.index < this.steps.length - 1) setTimeout(() => this.go(this.index + 1), 150);
    });
    this.classList.add('is-stepped');
    this.go(0, false);
  }

  go(i, focus = true) {
    this.index = Math.max(0, Math.min(this.steps.length - 1, i));
    this.steps.forEach((step, n) => (step.hidden = n !== this.index));
    const last = this.index === this.steps.length - 1;
    this.back.hidden = this.index === 0;
    this.next.hidden = last;
    this.submit.hidden = !last;
    if (this.progress) this.progress.textContent = this.progress.dataset.template.replace('__i__', this.index + 1).replace('__n__', this.steps.length);
    if (focus) this.steps[this.index].querySelector('input')?.focus();
  }
}

if (!customElements.get('guided-finder')) customElements.define('guided-finder', GuidedFinder);
