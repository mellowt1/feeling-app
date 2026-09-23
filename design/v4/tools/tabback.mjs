// Today -> Export -> Today: frame times after coming back (CPU slowed 4x). Usage: node tabback.mjs [place]
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = pathToFileURL(path.resolve(__dirname, '..', '..', '..', 'index.html')).href;
const b = await chromium.launch();
for (const place of process.argv[2] ? [process.argv[2]] : ['dock', 'campo', 'keywest', 'hawaii', 'tokyo']) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.goto(`${INDEX}?place=${place}&sky=day`, { waitUntil: 'load' }); await p.waitForTimeout(2000);
  await p.click('nav button[data-tab="export"]'); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => new Promise((res) => {
    const s = performance.now(); document.querySelector('nav button[data-tab="today"]').click();
    const f = []; let last = s;
    const tick = (t) => { f.push(Math.round(t - last)); last = t; t - s < 1200 ? requestAnimationFrame(tick) : res({ frames: f.length, worst: Math.max(...f), over34: f.filter((d) => d > 34).length, first10: f.slice(0, 12).join(' ') }); };
    requestAnimationFrame(tick);
  }));
  console.log(place.padEnd(8), JSON.stringify(r));
  await p.close();
}
await b.close();
