#!/usr/bin/env node
// Feeling 72: Talk points turns the range into bullets on the phone. Seeds four weeks with a session two weeks back,
// opens Export → Talk points, checks the sections and screenshots the sheet. Network is blocked.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = 'file:///' + path.resolve(__dirname, '..', '..', '..', 'index.html').replace(/\\/g, '/');
const OUT = process.argv[2] || path.resolve(__dirname, '..', 'shots');
const pad = (n) => String(n).padStart(2, '0');
const key = (ts) => { const d = new Date(ts - 4 * 3600e3); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const at = (daysAgo, h) => { const d = new Date(); d.setDate(d.getDate() - daysAgo); d.setHours(h, 10, 0, 0); return d.getTime(); };
const lines = [
  // [daysAgo, hour, mood, text]
  [27, 9, 4, 'Nice walk this morning.'], [25, 20, 3, 'Work was fine.'], [23, 21, 4, 'Cooked dinner, felt calm.'], [20, 19, 3, 'Normal day.'], [17, 12, 4, 'Good call with my brother.'],
  [13, 21, 2, 'Could not sleep again, the deadline at work keeps going round in my head.'],
  [12, 22, 6, 'Argument about the move. I said things I did not mean and now I feel awful about it.'],
  [11, 9, 3, 'Tired. Slept badly.'],
  [10, 20, 1, 'Worst evening in weeks. Work email at 21:00 and I just froze. Everything felt pointless.'],
  [6, 21, 2, 'The move again. Too many boxes and no sleep.'],
  [5, 14, 5, 'Long run by the river, first time in ages I felt properly free.'],
  [4, 21, 2, 'Deadline moved forward. Sleep is a mess.'],
  [2, 10, 4, 'Breakfast with friends, laughed a lot.'],
  [1, 20, 3, 'Okay day, a bit flat.'],
];
const seed = {
  entries: lines.map(([d, h, m, t], i) => ({ id: 'e' + i, ts: at(d, h), day: key(at(d, h)), mood: m, text: t })),
  sessions: [key(at(14, 12))], lastExport: Date.now(), draft: null, circles: [], statusTo: [], checkins: { on: false, askedHome: 0 },
};
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await ctx.route(/^https?:/, (r) => r.abort());
const p = await ctx.newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.addInitScript((s) => { localStorage.clear(); localStorage.setItem('feeling.v1', JSON.stringify(s)); }, seed);
await p.goto(INDEX); await p.waitForTimeout(1200);
let fails = 0; const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };
await p.click('nav button[data-tab="export"]'); await p.waitForTimeout(700);
await p.screenshot({ path: path.join(OUT, 'talk-export.png') });
await p.click('#talk-points'); await p.waitForTimeout(900);
const txt = await p.evaluate(() => document.querySelector('.sheet:not(#circle-sheet) .panel').innerText);
console.log('---\n' + txt + '\n---');
for (const s of ['How it went', 'Hardest moments', 'Kept coming up', 'What went well']) check(txt.includes(s), 'section ' + s);
check(/since the session/.test(txt), 'header names the session');
check(/Harder than the/.test(txt), 'compares with the days before');
check(/sleep/.test(txt) && /work/.test(txt), 'themes sleep + work');
await p.screenshot({ path: path.join(OUT, 'talk-sheet.png') });
await p.evaluate(() => { const pn = document.querySelector('.sheet:not(#circle-sheet) .panel'); pn.scrollTop = pn.scrollHeight; }); await p.waitForTimeout(300);
await p.screenshot({ path: path.join(OUT, 'talk-sheet-end.png') });
// everything range + dark sky
await p.click('.sheet:not(#circle-sheet) .done'); await p.waitForTimeout(500);
await p.click('#range-seg button[data-r="all"]'); await p.waitForTimeout(300);
await p.evaluate(() => document.documentElement.classList.add('night'));
await p.click('#talk-points'); await p.waitForTimeout(900);
await p.screenshot({ path: path.join(OUT, 'talk-sheet-night.png') });
check(!errs.length, 'no page errors ' + errs.join(' | '));
await b.close();
process.exit(fails ? 1 : 0);
