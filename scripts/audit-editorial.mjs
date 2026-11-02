import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const baseUrl = process.env.KRITARRA_TEST_URL || 'http://127.0.0.1:3000';
const output = '/tmp/kritarra-editorial-audit';
fs.mkdirSync(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.KRITARRA_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});

const errors = [];
const reports = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => sessionStorage.setItem('kritarra-intro-seen', 'true'));

  const readComposition = () => page.locator('#signature').evaluate(section => {
    const track = section.querySelector('.kritarra-editorial-track');
    const rect = track.getBoundingClientRect();
    const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    return {
      x: matrix.m41, y: matrix.m42,
      offsets: [...section.querySelectorAll('.kritarra-editorial-panel')].map(panel => panel.getBoundingClientRect().top - rect.top),
      depths: [...section.querySelectorAll('.kritarra-editorial-panel')].map(panel => Number(getComputedStyle(panel).zIndex)),
    };
  });

  for (const width of [1440, 1280, 1024, 768]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.locator('#signature[data-editorial-motion="diagonal"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const viewportTop = await page.locator('.kritarra-editorial-window').evaluate(el => el.getBoundingClientRect().top + scrollY);
    const frames = [];
    const positions = [viewportTop - 440, viewportTop - 180, viewportTop + (width >= 1100 ? 100 : 0)];
    for (let index = 0; index < positions.length; index++) {
      await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), positions[index]);
      await page.waitForTimeout(1000);
      const composition = await readComposition();
      composition.offsets.forEach((value, i) => assert.ok(Math.abs(value - i * 50) < 1, `${width}px: offset ${i} remains fixed`));
      assert.deepEqual(composition.depths, [4, 3, 2, 1]);
      frames.push(composition);
      if (width === 1440) await page.screenshot({ path: `${output}/desktop-${['start', 'middle', 'finish'][index]}.png` });
    }
    assert.ok(frames[0].x > frames[1].x && frames[1].x > frames[2].x, `${width}px: horizontal motion follows scrolling`);
    assert.ok(frames[0].y > frames[1].y && frames[1].y > frames[2].y, `${width}px: vertical motion follows scrolling`);
    const finalCopy = await page.locator('.kritarra-editorial-copy').last().boundingBox();
    assert.ok(finalCopy.x >= 0 && finalCopy.x + finalCopy.width <= width + 1, `${width}px: final text is fully inside the viewport`);
    assert.ok(finalCopy.y >= 60 && finalCopy.y + finalCopy.height <= 1000, `${width}px: final text remains readable`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await page.locator('.pin-spacer').count(), 0);
    reports.push({ width, frames });
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => {
    const section = document.querySelector('#signature');
    const track = section.querySelector('.kritarra-editorial-track');
    return !section.hasAttribute('data-editorial-motion') && getComputedStyle(track).transform === 'none';
  });
  await page.waitForTimeout(250);
  assert.equal(await page.locator('.kritarra-editorial-track').evaluate(el => getComputedStyle(el).transform), 'none');
  await page.locator('#signature').screenshot({ path: `${output}/reduced-motion.png` });

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [390, 360]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#signature').getAttribute('data-editorial-motion'), null);
    assert.equal(await page.locator('.kritarra-editorial-track').evaluate(el => getComputedStyle(el).transform), 'none');
    const panels = await page.locator('.kritarra-editorial-panel').evaluateAll(nodes => nodes.map(node => {
      const rect = node.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, bottom: rect.bottom };
    }));
    panels.forEach((panel, i) => {
      assert.ok(panel.x >= 0 && panel.x + panel.width <= width);
      if (i) assert.ok(panel.y > panels[i - 1].bottom, 'Mobile panels alternate vertically without overlap');
    });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (width === 390) await page.locator('#signature').screenshot({ path: `${output}/mobile.png` });
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('#signature[data-editorial-motion="diagonal"]').waitFor();
  await page.locator('#signature .text-link').click();
  await page.waitForURL('**/collections/');
  assert.equal(await page.locator('#signature').count(), 0);
  await page.locator('header .wordmark').click();
  await page.waitForURL(`${baseUrl}/`);
  await page.locator('#signature[data-editorial-motion="diagonal"]').waitFor();
  assert.equal(await page.locator('.kritarra-editorial-panel').count(), 4);

  const staticPage = await browser.newPage({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
  await staticPage.goto(`${baseUrl}/`, { waitUntil: 'load' });
  assert.equal(await staticPage.locator('.kritarra-editorial-panel').count(), 4);
  assert.ok((await staticPage.locator('#signature').textContent()).includes('Some creations are not simply worn.'));
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ reports, mobile: 'vertical at 390px and 360px', reducedMotion: 'static', cleanup: 'resize and client navigation passed', noJavaScript: 'readable', browserErrors: errors }, null, 2));
} finally {
  await browser.close();
}
