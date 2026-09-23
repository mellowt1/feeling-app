#!/usr/bin/env node
// Scene cost probe: per place, with the CPU slowed 4x (phone-ish), measures
// first paint, running animations, frame rate over 4 s and the frame cost of
// switching into the place. Usage: node perf.mjs [--sky day] [--cpu 4]
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = pathToFileURL(path.resolve(__dirname, '..', '..', '..', 'index.html')).href;
const PLACES = ['dock', 'campo', 'keywest', 'hawaii', 'tokyo'];
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SKY = arg('--sky', 'day'), CPU = +arg('--cpu', 4);

const browser = await chromium.launch();
const rows = [];
for (const place of PLACES) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  const t0 = Date.now();
  await page.goto(`${INDEX}?place=${place}&sky=${SKY}`, { waitUntil: 'load' });
  const loadMs = Date.now() - t0;
  const paint = await page.evaluate(() => Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0));
  await page.waitForTimeout(1500);
  const steady = await page.evaluate(() => new Promise((res) => {
    const anims = document.getAnimations().filter((a) => a.playState === 'running').length;
    const f = []; let last = performance.now(); const end = last + 4000;
    const tick = (t) => { f.push(t - last); last = t; t < end ? requestAnimationFrame(tick) : res({ anims, fps: Math.round(f.length / 4), worst: Math.round(Math.max(...f)), janky: f.filter((d) => d > 34).length }); };
    requestAnimationFrame(tick);
  }));
  // Switch cost: go to dock, then flip data-place to this place and time the next frames.
  const sw = place === 'dock' ? null : await page.evaluate((p) => new Promise((res) => {
    document.documentElement.setAttribute('data-place', 'dock');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const s = performance.now();
      document.documentElement.setAttribute('data-place', p);
      const f = []; let last = s;
      const tick = (t) => { f.push(t - last); last = t; f.length < 30 ? requestAnimationFrame(tick) : res({ first: Math.round(f[0]), worst: Math.round(Math.max(...f)) }); };
      requestAnimationFrame(tick);
    }));
  }), place);
  rows.push({ place, loadMs, fcp: paint, ...steady, switchFirstFrame: sw?.first ?? '-', switchWorst: sw?.worst ?? '-' });
  await ctx.close();
}
await browser.close();
console.log(`sky=${SKY} cpu=${CPU}x`);
console.table(rows);
