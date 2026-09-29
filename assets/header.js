/**
 * Header: dropdown and mega-menu behaviour on top of <details> (which already works without
 * JavaScript), deferred mega-menu extras, mobile drawer built from the same menu, header height
 * variable for sticky offsets, rotating search prompts and the account menu.
 */
import { bus } from '@weft/core';

const header = document.querySelector('[data-header]');

function closeAll(except) {
  document.querySelectorAll('[data-menu-item][open], [data-account-menu][open]').forEach((d) => {
    if (d !== except && !d.contains(except)) d.open = false;
  });
}

function hydrateMega(details) {
  const tpl = details.querySelector('template[data-mega-extras]');
  if (!tpl) return;
  const frag = tpl.content.cloneNode(true);
  frag.querySelectorAll('[data-thumb-for]').forEach((node) => {
    const slot = details.querySelector(`[data-thumb="${node.dataset.thumbFor}"]`);
    if (slot) slot.replaceChildren(...node.childNodes);
  });
  const promos = frag.querySelector('[data-mega-promos]');
  if (promos) tpl.parentElement.append(promos);
  tpl.remove();
}

function initMenus(root) {
  const desktop = matchMedia('(min-width: 990px)');
  root.querySelectorAll('[data-menu-item], [data-account-menu]').forEach((details) => {
    if (details.dataset.bound) return;
    details.dataset.bound = '1';
    details.addEventListener('toggle', () => {
      if (details.open) {
        hydrateMega(details);
        if (desktop.matches && root === header) closeAll(details);
      }
    });
    const summary = details.querySelector(':scope > summary');
    if (summary) summary.setAttribute('aria-expanded', String(details.open));
    details.addEventListener('toggle', () => summary && summary.setAttribute('aria-expanded', String(details.open)));

    // Hover intent on desktop for top-level menus (click and keyboard still work).
    if (root === header && !details.matches('.menu__details--nested')) {
      let timer;
      details.addEventListener('mouseenter', () => {
        if (!desktop.matches || matchMedia('(hover: none)').matches) return;
        clearTimeout(timer);
        timer = setTimeout(() => (details.open = true), 120);
      });
      details.addEventListener('mouseleave', () => {
        if (!desktop.matches) return;
        clearTimeout(timer);
        timer = setTimeout(() => (details.open = false), 200);
      });
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = document.activeElement && document.activeElement.closest('[data-menu-item][open], [data-account-menu][open]');
  if (open) {
    open.open = false;
    open.querySelector(':scope > summary')?.focus();
  }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-menu-item], [data-account-menu]')) closeAll(null);
});
document.addEventListener('focusin', (e) => {
  if (header && !header.contains(e.target)) closeAll(null);
});

/* Mobile drawer: clone the desktop menu once, on first open. */
bus.on('dialog:open', ({ id }) => {
  if (id !== 'MenuDrawer') return;
  const drawer = document.getElementById('MenuDrawer');
  const slot = drawer && drawer.querySelector('[data-menu-drawer-nav]:empty');
  const menu = header && header.querySelector('[data-menu]');
  if (!slot || !menu) return;
  const clone = menu.cloneNode(true);
  clone.classList.add('menu--drawer');
  clone.removeAttribute('data-menu');
  clone.querySelectorAll('[open]').forEach((d) => d.removeAttribute('open'));
  clone.querySelectorAll('[data-bound]').forEach((d) => d.removeAttribute('data-bound'));
  clone.querySelectorAll('template[data-mega-extras], [data-mega-promos], .mega__thumb').forEach((n) => n.remove());
  slot.append(clone);
  initMenus(drawer);
});

/* Sticky header height → --header-height (used for scroll padding and sticky offsets). */
if (header) {
  const setHeight = () => document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  setHeight();
  new ResizeObserver(setHeight).observe(header);
  initMenus(header);
}

/* Rotating search prompts. */
const field = document.querySelector('[data-placeholders]');
if (field && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const prompts = field.dataset.placeholders.split('|').map((s) => s.trim()).filter(Boolean);
  const text = field.querySelector('[data-placeholder-text]');
  if (prompts.length > 1 && text) {
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      i = (i + 1) % prompts.length;
      text.textContent = prompts[i];
    }, 3500);
  }
}
