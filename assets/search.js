/**
 * Search drawer: predictive search through Shopify's predictive search API (rendered by the
 * predictive-search section) and voice input where the browser supports it.
 */
import { announce } from '@weft/core';

document.querySelectorAll('.search-drawer__form').forEach((form) => {
  if (form.dataset.bound) return;
  form.dataset.bound = '1';
  const input = form.querySelector('input[type="search"]');
  const results = form.querySelector('[data-predictive-results]');
  const voice = form.querySelector('[data-voice]');
  let controller;
  let timer;

  const render = async (q) => {
    if (!results) return;
    controller?.abort();
    if (!q.trim()) {
      results.replaceChildren();
      input.setAttribute('aria-expanded', 'false');
      return;
    }
    controller = new AbortController();
    const url = new URL(window.Weft.routes.predictiveSearch, location.origin);
    url.searchParams.set('q', q);
    url.searchParams.set('section_id', 'predictive-search');
    url.searchParams.set('resources[limit_scope]', 'each');
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) return;
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const content = doc.querySelector('[data-predictive-content]');
      results.replaceChildren(...(content ? content.childNodes : []));
      input.setAttribute('aria-expanded', String(!!content));
      const status = results.querySelector('[data-predictive-status]');
      if (status) announce(status.textContent);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => render(input.value), 250);
  });

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
