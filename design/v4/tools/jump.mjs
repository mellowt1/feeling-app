// Measures how far scene pieces jump (px, vertical and horizontal) across the launch restart at 400 ms.
import { webkit } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = pathToFileURL(path.resolve(__dirname, '..', '..', '..', 'index.html')).href;
const b = await webkit.launch();
for (const place of ['dock', 'campo', 'keywest', 'hawaii', 'tokyo']) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(`${INDEX}?place=${place}&sky=day`, { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const els = document.getAnimations().map((a) => a.effect.target).filter((e) => e.closest('#tab-today') && e.getBoundingClientRect().width);
    const pos = () => els.map((e) => { const q = e.getBoundingClientRect(); return [q.top, q.left]; });
    const a = pos(); const root = document.documentElement; root.classList.add('rescene'); void root.offsetWidth; root.classList.remove('rescene'); const c = pos();
    return els.map((e, i) => ({ cls: (e.getAttribute('class') || e.tagName).slice(0, 30), dy: Math.round(c[i][0] - a[i][0]), dx: Math.round(c[i][1] - a[i][1]), h: Math.round(e.getBoundingClientRect().height) })).filter((o) => Math.abs(o.dy) >= 3 || Math.abs(o.dx) >= 3).sort((x, y) => Math.abs(y.dy) - Math.abs(x.dy)).slice(0, 8);
  });
  console.log(place, JSON.stringify(r));
  await p.close();
}
await b.close();
