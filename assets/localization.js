/** Submits the localization form when a selector changes; the Update button stays for no-JS. */
document.querySelectorAll('.localization-form').forEach((form) => {
  if (form.dataset.bound) return;
  form.dataset.bound = '1';
  const submit = form.querySelector('[data-localization-submit]');
  if (submit) submit.hidden = true;
  form.querySelectorAll('[data-localization-select]').forEach((select) => {
    select.addEventListener('change', () => form.submit());
  });
});
