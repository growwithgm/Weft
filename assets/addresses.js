/** Classic customer addresses: province list for the chosen country, with saved values preselected. */
document.querySelectorAll('[data-address-form]').forEach((form) => {
  const country = form.querySelector('[data-address-country]');
  const province = form.querySelector('[data-address-province]');
  const field = form.querySelector('[data-address-province-field]');
  if (!country || !province) return;
  if (country.dataset.default) country.value = country.dataset.default;
  const fill = (preset) => {
    let list = [];
    try {
      list = JSON.parse(country.selectedOptions[0]?.dataset.provinces || '[]');
    } catch (_) { /* none */ }
    province.replaceChildren(...list.map(([value, label]) => new Option(label, value)));
    if (preset) province.value = preset;
    field.hidden = list.length === 0;
  };
  country.addEventListener('change', () => fill());
  fill(province.dataset.default);
});
