/** <pickup-availability>: loads the pickup-availability section for the selected variant. */
class PickupAvailability extends HTMLElement {
  connectedCallback() {
    if (this.loaded === this.dataset.variantId) return;
    this.loaded = this.dataset.variantId;
    this.load();
  }

  async load() {
    const id = this.dataset.variantId;
    if (!id) return;
    try {
      const res = await fetch(`${this.dataset.baseUrl.replace(/\/$/, '')}/variants/${id}/?section_id=pickup-availability`);
      if (!res.ok) return;
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const content = doc.querySelector('[data-pickup-content]');
      this.replaceChildren(...(content ? [content] : []));
    } catch (_) { /* optional feature */ }
  }
}

if (!customElements.get('pickup-availability')) customElements.define('pickup-availability', PickupAvailability);
