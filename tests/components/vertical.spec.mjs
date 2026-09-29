// Vertical sections: <guided-finder> (finder.js) builds filtered collection URLs; <compare-slider>
// (compare-slider.js) follows its range input.
import { shell } from './fixtures/shell.mjs';

const finder = `
<guided-finder class="finder__box">
  <p data-finder-progress data-template="Question __i__ of __n__"></p>
  <form action="/collections/hair" method="get" data-finder-form>
    <fieldset data-finder-step id="q1"><legend>Hair type</legend>
      <input type="radio" id="a1" name="filter.p.m.shopify.hair-type" value="Straight" data-finder-answer><label for="a1">Straight</label>
      <input type="radio" id="a2" name="filter.p.m.shopify.hair-type" value="Curly" data-finder-answer><label for="a2">Curly</label>
    </fieldset>
    <fieldset data-finder-step id="q2"><legend>Concern</legend>
      <input type="radio" id="b1" name="filter.p.tag" value="Frizz" data-finder-answer><label for="b1">Frizz</label>
      <input type="radio" id="b2" name="filter.p.tag" value="Volume" data-finder-answer><label for="b2">Volume</label>
    </fieldset>
    <button type="button" data-finder-back id="back" hidden>Back</button>
    <button type="button" data-finder-next id="next" hidden>Next</button>
    <button type="submit" data-finder-submit id="go">Show my products</button>
  </form>
</guided-finder>`;

const slider = `
<compare-slider class="compare-slider" style="--pos: 50%; width: 400px; aspect-ratio: 1">
  <figure class="compare-slider__before media"><figcaption>Before</figcaption></figure>
  <figure class="compare-slider__after media"><figcaption>After</figcaption></figure>
  <span class="compare-slider__handle"></span>
  <label for="r" class="visually-hidden">Compare</label>
  <input class="compare-slider__range" type="range" id="r" min="0" max="100" step="1" value="50" data-compare-range>
</compare-slider>`;

export const tests = {
  async 'guided finder steps through questions and submits filter parameters'({ page, base, expect, eventually }) {
    let requested = null;
    await page.route('**/collections/hair?*', (r) => {
      requested = new URL(r.request().url());
      r.fulfill({ contentType: 'text/html', body: '<title>Results</title>' });
    });
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(finder, { head: '<link rel="stylesheet" href="/assets/section-vertical.css">', modules: ['finder.js'] }) }));
    await page.goto(`${base}/fixture.html`);
    await page.waitForFunction(() => document.querySelector('guided-finder').classList.contains('is-stepped'));
    expect(await page.$eval('#q2', (q) => q.hidden), 'second question waits').toBe(true);
    expect(await page.$eval('[data-finder-progress]', (p) => p.textContent), 'progress').toBe('Question 1 of 2');
    expect(await page.$eval('#go', (b) => b.hidden), 'submit hidden until the last question').toBe(true);
    await page.click('label[for="a2"]');
    await eventually(() => !document.getElementById('q2').hidden, 'answer moves to the next question');
    await page.click('#back');
    expect(await page.$eval('#a2', (i) => i.checked), 'answer kept when going back').toBe(true);
    await page.click('#next');
    await page.click('label[for="b1"]');
    await page.click('#go');
    await page.waitForURL('**/collections/hair?**');
    expect(requested.searchParams.get('filter.p.m.shopify.hair-type'), 'first filter').toBe('Curly');
    expect(requested.searchParams.get('filter.p.tag'), 'second filter').toBe('Frizz');
  },

  async 'before/after slider follows the keyboard'({ page, base, expect }) {
    await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(slider, { head: '<link rel="stylesheet" href="/assets/section-vertical.css">', modules: ['compare-slider.js'] }) }));
    await page.goto(`${base}/fixture.html`);
    await page.waitForFunction(() => document.querySelector('compare-slider').classList.contains('is-ready'));
    await page.focus('#r');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    expect(await page.$eval('compare-slider', (c) => c.style.getPropertyValue('--pos')), 'split moved').toBe('52%');
    await page.keyboard.press('Home');
    expect(await page.$eval('compare-slider', (c) => c.style.getPropertyValue('--pos')), 'Home').toBe('0%');
  }
};
