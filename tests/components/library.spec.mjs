// Section library islands: <slide-show>, <scroll-row>, <marquee-row> (carousel.js) and
// <deferred-video> (video.js).
import { shell } from './fixtures/shell.mjs';

const img = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22/%3E';

const slideshow = ({ transition = 'slide', autoplay = false } = {}) => `
<slide-show class="slideshow slideshow--${transition}" role="region" aria-roledescription="carousel" aria-label="Brand" data-transition="${transition}" data-autoplay="${autoplay}" data-speed="3" data-pause-hover="true" style="width: 600px">
  <div class="slideshow__track" data-track aria-live="polite">
    ${[1, 2, 3].map((n) => `<div class="slideshow__slide" data-slide role="group" aria-roledescription="slide" id="s${n}" style="height: 200px"><img src="${img}" alt="" style="width: 100%"><a href="/p${n}" id="link${n}">Slide ${n}</a></div>`).join('')}
  </div>
  <div class="slideshow__controls">
    <button type="button" data-prev id="prev">Prev</button>
    <div class="slideshow__dots">${[0, 1, 2].map((i) => `<button type="button" class="slideshow__dot" data-dot="${i}" id="dot${i}" aria-label="Slide ${i + 1} of 3"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}</div>
    <button type="button" data-next id="next">Next</button>
    <button type="button" class="slideshow__pause" data-autoplay-toggle id="pause" aria-pressed="false" aria-label="Pause" data-pause-label="Pause" data-play-label="Play">P</button>
  </div>
</slide-show>`;

const row = `
<scroll-row class="scroll-row scroll-row--carousel" style="display: block; width: 400px">
  <ul class="columns-grid is-carousel" data-scroll-list style="--cols: 2; --cols-mobile: 2">${Array.from({ length: 6 }, (_, i) => `<li style="height: 80px">Item ${i}</li>`).join('')}</ul>
  <div class="scroll-row__buttons"><button type="button" data-scroll-prev id="rprev">Prev</button><button type="button" data-scroll-next id="rnext">Next</button></div>
</scroll-row>`;

const marquee = `
<div class="marquee-section" style="width: 800px">
  <marquee-row class="marquee" style="--marquee-gap: 40px; --marquee-speed: 4;">
    <ul class="marquee__track" role="list" data-marquee-track>
      <li class="marquee__item" data-shopify-editor-block="x"><span class="marquee__text">Free delivery</span></li>
      <li class="marquee__item"><span class="marquee__text">New in</span></li>
    </ul>
  </marquee-row>
</div>`;

const video = `
<div style="width: 640px; height: 360px"><deferred-video class="deferred-video" data-autoplay="false" id="inline">
  <div class="deferred-video__slot" data-video-slot><div class="deferred-video__poster" data-video-poster><img src="${img}" alt=""><button type="button" data-video-play id="play">Play</button></div></div>
  <template data-video-template><video id="inline-player" controls muted playsinline></video></template>
</deferred-video></div>
<div style="height: 2000px"></div>
<div style="width: 640px; height: 360px"><deferred-video class="deferred-video deferred-video--background" data-autoplay="true" id="bg">
  <div class="deferred-video__slot" data-video-slot><div class="deferred-video__poster" data-video-poster><img src="${img}" alt=""></div></div>
  <button type="button" class="deferred-video__toggle" data-video-toggle hidden aria-pressed="false" aria-label="Pause" data-pause-label="Pause" data-play-label="Play" id="toggle">T</button>
  <template data-video-template><video id="bg-player" muted loop playsinline></video></template>
