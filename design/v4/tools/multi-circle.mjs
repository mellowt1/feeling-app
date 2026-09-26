// Feeling 66 check: an old single-circle db migrates to db.circles, a second circle joins,
// Today's strip and History list both circles, the sheet shows one list per circle.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.resolve(here, '../../../index.html')).href;
const out = process.argv[2] || here;
const today = new Date(Date.now() - 4 * 3600e3).toISOString().slice(0, 10);
const worker = {
  stillwater: [{ id: 'n1', name: 'Nick', place: 'hawaii', days: { [today]: 5 }, updated: '2' }, { id: 'e1', name: 'Elias', place: 'campo', days: { [today]: 4 }, status: 'mate on the porch', statusDay: today, updated: '1' }],
  hearth: [{ id: 'o1', name: 'Olivia', place: 'dock', days: { [today]: 6 }, status: 'tea and rain', statusDay: today, updated: '3' }],
};
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.route('https://feeling-circle.paul-o-a04.workers.dev/**', async (r) => {
  const code = r.request().url().split('/').pop(), me = JSON.parse(r.request().postData() || '{}');
  const members = [...(worker[code] || []), { id: me.id, name: me.name, days: me.days || {} }];
  await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true, members }) });
});
await page.addInitScript(() => { if (!localStorage.getItem('feeling.v1')) localStorage.setItem('feeling.v1', JSON.stringify({ entries: [], sessions: [], lastExport: 0, draft: null, circle: { name: 'Paul', code: 'stillwater', id: 'p1', members: [], seen: 0, checkins: { on: false } } })); });
await page.goto(url); await page.waitForTimeout(1500);
const db1 = await page.evaluate(() => JSON.parse(localStorage.getItem('feeling.v1')));
console.log('migrated:', 'circle' in db1 ? 'NO' : 'yes', db1.circles.map((c) => c.code), db1.checkins);
await page.click('nav [data-tab="export"]'); await page.waitForTimeout(500);
await page.click('#circle-tile'); await page.waitForTimeout(600);
await page.click('#circle-add'); await page.fill('#circle-code', 'hearth'); await page.click('#circle-join-btn'); await page.waitForTimeout(800);
await page.screenshot({ path: path.join(out, 'mc-sheet.png') });
console.log('sheet lists:', await page.$$eval('#circle-lists .list', (l) => l.map((x) => x.innerText.replace(/\n/g, ' | '))));
console.log('name prefilled:', await page.$eval('#circle-name', (e) => e.value));
await page.click('#circle-done'); await page.waitForTimeout(500);
console.log('tile:', await page.$eval('#circle-tile-sub', (e) => e.textContent), '/', await page.$eval('#hero-sub', (e) => e.textContent));
await page.click('nav [data-tab="today"]'); await page.waitForTimeout(800);
console.log('strip:', await page.$eval('#strip', (e) => e.innerText.replace(/\n/g, ' ')), '| bottles:', await page.$$eval('#bottles .bubble', (l) => l.map((x) => x.textContent)));
await page.screenshot({ path: path.join(out, 'mc-today.png') });
await page.click('nav [data-tab="history"]'); await page.waitForTimeout(800);
console.log('history:', await page.$eval('#circle', (e) => e.innerText.replace(/\n/g, ' | ')));
await page.$eval('#circle', (e) => e.scrollIntoView()); await page.screenshot({ path: path.join(out, 'mc-history.png') });
page.once('dialog', (d) => d.accept());
await page.click('nav [data-tab="export"]'); await page.click('#circle-tile'); await page.waitForTimeout(600);
await page.click('#circle-lists .list:nth-child(2) .item.danger'); await page.waitForTimeout(600);
console.log('after leave:', await page.evaluate(() => JSON.parse(localStorage.getItem('feeling.v1')).circles.map((c) => c.code)));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
