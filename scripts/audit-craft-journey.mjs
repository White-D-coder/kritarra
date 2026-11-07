import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const baseUrl = process.env.KRITARRA_TEST_URL || 'http://127.0.0.1:3000';
const output = '/tmp/kritarra-craft-journey';
const titles = ['Design', 'Materials', 'Sketch', 'Mould', 'Cast', 'Weld', 'Set', 'Polish'];
const count = titles.length;
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.KRITARRA_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  await page.addInitScript(() => sessionStorage.setItem('kritarra-intro-seen', 'true'));
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const section = page.locator('#making-of-a-jewel');

  async function settled(index) {
    await page.waitForFunction(({ index, title }) => {
      const section = document.querySelector('#making-of-a-jewel');
      const nodes = section.querySelectorAll('.journey-chapter');
      if (nodes.length !== 1 || nodes[0].querySelector('h3').textContent !== title) return false;
      const node = nodes[0];
      const copy = node.querySelector('.journey-copy');
      const titleElement = node.querySelector('.journey-title-mask > span');
      const image = node.querySelector('img');
      const active = [...section.querySelectorAll('.journey-progress li')].findIndex(marker => marker.getAttribute('aria-current') === 'step');
      return active === index && Number(getComputedStyle(node).opacity) > .999 && Math.abs(new DOMMatrixReadOnly(getComputedStyle(copy).transform).m42) < .1 && Math.abs(new DOMMatrixReadOnly(getComputedStyle(titleElement).transform).m42) < .1 && image.complete && image.naturalWidth > 0 && !node.hasAttribute('inert');
    }, { index, title: titles[index] });
  }

  async function seek(step, expected = Math.round(step)) {
    await section.evaluate((el, value) => {
      const start = el.getBoundingClientRect().top + scrollY - 60;
      const distance = el.offsetHeight - innerHeight + 60;
      scrollTo({ top: start + value / 7 * distance, behavior: 'instant' });
    }, step);
    await settled(expected);
  }

  async function visit() {
    assert.equal((await page.goto(baseUrl, { waitUntil: 'networkidle' })).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#making-of-a-jewel[data-journey-motion="scroll"]').waitFor();
    assert.equal(await section.evaluate(el => el.previousElementSibling?.id), 'remembered');
    assert.equal(await section.locator('.journey-progress li').count(), count);
    await seek(0);
  }

  async function captureTransition(from, to) {
    await seek(from);
    const frames = await section.evaluate(async (el, target) => {
      const frames = [];
      const start = el.getBoundingClientRect().top + scrollY - 60;
      const distance = el.offsetHeight - innerHeight + 60;
      scrollTo({ top: start + target / 7 * distance, behavior: 'instant' });
      await new Promise(resolve => {
        const started = performance.now();
        const sample = () => {
          const nodes = [...el.querySelectorAll('.journey-chapter')];
          frames.push(nodes.map(node => ({ title: node.querySelector('h3').textContent, opacity: Number(getComputedStyle(node).opacity) })));
          if (performance.now() - started < 800) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });
      return frames;
    }, to);
    frames.forEach(frame => assert.ok(frame.length <= 1, 'outgoing and incoming chapters must never overlap, even on intermediate frames'));
    assert.ok(frames.some(frame => frame.some(node => node.opacity > .05 && node.opacity < .95)), 'handoff is animated');
    await settled(to);
    return { from: titles[from], to: titles[to], sampledFrames: frames.length, maximumMountedChapters: Math.max(...frames.map(frame => frame.length)) };
  }

  await visit();
  const handoffs = [];
  for (const pair of [[0, 1], [1, 0], [0, 7], [7, 0]]) handoffs.push(await captureTransition(...pair));

  // Reproduce the screenshot: stop on small movements around the first boundary.
  for (const [step, expected] of [[.2, 0], [.45, 0], [.54, 0], [.64, 1], [.5, 1], [.46, 1], [.34, 0]]) {
    await seek(step, expected);
    await page.waitForTimeout(150);
    assert.equal(await section.locator('.journey-chapter').count(), 1);
    assert.equal(await section.locator('.journey-copy h3').textContent(), titles[expected]);
  }
  await seek(.5, 0);
  await page.locator('.journey-stage').screenshot({ path: `${output}/paused-small-scroll.png` });

  const reports = [];
  for (const [width, height] of [[1440, 1000], [1024, 900], [768, 900], [390, 844], [360, 667], [320, 568]]) {
    await page.setViewportSize({ width, height });
    await visit();
    const backgrounds = new Set();
    for (let index = 0; index < count; index++) {
      await seek(index);
      const layout = await section.evaluate(el => {
        const box = node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom }; };
        return { overflow: document.documentElement.scrollWidth > innerWidth, stage: box(el.querySelector('.journey-stage')), image: box(el.querySelector('.journey-image-frame')), copy: box(el.querySelector('.journey-copy')), background: el.querySelector('.journey-backdrop img').currentSrc };
      });
      assert.equal(layout.overflow, false, `${width}: no horizontal overflow`);
      assert.ok(Math.abs(layout.stage.y - 60) < 2, 'stage remains sticky');
      for (const box of [layout.image, layout.copy]) {
        assert.ok(box.x >= 0 && box.right <= width + 1, `${width}: content fits horizontally`);
        assert.ok(box.y >= 60 && box.bottom <= height + 1, `${width}x${height}: content fits vertically`);
      }
      backgrounds.add(layout.background);
      if ([1440, 390].includes(width) && [0, 7].includes(index)) await page.locator('.journey-stage').screenshot({ path: `${output}/${width}-chapter-${index + 1}.png` });
    }
    assert.equal(backgrounds.size, 1, 'background remains unchanged');
    for (const index of [3, 0, 7, 0]) await seek(index);
    reports.push({ width, height, allEightChaptersAndReverseScroll: 'passed' });
  }

  // Rapid direction changes while an exit is still running must settle on the latest chapter.
  await section.evaluate(async el => {
    const start = el.getBoundingClientRect().top + scrollY - 60;
    const distance = el.offsetHeight - innerHeight + 60;
    for (const step of [7, 2, 6]) {
      scrollTo({ top: start + step / 7 * distance, behavior: 'instant' });
      await new Promise(resolve => setTimeout(resolve, 35));
    }
  });
  await settled(6);
  assert.equal(await section.locator('.journey-chapter').count(), 1);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('#making-of-a-jewel').dataset.journeyMotion === 'static');
  assert.deepEqual(await section.locator('h3').allTextContents(), titles);
  assert.equal(await section.locator('.journey-chapter[inert]').count(), 0);
  assert.equal(await section.locator('.journey-progress').count(), 0);
  await section.getByRole('link', { name: 'Begin your story' }).click();
  await page.waitForURL('**/contact/');

  const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noJs.goto(baseUrl, { waitUntil: 'load' });
  assert.deepEqual(await noJs.locator('.journey-copy h3').allTextContents(), titles);
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
  await touch.waitForTimeout(650);
  assert.ok(await touch.evaluate(() => scrollY) > beforeTouch + 100, 'native touch swipe scrolls freely');
  assert.equal(await touch.locator('.journey-chapter').count(), 1);
  await cdp.detach();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ handoffs, smallScrollPauses: 'one fully readable chapter', rapidReversals: 'latest chapter shown', reports, reducedMotion: 'all eight chapters readable', noJavaScript: 'all eight chapters visible', touchSwipe: 'passed', navigation: 'passed', browserErrors: errors, screenshots: output }, null, 2));
} finally {
  await browser.close();
}
