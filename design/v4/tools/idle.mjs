// Lists scene animations that, right after launch, are still waiting on a positive delay or sit at their 0% keyframe.
import { chromium, webkit } from 'playwright';
const ENGINE = process.argv.includes('--webkit') ? webkit : chromium;
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = pathToFileURL(path.resolve(__dirname, '..', '..', '..', 'index.html')).href;
const b = await ENGINE.launch();
for (const place of ['dock', 'campo', 'keywest', 'hawaii', 'tokyo']) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await p.goto(`${INDEX}?place=${place}&sky=day`, { waitUntil: 'load' });
  const r = await p.evaluate(() => document.getAnimations().filter((a) => a.effect?.target?.closest?.('.waves, .clouds, .sky, .nightsky, .wind')).map((a) => {
    const t = a.effect.getTiming(), el = a.effect.target, box = el.getBoundingClientRect();
    return { name: a.animationName, cls: (el.getAttribute('class') || el.tagName).slice(0, 24), delay: t.delay, dur: t.duration, visible: box.width > 0, x: Math.round(box.left) };
  }));
  const waiting = r.filter((a) => a.visible && a.delay > 0);
  const byName = {}; waiting.forEach((a) => { byName[a.name] = byName[a.name] || { cls: a.cls, n: 0, delays: [] }; byName[a.name].n++; byName[a.name].delays.push(a.delay / 1000); });
  console.log(`\n${place}: ${r.filter((a) => a.visible).length} visible anims, ${waiting.length} waiting on a positive delay`);
  for (const [k, v] of Object.entries(byName)) console.log(`  ${k} (${v.cls}) x${v.n} delays ${[...new Set(v.delays)].slice(0, 6).join(',')}s`);
  await p.close();
}
await b.close();
