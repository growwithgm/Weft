/** Rotates announcement messages with a pause control; no rotation for reduced motion. */
document.querySelectorAll('.announcement[data-rotate]').forEach((bar) => {
  const messages = [...bar.querySelectorAll('[data-message]')];
  const pause = bar.querySelector('[data-pause]');
  if (messages.length < 2) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let paused = reduced;
  let timer;
  const show = (i) => {
    messages.forEach((m, j) => m.setAttribute('aria-hidden', String(j !== i)));
    index = i;
  };
  const schedule = () => {
    clearInterval(timer);
    if (!paused) timer = setInterval(() => show((index + 1) % messages.length), (Number(bar.dataset.rotate) || 5) * 1000);
  };
  const setPaused = (value) => {
    paused = value;
    if (pause) {
      pause.setAttribute('aria-pressed', String(value));
      pause.setAttribute('aria-label', value ? pause.dataset.labelPlay : pause.dataset.labelPause);
    }
    schedule();
  };
  pause && pause.addEventListener('click', () => setPaused(!paused));
  bar.addEventListener('mouseenter', () => clearInterval(timer));
  bar.addEventListener('mouseleave', schedule);
  bar.addEventListener('focusin', () => clearInterval(timer));
  bar.addEventListener('focusout', schedule);
  document.addEventListener('shopify:block:select', (e) => {
    const i = messages.indexOf(e.target);
    if (i >= 0) {
      setPaused(true);
      show(i);
    }
  });
  setPaused(paused);
});
