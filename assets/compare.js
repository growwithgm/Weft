/**
 * Product compare: remembers the ticked cards (browser storage, per viewer), shows the compare
 * bar, and builds the comparison table from one compare-column section per product (Section
 * Rendering API). Card checkboxes stay in sync after collection re-renders and "Load more".
 */
import { openDialog, closeDialog, announce, parseHTML } from '@weft/core';

const KEY = 'weft:compare';
const read = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list.filter((h) => typeof h === 'string') : [];
  } catch (_) {
    return [];
  }
};
const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (_) { /* storage unavailable: compare still works for this page */ }
};

class CompareDrawer extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    try {
      this.strings = JSON.parse(this.querySelector('[data-compare-strings]').textContent);
    } catch (_) {
      this.strings = {};
    }
    this.max = Number(this.dataset.max) || 4;
    this.list = read().slice(0, this.max);
    this.bar = this.querySelector('[data-compare-bar]');
    this.openButton = this.querySelector('[data-compare-open]');
    this.dialog = this.querySelector('dialog');
    this.table = this.querySelector('[data-compare-table]');
    this.notice = this.querySelector('[data-compare-notice]');

    document.addEventListener('change', (e) => {
      const box = e.target.closest('[data-compare-toggle]');
      if (box) this.toggle(box);
    });
    this.addEventListener('click', (e) => {
      if (e.target.closest('[data-compare-open]')) this.open();
      else if (e.target.closest('[data-compare-clear]')) this.set([]);
      else {
        const remove = e.target.closest('[data-compare-remove]');
        if (remove) {
          this.set(this.list.filter((h) => h !== remove.dataset.compareRemove));
          if (this.list.length) this.open();
          else closeDialog(this.dialog);
        }
      }
    });
    new MutationObserver((records) => {
      if (records.some((r) => [...r.addedNodes].some((n) => n.nodeType === 1 && (n.matches('[data-compare-toggle]') || n.querySelector('[data-compare-toggle]'))))) this.sync();
    }).observe(document.body, { childList: true, subtree: true });
    this.sync();
  }

  toggle(box) {
    this.notice.textContent = '';
    if (box.checked && !this.list.includes(box.value)) {
      if (this.list.length >= this.max) {
        box.checked = false;
        this.notice.textContent = this.strings.limit.replace('__n__', this.max);
        return;
      }
      this.set([...this.list, box.value]);
    } else if (!box.checked) {
      this.set(this.list.filter((h) => h !== box.value));
    }
  }

  set(list) {
    this.list = list;
    write(list);
    this.sync();
  }

  sync() {
    document.querySelectorAll('[data-compare-toggle]').forEach((b) => (b.checked = this.list.includes(b.value)));
    const n = this.list.length;
    this.bar.hidden = n === 0;
    this.querySelector('[data-compare-count]').textContent = (n === 1 ? this.strings.countOne : this.strings.countOther || '').replace('__n__', n);
    this.openButton.disabled = n < 2;
  }

  async open() {
    openDialog(this.dialog, this.openButton);
    this.table.setAttribute('aria-busy', 'true');
    const root = window.Shopify?.routes?.root || '/';
    const columns = await Promise.all(
      this.list.map((handle) =>
        fetch(`${root}products/${encodeURIComponent(handle)}?section_id=compare-column`)
          .then((res) => (res.ok ? res.text() : ''))
          .then((html) => parseHTML(html).querySelector('[data-compare-column]'))
          .catch(() => null)
      )
    );
    this.render(columns.filter(Boolean));
    this.table.removeAttribute('aria-busy');
  }

  render(columns) {
    if (!columns.length) {
      this.table.textContent = this.strings.error || '';
      return;
    }
    const s = this.strings;
    const keys = [];
    const labels = new Map();
    columns.forEach((col) =>
      col.querySelectorAll('[data-row]').forEach((row) => {
        if (!labels.has(row.dataset.row)) {
          keys.push(row.dataset.row);
          labels.set(row.dataset.row, row.dataset.label);
        }
      })
    );
    const table = document.createElement('table');
    table.className = `compare-table compare-table--${this.dataset.width || 'medium'}`;
    const caption = table.createCaption();
    caption.className = 'visually-hidden';
    caption.textContent = s.caption || '';
    const headRow = table.createTHead().insertRow();
    headRow.append(document.createElement('td'));
    for (const col of columns) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.append(...col.querySelector('[data-compare-head]').childNodes);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'link';
      remove.dataset.compareRemove = col.dataset.handle;
      remove.textContent = (s.remove || '').replace('__title__', col.dataset.title);
      th.append(remove);
      headRow.append(th);
    }
    const body = table.createTBody();
    const showEmpty = this.dataset.showEmpty === 'true';
    for (const key of keys) {
      const cells = columns.map((col) => col.querySelector(`[data-row="${CSS.escape(key)}"]`));
      const empty = cells.every((c) => !c || !c.textContent.trim());
      if (empty && !showEmpty) continue;
      const tr = body.insertRow();
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = labels.get(key);
      tr.append(th);
      for (const cell of cells) {
        const td = tr.insertCell();
        if (cell && cell.textContent.trim()) td.append(...cell.childNodes);
        else {
          td.className = 'compare-table__empty';
          td.textContent = this.dataset.empty || '';
        }
      }
    }
    this.table.replaceChildren(table);
    announce(this.querySelector('[data-compare-count]').textContent);
  }
}

if (!customElements.get('compare-drawer')) customElements.define('compare-drawer', CompareDrawer);
