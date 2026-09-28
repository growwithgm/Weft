/**
 * Search drawer: predictive search through Shopify's predictive search API (rendered by the
 * predictive-search section), an ARIA combobox (arrows, Enter, Escape), rotating prompts, the
 * optional product type filter and voice input where the browser supports it.
 * The form itself is a plain GET form to the search page.
 */
import { announce } from '@weft/core';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('.search-drawer__form').forEach((form) => {
  if (form.dataset.bound) return;
  form.dataset.bound = '1';
  const input = form.querySelector('input[type="search"]');
  const results = form.querySelector('[data-predictive-results]');
  const voice = form.querySelector('[data-voice]');
  const typeFilter = form.querySelector('[data-type-filter]');
  let controller;
  let timer;

  const options = () => (results ? [...results.querySelectorAll('[role="option"]')] : []);
  const setActive = (option) => {
    options().forEach((o) => o.setAttribute('aria-selected', String(o === option)));
    if (option) {
      input.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  };
  const close = () => {
    results?.replaceChildren();
    input.setAttribute('aria-expanded', 'false');
    setActive(null);
  };

  const render = async (q) => {
    if (!results) return;
    controller?.abort();
    if (!q.trim()) return close();
    controller = new AbortController();
    const url = new URL(window.Weft.routes.predictiveSearch, location.origin);
    url.searchParams.set('q', q);
    url.searchParams.set('section_id', 'predictive-search');
    url.searchParams.set('resources[type]', 'query,product,collection,page,article');
    url.searchParams.set('resources[limit]', form.dataset.predictiveLimit || '5');
    url.searchParams.set('resources[limit_scope]', 'each');
    if (form.dataset.predictiveFields) url.searchParams.set('resources[options][fields]', form.dataset.predictiveFields);
    results.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) return;
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const content = doc.querySelector('[data-predictive-content]');
      results.replaceChildren(...(content ? content.childNodes : []));
      input.setAttribute('aria-expanded', String(!!results.querySelector('[role="listbox"]')));
      setActive(null);
      const status = results.querySelector('[data-predictive-status]');
      if (status) announce(status.textContent);
    } catch (err) {
      if (err.name !== 'AbortError') close();
    } finally {
      results.removeAttribute('aria-busy');
    }
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => render(input.value), 250);
  });
  // Text typed while this module was still loading gets its results too.
  if (input.value.trim()) render(input.value);

  input.addEventListener('keydown', (e) => {
    const list = options();
    const current = list.findIndex((o) => o.getAttribute('aria-selected') === 'true');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!list.length) return;
      e.preventDefault();
      const next = e.key === 'ArrowDown' ? (current + 1) % list.length : (current <= 0 ? list.length : current) - 1;
      setActive(list[next]);
    } else if (e.key === 'Enter' && current >= 0) {
      const link = list[current].querySelector('a');
      if (link) {
        e.preventDefault();
        location.assign(link.href);
      }
    } else if (e.key === 'Escape' && input.getAttribute('aria-expanded') === 'true') {
      // First Escape closes the results; the next one closes the drawer.
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  });
  results?.addEventListener('mousemove', (e) => {
    const option = e.target.closest('[role="option"]');
    if (option && option.getAttribute('aria-selected') !== 'true') setActive(option);
  });

  // Product type filter: named only when a type is chosen, so "All" adds nothing to the URL.
  if (typeFilter) {
    const sync = () => (typeFilter.value ? typeFilter.setAttribute('name', 'filter.p.product_type') : typeFilter.removeAttribute('name'));
    typeFilter.addEventListener('change', sync);
    sync();
  }

  // Rotating prompts in the empty field.
  let prompts = [];
  try {
    prompts = JSON.parse(form.dataset.prompts || '[]').filter(Boolean);
  } catch (_) { /* no prompts */ }
  const mobileOk = form.dataset.promptsMobile === 'true' || matchMedia('(min-width: 750px)').matches;
  if (prompts.length > 1 && mobileOk && !reduceMotion.matches) {
    let i = 0;
    setInterval(() => {
      if (input.value) return;
      i = (i + 1) % prompts.length;
      input.placeholder = prompts[i];
    }, 3000);
  }

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (voice && Recognition) {
    voice.hidden = false;
    voice.setAttribute('aria-pressed', 'false');
    voice.addEventListener('click', () => {
      const rec = new Recognition();
      rec.lang = document.documentElement.lang || 'en';
      rec.interimResults = false;
      voice.setAttribute('aria-pressed', 'true');
      rec.onresult = (e) => {
        input.value = e.results[0][0].transcript;
        render(input.value);
      };
      rec.onend = () => voice.setAttribute('aria-pressed', 'false');
      rec.start();
    });
  }
});
