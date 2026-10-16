/**
 * <product-tabs>: builds an ARIA tablist from the panels' titles. Arrow keys, Home and End move
 * between tabs (automatic activation). Without JavaScript every panel shows with its heading.
 */
class ProductTabs extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.list = this.querySelector('[data-tablist]');
    this.panels = [...this.querySelectorAll(':scope > [data-tab-panel]')];
    if (!this.list || this.panels.length < 2) return;
    this.tabs = this.panels.map((panel, i) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tabs__tab';
      tab.id = `${panel.id}-tab`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      tab.textContent = panel.dataset.tabTitle;
      tab.addEventListener('click', () => this.select(i));
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      return tab;
    });
    this.list.append(...this.tabs);
    this.list.addEventListener('keydown', (e) => {
      const i = this.tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const rtl = getComputedStyle(this).direction === 'rtl';
      const map = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, Home: -Infinity, End: Infinity };
      if (!(e.key in map)) return;
      e.preventDefault();
      const n = this.tabs.length;
      const next = map[e.key] === -Infinity ? 0 : map[e.key] === Infinity ? n - 1 : (i + map[e.key] + n) % n;
      this.select(next, true);
    });
    this.classList.add('is-ready');
    this.select(0);
  }

  select(index, focus = false) {
    this.tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      this.panels[i].hidden = !on;
    });
    if (focus) this.tabs[index].focus();
  }
}

if (!customElements.get('product-tabs')) customElements.define('product-tabs', ProductTabs);
