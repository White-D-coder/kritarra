import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const baseUrl = process.env.KRITARRA_TEST_URL || 'http://127.0.0.1:3000';
const output = '/tmp/kritarra-craft-journey';
const expectedTitles = ['Design', 'Materials', 'Sketch', 'Mould', 'Cast', 'Weld', 'Set', 'Polish'];
const count = expectedTitles.length;
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.KRITARRA_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  await page.addInitScript(() => sessionStorage.setItem('kritarra-intro-seen', 'true'));
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const section = page.locator('#making-of-a-jewel');

  async function visit() {
    assert.equal((await page.goto(baseUrl, { waitUntil: 'networkidle' })).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await section.locator('[data-chapter]').first().waitFor();
    assert.deepEqual(await section.locator('.journey-copy h3').allTextContents(), expectedTitles);
    assert.equal(await section.locator('.journey-progress li').count(), count);
    assert.equal(await section.evaluate(el => el.previousElementSibling?.id), 'remembered');
    await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('#making-of-a-jewel img')].every(img => img.complete && img.naturalWidth > 0));
  }

  async function seek(progress) {
    await section.evaluate((el, value) => {
      const start = el.getBoundingClientRect().top + scrollY - 60;
      const distance = el.offsetHeight - innerHeight + 60;
      scrollTo({ top: start + value * distance, behavior: 'instant' });
    }, progress);
    // Wait for the shared scrub to settle rather than assuming an instant jump.
    await page.waitForFunction(value => {
      const nodes = [...document.querySelectorAll('#making-of-a-jewel .journey-chapter')];
      const step = value * (nodes.length - 1);
      const nearest = Math.round(step);
      if (Math.abs(step - nearest) < .001) {
        const image = nodes[nearest].querySelector('.journey-image');
        return Number(getComputedStyle(image).opacity) > .999 && Math.abs(new DOMMatrixReadOnly(getComputedStyle(image).transform).m42) < .05;
      }
      const lower = Math.floor(step);
      const opacity = index => Number(getComputedStyle(nodes[index].querySelector('.journey-image')).opacity);
      return Math.abs(opacity(lower) - .5) < .008 && Math.abs(opacity(lower + 1) - .5) < .008;
    }, progress);
    return section.evaluate(el => {
      const box = node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
      return {
        stage: box(el.querySelector('.journey-stage')),
        background: el.querySelector('.journey-backdrop img').currentSrc,
        overflow: document.documentElement.scrollWidth > innerWidth,
        active: [...el.querySelectorAll('.journey-progress li')].findIndex(node => node.getAttribute('aria-current') === 'step'),
        chapters: [...el.querySelectorAll('.journey-chapter')].map(node => ({
          hidden: node.getAttribute('aria-hidden'),
          image: box(node.querySelector('.journey-image-frame')),
          text: box(node.querySelector('.journey-copy')),
          imageOpacity: Number(getComputedStyle(node.querySelector('.journey-image')).opacity),
          textOpacity: Number(getComputedStyle(node.querySelector('.journey-copy')).opacity),
          imageY: new DOMMatrixReadOnly(getComputedStyle(node.querySelector('.journey-image')).transform).m42,
          textY: new DOMMatrixReadOnly(getComputedStyle(node.querySelector('.journey-copy')).transform).m42,
        })),
      };
    });
  }

  async function recordScrub(from, to) {
    await seek(from / (count - 1));
    return section.evaluate(async (el, target) => {
      const incoming = el.querySelectorAll('.journey-copy')[1];
      const read = () => ({
        y: new DOMMatrixReadOnly(getComputedStyle(incoming).transform).m42,
        opacity: Number(getComputedStyle(incoming).opacity),
      });
      const frames = [read()];
      const start = el.getBoundingClientRect().top + scrollY - 60;
      const distance = el.offsetHeight - innerHeight + 60;
      scrollTo({ top: start + target / (el.querySelectorAll('.journey-chapter').length - 1) * distance, behavior: 'instant' });
      await new Promise(resolve => {
        const started = performance.now();
        const sample = () => {
          frames.push(read());
          if (performance.now() - started < 650) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });
      return frames;
    }, to);
  }

  await visit();
  const smoothness = [];
  for (const [from, to] of [[0, 1], [1, 0]]) {
    const samples = await recordScrub(from, to);
    const intermediate = new Set(samples.filter(frame => frame.opacity > .02 && frame.opacity < .98).map(frame => frame.opacity.toFixed(3)));
    const maxFrameMovement = Math.max(...samples.slice(1).map((frame, index) => Math.abs(frame.y - samples[index].y)));
    assert.ok(intermediate.size >= 8, 'a stepped scroll input produces many intermediate frames');
    assert.ok(maxFrameMovement < 18, 'text eases between frames instead of jumping the full transition');
    samples.slice(1).forEach((frame, index) => assert.ok(to > from ? frame.y <= samples[index].y + .2 : frame.y >= samples[index].y - .2, 'scrub has no bounce or direction reversal'));
    smoothness.push({ direction: to > from ? 'forward' : 'reverse', intermediateFrames: intermediate.size, maxFrameMovement: Math.round(maxFrameMovement * 100) / 100 });
  }

  const reports = [];
  for (const [width, height] of [[1440, 1000], [1024, 900], [768, 900], [390, 844], [360, 667], [320, 568]]) {
    await page.setViewportSize({ width, height });
    await visit();
    const frames = [];
    const steps = [...Array.from({ length: count * 2 - 1 }, (_, index) => index / 2), 0, count - 1, (count - 1) / 2, 0];
    for (const step of steps) {
      const progress = step / (count - 1);
      const frame = await seek(progress);
      assert.equal(frame.overflow, false, `${width}: no horizontal overflow`);
      assert.ok(Math.abs(frame.stage.y - 60) < 2, `${width}: viewport stays sticky`);
      const totalOpacity = frame.chapters.reduce((sum, chapter) => sum + chapter.imageOpacity, 0);
      assert.ok(Math.abs(totalOpacity - 1) < .03, `${width}: no blank or flashing transition`);
      for (const chapter of frame.chapters) {
        assert.ok(Math.abs(chapter.imageOpacity - chapter.textOpacity) < .01, 'image and text remain synchronized');
        assert.ok(Math.abs(chapter.imageY) <= 14.1 && Math.abs(chapter.textY) <= 52.1, 'restrained vertical movement');
      }
      if (Number.isInteger(step)) {
        const expected = step;
        assert.equal(frame.active, expected, 'indicator follows scroll in either direction');
        assert.ok(frame.chapters[expected].imageOpacity > .99);
        const { image, text } = frame.chapters[expected];
        for (const box of [image, text]) {
          assert.ok(box.x >= 0 && box.right <= width + 1, `${width}: content fits horizontally`);
          assert.ok(box.y >= 60 && box.bottom <= height + 1, `${width}x${height}: content fits vertically`);
        }
        if (width === 1440 || width === 390) await page.locator('.journey-stage').screenshot({ path: `${output}/${width}-chapter-${expected + 1}.png` });
      }
      frames.push(frame);
    }
    assert.equal(new Set(frames.map(frame => frame.background)).size, 1, 'background stays unchanged');
    assert.ok(frames[1].chapters[0].textY < 0 && frames[1].chapters[1].textY > 0, 'outgoing text exits above while new text enters below');
    reports.push({ width, height, forwardReverseAndFastScroll: 'passed' });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('#making-of-a-jewel').dataset.journeyMotion === 'static');
  assert.equal(await section.locator('.journey-chapter[aria-hidden="true"]').count(), 0);
  assert.equal(await section.locator('.journey-progress').count(), 0);
  const staticChapters = await section.locator('.journey-chapter').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
  assert.equal(staticChapters.length, count);
  staticChapters.slice(1).forEach((top, index) => assert.ok(top > staticChapters[index]));
  await section.getByRole('link', { name: 'Begin your story' }).click();
  await page.waitForURL('**/contact/');
  await page.goBack({ waitUntil: 'networkidle' });
  assert.equal(await section.count(), 1);

  const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noJs.goto(baseUrl, { waitUntil: 'load' });
  assert.equal(await noJs.locator('.journey-chapter').count(), count);
  assert.equal(await noJs.locator('#making-of-a-jewel').getAttribute('data-journey-motion'), 'static');
  assert.equal(await noJs.locator('.journey-stage').evaluate(el => getComputedStyle(el).position), 'relative');

  const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  await touch.addInitScript(() => sessionStorage.setItem('kritarra-intro-seen', 'true'));
  await touch.goto(baseUrl, { waitUntil: 'networkidle' });
  await touch.locator('#making-of-a-jewel[data-journey-motion="scroll"]').waitFor();
  await touch.locator('#making-of-a-jewel').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY + 250, behavior: 'instant' }));
  await touch.waitForTimeout(200);
  const beforeTouch = await touch.evaluate(() => scrollY);
  const cdp = await touch.context().newCDPSession(touch);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 650 }] });
  for (const y of [600, 550, 500, 450, 400]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] });
    await touch.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await touch.waitForTimeout(250);
  assert.ok(await touch.evaluate(() => scrollY) > beforeTouch + 100, 'native touch swipe scrolls freely');
  await cdp.detach();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ smoothness, reports, reducedMotion: 'readable vertical chapters', noJavaScript: 'all eight chapters visible', touchSwipe: 'native scrolling passed', navigation: 'passed', browserErrors: errors, screenshots: output }, null, 2));
} finally {
  await browser.close();
}
