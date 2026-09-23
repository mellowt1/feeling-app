// Film strip: screenshots at fixed times after load (and after a place switch), for spotting pieces that pop in.
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path'; import fs from 'node:fs';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = pathToFileURL(path.resolve(__dirname, '..', '..', '..', 'index.html')).href;
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const TIMES = [60, 150, 400, 800, 1500, 3000];
const b = await chromium.launch();
for (const place of ['dock', 'campo', 'keywest', 'hawaii', 'tokyo']) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  await p.goto(`${INDEX}?place=${place}&sky=day`, { waitUntil: 'domcontentloaded' });
  let t = 0;
  for (const at of TIMES) { await p.waitForTimeout(at - t); t = at; await p.screenshot({ path: `${OUT}/${place}-load-${at}.png` }); }
  await ctx.close();
}
await b.close();
