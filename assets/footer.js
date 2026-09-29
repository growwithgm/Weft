/** Collapses footer menus marked data-mobile-collapse on small screens (open by default for no-JS). */
const small = matchMedia('(max-width: 749px)');
const apply = () => {
  document.querySelectorAll('.footer [data-mobile-collapse]').forEach((d) => {
    d.open = !small.matches;
  });
};
apply();
small.addEventListener('change', apply);
