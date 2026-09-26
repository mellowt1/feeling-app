#!/usr/bin/env node
// The place chooser must open above the entry field and everything else on Today (Feeling 71).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = 'file:///' + path.resolve(__dirname, '..', '..', '..', 'index.html').replace(/\\/g, '/');
const out = process.argv[2] || path.resolve(__dirname, '..', 'shots', 'place-pill-open.png');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.route(/^https?:/, (r) => r.abort());
await p.goto(INDEX); await p.waitForTimeout(1500);
await p.click('#place-pill button.on');
await p.waitForTimeout(600);
// every row of the open list must be the topmost element where it sits
const hidden = await p.evaluate(() => [...document.querySelectorAll('#place-pill button')].filter((btn) => {
  const r = btn.getBoundingClientRect(), top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return !(top && btn.contains(top));
}).map((btn) => btn.getAttribute('aria-label')));
await p.screenshot({ path: out, clip: { x: 0, y: 0, width: 390, height: 520 } });
console.log(hidden.length ? 'FAIL covered: ' + hidden.join(', ') : 'ok   every place row is on top');
await b.close();
process.exit(hidden.length ? 1 : 0);
