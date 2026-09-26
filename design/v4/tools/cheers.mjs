// Feeling 66 check: tap a friend chip, pick a word, the Worker gets it; a cheer sent to you rides in a bottle.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.resolve(here, '../../../index.html')).href;
const out = process.argv[2] || here;
const today = new Date(Date.now() - 4 * 3600e3).toISOString().slice(0, 10);
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
const cheersPosted = [];
await page.route('https://feeling-circle.paul-o-a04.workers.dev/**', async (r) => {
  const u = r.request().url(), body = JSON.parse(r.request().postData() || '{}');
  if (u.includes('/api/cheer/')) { cheersPosted.push(body); return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); }
  const members = [{ id: 'o1', name: 'Olivia', place: 'dock', days: { [today]: 4 } }, { id: body.id, name: body.name, days: {} }];
  await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, members, cheers: [{ from: 'o1', name: 'Olivia', word: 'Proud of you', day: today }] }) });
});
await page.addInitScript(() => { if (!localStorage.getItem('feeling.v1')) localStorage.setItem('feeling.v1', JSON.stringify({ entries: [], sessions: [], lastExport: 0, draft: null, circles: [{ name: 'Paul', code: 'hearthxx', id: 'p1', members: [], seen: 0 }], checkins: { on: false } })); });
await page.goto(url); await page.waitForTimeout(2500);
console.log('bottles:', await page.$$eval('#bottles .bubble', (l) => l.map((x) => x.textContent)));
await page.click('#strip button.chip:not(.ask)'); await page.waitForTimeout(400);
await page.screenshot({ path: path.join(out, 'cheer-pop.png'), clip: { x: 0, y: 0, width: 390, height: 420 } });
await page.click('#cheer-pop button:nth-of-type(3)'); await page.waitForTimeout(500);
console.log('posted:', cheersPosted, '| toast:', await page.$eval('#toast', (e) => e.textContent), '| chip:', await page.$eval('#strip button.chip:not(.ask)', (e) => e.textContent));
await page.click('#strip button.chip:not(.ask)'); await page.waitForTimeout(300);
console.log('marked on reopen:', await page.$eval('#cheer-pop button.on', (e) => e.textContent));
await page.mouse.click(200, 700); await page.waitForTimeout(300);
console.log('closed:', !(await page.$eval('#cheer-pop', (e) => e.classList.contains('in'))));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