</deferred-video></div>`;

const open = async (page, base, body, modules, { reducedMotion } = {}) => {
  if (reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/fixture.html', (r) => r.fulfill({ contentType: 'text/html', body: shell(body, { head: '<link rel="stylesheet" href="/assets/section-library.css">', modules }) }));
  await page.goto(`${base}/fixture.html`);
};

export const tests = {
  async 'slideshow arrows and dots move between slides and mark the current dot'({ page, base, expect, eventually }) {
    await open(page, base, slideshow(), ['carousel.js']);
    await page.waitForFunction(() => document.querySelector('slide-show').classList.contains('is-ready'));
    expect(await page.$eval('#pause', (b) => b.hidden), 'no pause button without autoplay').toBe(true);
    await page.click('#next');
    await eventually(() => document.getElementById('dot1').hasAttribute('aria-current'), 'second dot current');
    await eventually(() => Math.round(document.querySelector('[data-track]').scrollLeft) === 600, 'track scrolled to slide 2');
    await page.click('#dot2');
    await eventually(() => document.getElementById('s3').classList.contains('is-active'), 'dot jumps to slide 3');
    // Clicked while the previous smooth scroll is still running.
    await page.click('#next');
    await eventually(() => document.getElementById('dot0').hasAttribute('aria-current'), 'wraps to the first slide');
    await eventually(() => Math.round(document.querySelector('[data-track]').scrollLeft) === 0, 'and actually scrolls back');
  },

  async 'fade slideshow keeps hidden slides out of the tab order'({ page, base, expect }) {
    await open(page, base, slideshow({ transition: 'fade' }), ['carousel.js']);
    await page.waitForFunction(() => document.querySelector('slide-show').classList.contains('is-ready'));
    expect(await page.$eval('#s2', (s) => s.inert), 'inactive slide inert').toBe(true);
    await page.click('#next');
    expect(await page.$eval('#s2', (s) => s.inert), 'active slide reachable').toBe(false);
    expect(await page.$eval('#s1', (s) => s.inert), 'previous slide inert').toBe(true);
  },

  async 'autoplay advances, pauses on hover and stops with the pause button'({ page, base, expect, eventually }) {
    await open(page, base, slideshow({ autoplay: true }), ['carousel.js']);
    await page.mouse.move(1000, 700);
    await eventually(() => document.getElementById('dot1').hasAttribute('aria-current'), 'advanced after the interval');
    await page.click('#pause');
    expect(await page.$eval('#pause', (b) => b.getAttribute('aria-pressed')), 'pressed').toBe('true');
    expect(await page.$eval('#pause', (b) => b.getAttribute('aria-label')), 'label becomes Play').toBe('Play');
    expect(await page.$eval('[data-track]', (t) => t.getAttribute('aria-live')), 'announces slides while paused').toBe('polite');
    const current = await page.$eval('.slideshow__dot[aria-current]', (d) => d.id);
    await page.mouse.move(1000, 700);
    await page.waitForTimeout(3500);
    expect(await page.$eval('.slideshow__dot[aria-current]', (d) => d.id), 'stays put while paused').toBe(current);
  },

  async 'autoplay stays off for reduced motion'({ page, base, expect }) {
    await open(page, base, slideshow({ autoplay: true }), ['carousel.js'], { reducedMotion: true });
    await page.waitForFunction(() => document.querySelector('slide-show').classList.contains('is-ready'));
    expect(await page.$eval('#pause', (b) => b.hidden), 'pause button hidden').toBe(true);
    await page.waitForTimeout(3500);
    expect(await page.$eval('#dot0', (d) => d.hasAttribute('aria-current')), 'no automatic change').toBe(true);
  },

  async 'scroll row buttons scroll and disable at the ends'({ page, base, expect, eventually }) {
    await open(page, base, row, ['carousel.js']);
    await page.waitForFunction(() => customElements.get('scroll-row'));
    await eventually(() => document.querySelector('scroll-row').hasAttribute('data-scrollable'), 'marked scrollable');
    expect(await page.$eval('#rprev', (b) => b.disabled), 'previous disabled at the start').toBe(true);
    await page.click('#rnext');
    await eventually(() => document.querySelector('[data-scroll-list]').scrollLeft > 100, 'scrolled');
    expect(await page.$eval('#rprev', (b) => b.disabled), 'previous enabled').toBe(false);
    // Quick repeated clicks still add up to the end of the row.
    await page.$eval('#rnext', (b) => { b.click(); b.click(); b.click(); });
    await eventually(() => document.getElementById('rnext').disabled, 'next disabled at the end');
  },

  async 'marquee repeats items for a seamless loop and hides the copies'({ page, base, expect }) {
    await open(page, base, marquee, ['carousel.js']);
    await page.waitForFunction(() => document.querySelector('marquee-row').classList.contains('is-animated'));
    const info = await page.$eval('[data-marquee-track]', (t) => ({
      total: t.children.length,
      hidden: [...t.children].filter((c) => c.getAttribute('aria-hidden') === 'true').length,
      editor: t.querySelectorAll('[data-shopify-editor-block]').length,
      wide: t.scrollWidth >= t.parentElement.clientWidth * 2
    }));
    expect(info.hidden, 'only the originals are announced').toBe(info.total - 2);
    expect(info.editor, 'copies drop editor attributes').toBe(1);
    expect(info.wide, 'long enough to loop').toBe(true);
  },

  async 'marquee stays still for reduced motion'({ page, base, expect }) {
    await open(page, base, marquee, ['carousel.js'], { reducedMotion: true });
    await page.waitForFunction(() => customElements.get('marquee-row'));
    expect(await page.$eval('marquee-row', (m) => m.classList.contains('is-animated')), 'not animated').toBe(false);
    expect(await page.$$eval('[data-marquee-track] > li', (l) => l.length), 'no copies').toBe(2);
  },

  async 'videos load only when played or scrolled into view; background video can pause'({ page, base, expect, eventually }) {
    await open(page, base, video, ['video.js']);
    await page.waitForFunction(() => customElements.get('deferred-video'));
    expect(await page.$$eval('video', (v) => v.length), 'no players before interaction').toBe(0);
    await page.click('#play');
    expect(await page.$$eval('#inline-player', (v) => v.length), 'inline player inserted').toBe(1);
    expect(await page.$$eval('#play', (b) => b.length), 'poster removed').toBe(0);
    expect(await page.$$eval('#bg-player', (v) => v.length), 'background video still waiting').toBe(0);
    await page.$eval('#bg', (el) => el.scrollIntoView());
    await eventually(() => !!document.getElementById('bg-player'), 'background video loads in view');
    expect(await page.$eval('#toggle', (b) => b.hidden), 'pause button shown').toBe(false);
    await page.click('#toggle');
    expect(await page.$eval('#toggle', (b) => b.getAttribute('aria-pressed')), 'paused').toBe('true');
  }
};
