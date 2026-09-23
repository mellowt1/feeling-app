// Checks the Feeling 62 scene restart: animations restart (new start time), stay scattered, keep moving, no errors.
import { webkit, chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = pathToFileURL(path.resolve(__dirname, '..', '..', '..', 'index.html')).href;
const MOVERS = /swim|cloudDrift|boatCross|bottleDrift|rheaWalk|pelican|crab|gullSlide|shadowDrift|windRun/;
for (const [name, eng] of [['webkit', webkit], ['chromium', chromium]]) {
  const b = await eng.launch();
  for (const place of ['dock', 'campo', 'keywest', 'hawaii', 'tokyo']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`${INDEX}?place=${place}&sky=day`, { waitUntil: 'load' });
    const snap = () => p.evaluate((src) => { const re = new RegExp(src); return document.getAnimations().filter((a) => re.test(a.animationName)).map((a) => { const r = a.effect.target.getBoundingClientRect(); return { x: Math.round(r.left), w: r.width, st: a.startTime }; }).filter((o) => o.w); }, MOVERS.source);
    const before = await p.evaluate(() => document.getAnimations().length);
    await p.waitForTimeout(1800); // both launch restarts have run
    const a = await snap(); await p.waitForTimeout(3000); const c = await snap();
    const after = await p.evaluate(() => document.getAnimations().length);
    const xs = a.map((o) => o.x), moving = a.filter((o, i) => c[i] && Math.abs(c[i].x - o.x) > 0).length;
    console.log(name, place.padEnd(8), 'anims', before, '->', after, '| movers', a.length, 'moving', moving, '| x spread', Math.min(...xs), '..', Math.max(...xs), errs.length ? 'ERR ' + errs[0] : '');
    await p.close();
  }
  await b.close();
}
