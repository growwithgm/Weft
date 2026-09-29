/** <compare-slider>: the range input moves the split between the before and after images. */
class CompareSlider extends HTMLElement {
  connectedCallback() {
    const range = this.querySelector('[data-compare-range]');
    if (!range || this.bound) return;
    this.bound = true;
    const update = () => this.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', update);
    update();
    this.classList.add('is-ready');
  }
}

if (!customElements.get('compare-slider')) customElements.define('compare-slider', CompareSlider);
