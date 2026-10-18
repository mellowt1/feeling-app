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
// the hub is faked: a 16-character code gets two sections back; everything else on the network is blocked
let hubCalls = 0, hubBody = null;
await ctx.route(/^https?:/, (r) => {
  const u = r.request().url();
  if (/paul-hub\.paul-o-a04\.workers\.dev\/api\/talk\/abcdefgh23456789$/.test(u)) {
    hubCalls++; hubBody = JSON.parse(r.request().postData());
    return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ sections: [{ title: 'You flagged', items: ['I want to talk about my sister (today)'] }, { title: 'What weighed most', items: ['I froze at the work email at 21:00 (Thu 8 Oct)'] }] }) });
  }
  return r.abort();
});
const p = await ctx.newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.addInitScript((s) => { localStorage.clear(); localStorage.setItem('feeling.v1', JSON.stringify(s)); }, seed);
await p.goto(INDEX); await p.waitForTimeout(1200);
let fails = 0; const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };
const sheet = '.sheet:not(#circle-sheet)';

// 1. Today: the flag replaces the reassure line once you type, and goes into the entry
check(!(await p.isVisible('#bring')), 'flag hidden while the field is empty');
await p.fill('#text', 'I want to talk about my sister.');
check(await p.isVisible('#bring') && !(await p.isVisible('.entry-glass .reassure')), 'flag shows once you type');
await p.click('#bring');
check((await p.getAttribute('#bring', 'aria-pressed')) === 'true', 'flag on');
await p.screenshot({ path: path.join(OUT, 'talk-today-flag.png') });
await p.click('#save'); await p.waitForTimeout(600);
const saved = await p.evaluate(() => JSON.parse(localStorage.getItem('feeling.v1')).entries.at(-1));
check(saved.bring === true && /sister/.test(saved.text), 'entry saved with bring');
check((await p.getAttribute('#bring', 'aria-pressed')) === 'false', 'flag resets after Save');

// 2. History: the card shows it
await p.click('nav button[data-tab="history"]'); await p.waitForTimeout(700);
check((await p.locator('.flagmark').count()) === 1, 'history card shows "bring up"');

// 3. Talk points on the phone: You flagged first
await p.click('nav button[data-tab="export"]'); await p.waitForTimeout(700);
await p.screenshot({ path: path.join(OUT, 'talk-export.png') });
await p.click('#talk-points'); await p.waitForTimeout(900);
const txt = await p.evaluate((s) => document.querySelector(s + ' .panel').innerText, sheet);
console.log('---\n' + txt + '\n---');
for (const s of ['You flagged', 'How it went', 'Hardest moments', 'Kept coming up', 'What went well']) check(txt.includes(s), 'section ' + s);
check(txt.indexOf('You flagged') < txt.indexOf('How it went'), 'You flagged comes first');
check(/since the session/.test(txt), 'header names the session');
check(/Harder than the/.test(txt), 'compares with the days before');
await p.screenshot({ path: path.join(OUT, 'talk-sheet.png') });

// 4. Write it with Claude: code once, then the hub's sections; reopening uses the kept answer
await p.click(`${sheet} .tp-ai .btn`); await p.waitForTimeout(200);
check(await p.isVisible(`${sheet} .tp-code input`), 'asks for the hub code the first time');
await p.evaluate((s) => { const pn = document.querySelector(s + ' .panel'); pn.scrollTop = pn.scrollHeight; }, sheet); await p.waitForTimeout(200);
await p.screenshot({ path: path.join(OUT, 'talk-code.png') });
await p.fill(`${sheet} .tp-code input`, 'abcdefgh23456789');
await p.click(`${sheet} .tp-code .btn`); await p.waitForTimeout(800);
const ctxt = await p.evaluate((s) => document.querySelector(s + ' .panel').innerText, sheet);
check(hubCalls === 1 && /written by Claude/.test(ctxt) && /froze at the work email/.test(ctxt), "Claude's version shows");
check(hubBody && hubBody.entries.some((e) => e.bring === true) && hubBody.entries.every((e) => /^\d{2}:\d{2}$/.test(e.time)), 'hub got the entries with the flag');
await p.screenshot({ path: path.join(OUT, 'talk-claude.png') });
await p.click(`${sheet} .tp-ai .btn`); await p.waitForTimeout(200);
check(!/written by Claude/.test(await p.evaluate((s) => document.querySelector(s + ' .panel').innerText, sheet)), "back to the phone's version");
await p.click(`${sheet} .done`); await p.waitForTimeout(500);
await p.click('#talk-points'); await p.waitForTimeout(900);
check(hubCalls === 1 && /written by Claude/.test(await p.evaluate((s) => document.querySelector(s + ' .panel').innerText, sheet)), 'reopened: kept answer, no second call');

// 5. everything range + dark sky
await p.click(`${sheet} .done`); await p.waitForTimeout(500);
await p.click('#range-seg button[data-r="all"]'); await p.waitForTimeout(300);
await p.evaluate(() => document.documentElement.classList.add('night'));
await p.click('#talk-points'); await p.waitForTimeout(900);
await p.screenshot({ path: path.join(OUT, 'talk-sheet-night.png') });
check(!errs.length, 'no page errors ' + errs.join(' | '));
await b.close();
process.exit(fails ? 1 : 0);
