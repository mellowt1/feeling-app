#!/usr/bin/env node
// Feeling 73: the next session from the to-do list (paul-hub GET /api/talk/:code/next) shows as a card on Today
// from the day before, with how many entries are flagged; a tap opens the talk points. Past visits become sessions.
// The hub is faked; everything else on the network is blocked.
import { chromium, webkit } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = 'file:///' + path.resolve(__dirname, '..', '..', '..', 'index.html').replace(/\\/g, '/');
const OUT = process.argv[2] || path.resolve(__dirname, '..', 'shots');
const pad = (n) => String(n).padStart(2, '0');
const cal = (daysAhead) => { const d = new Date(); d.setDate(d.getDate() + daysAhead); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const key = (ts) => { const d = new Date(ts - 4 * 3600e3); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const at = (daysAgo, h) => { const d = new Date(); d.setDate(d.getDate() - daysAgo); d.setHours(h, 10, 0, 0); return d.getTime(); };
const CODE = 'abcdefgh23456789';
const lines = [
  [20, 21, 2, 'Old flag before the last session.', true],
  [9, 21, 2, 'Could not sleep, the deadline keeps going round.', true],
  [6, 22, 6, 'Argument about the move.', false],
  [3, 20, 1, 'Froze at the work email.', true],
  [1, 20, 3, 'Okay day.', false],
];
const seed = (sessions = []) => ({
  entries: lines.map(([d, h, m, t, b], i) => ({ id: 'e' + i, ts: at(d, h), day: key(at(d, h)), mood: m, text: t, ...(b ? { bring: true } : {}) })),
  sessions, lastExport: Date.now(), draft: null, circles: [], statusTo: [], checkins: { on: false, askedHome: 0 },
});

let fails = 0; const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };

async function run(engine, { next, past = [], code = CODE, sessions = [], night = false, gust = false, reduce = false, w = 390, h = 844, shot }) {
  const b = await engine.launch();
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, reducedMotion: reduce ? 'reduce' : 'no-preference' });
  let calls = 0;
  await ctx.route(/^https?:/, (r) => {
    if (new RegExp(`paul-hub\\.paul-o-a04\\.workers\\.dev/api/talk/${CODE}/next$`).test(r.request().url())) {
      calls++;
      return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ next, past, at: Date.now() }) });
    }
    return r.abort();
  });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(([s, c]) => { localStorage.clear(); localStorage.setItem('feeling.v1', JSON.stringify(s)); if (c) localStorage.setItem('feeling.hubcode', c); }, [seed(sessions), code]);
  await p.goto(INDEX); await p.waitForTimeout(1200);
  if (night) await p.evaluate(() => document.documentElement.classList.add('night'));
  if (gust) await p.evaluate(() => document.body.classList.add('gust'));
  await p.waitForTimeout(300);
  const st = {
    calls, errs,
    shown: await p.isVisible('#session-card'),
    when: await p.textContent('#session-card .sc-when'),
    what: await p.textContent('#session-card .sc-what'),
    sessions: await p.evaluate(() => JSON.parse(localStorage.getItem('feeling.v1')).sessions),
  };
  if (shot) await p.screenshot({ path: path.join(OUT, shot) });
  if (st.shown) {
    const card = await p.locator('#session-card').boundingBox(), glass = await p.locator('.entry-glass').boundingBox(), head = await p.locator('.headrow').boundingBox();
    st.fits = card.y >= head.y + head.height - 1 && card.y + card.height <= glass.y + 1 && card.x >= 0 && card.x + card.width <= w;
    await p.click('#session-card'); await p.waitForTimeout(700);
    st.sheet = await p.isVisible('.sheet:not(#circle-sheet) .preview-page');
    st.sheetText = st.sheet ? await p.textContent('.sheet:not(#circle-sheet) .preview-page') : '';
    if (shot) await p.screenshot({ path: path.join(OUT, shot.replace('.png', '-open.png')) });
  }
  await b.close();
  return st;
}

const tomorrow = { title: 'Anna', kind: 'psychologist', date: cal(1), time: '12:45' };
const lastVisit = key(at(14, 12));

// 1. Tomorrow, with the last visit coming back as a past session: card shows, counts the two flags since then, opens talk points
let s = await run(chromium, { next: tomorrow, past: [lastVisit], shot: 'session-card.png' });
check(s.calls === 1, 'asked the hub once');
check(s.shown && s.when === 'Anna tomorrow 12:45', 'card says who and when: ' + s.when);
check(s.what === '2 flagged', 'counts flags since the last session: ' + s.what);
check(s.sessions.includes(lastVisit), 'past visit marked as a session');
check(s.fits, 'card sits between the header and the entry field');
check(s.sheet && /Could not sleep/.test(s.sheetText) && /Froze/.test(s.sheetText) && !/Old flag/.test(s.sheetText), 'tap opens talk points since that session');
check(!s.errs.length, 'no page errors ' + s.errs.join(' | '));

// 2. Today, whole day, nothing flagged since a session yesterday
s = await run(chromium, { next: { title: 'Bram', kind: 'psychiatrist', date: cal(0), time: null }, sessions: [key(Date.now())], shot: 'session-card-today.png' });
check(s.shown && s.when === 'Bram today' && s.what === 'Talk points', 'today, whole day, nothing flagged: ' + s.when + ' / ' + s.what);

// 3. Three days out: no card yet
s = await run(chromium, { next: { ...tomorrow, date: cal(3) } });
check(!s.shown, 'no card three days before');

// 4. No hub code: nothing asked, no card
s = await run(chromium, { next: tomorrow, code: '' });
check(s.calls === 0 && !s.shown, 'no code: no call, no card');

// 5. Nothing coming up
s = await run(chromium, { next: null });
check(!s.shown, 'no next session: no card');

// 6. Looks: night, gust, reduced motion, small screen, WebKit
s = await run(chromium, { next: tomorrow, night: true, gust: true, reduce: true, shot: 'session-card-night-gust.png' });
check(s.shown && s.fits, 'night + body.gust + reduced motion');
s = await run(webkit, { next: tomorrow, w: 375, h: 667, shot: 'session-card-se-webkit.png' });
check(s.shown && s.fits && s.sheet, 'WebKit 375x667');

console.log(fails ? `\n${fails} failed` : '\nall passed');
process.exit(fails ? 1 : 0);
