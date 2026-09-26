#!/usr/bin/env node
// Feeling 70: a backup carries circles + settings; restoring it on an empty phone brings them back.
// Network to the circle Worker is blocked, so no test member ever reaches a real circle.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = 'file:///' + path.resolve(__dirname, '..', '..', '..', 'index.html').replace(/\\/g, '/');
const seed = {
  entries: [{ id: 'e1', ts: Date.now(), day: new Date().toISOString().slice(0, 10), mood: 4, text: 'test' }],
  sessions: [], lastExport: 0, draft: null,
  circles: [{ name: 'Tester', code: 'testcircle1', id: 'member-abc', members: [], seen: 0 }],
  statusTo: [], checkins: { on: false, askedHome: 0 },
};
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
await ctx.route(/^https?:/, (r) => r.abort());
let fails = 0; const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };

// phone 1: has data, saves a backup
const p1 = await ctx.newPage();
await p1.addInitScript((s) => { if (!sessionStorage.getItem('seeded')) { localStorage.clear(); localStorage.setItem('feeling.v1', JSON.stringify(s)); localStorage.setItem('feeling.place', 'campo'); localStorage.setItem('feeling.rain', '1'); localStorage.setItem('feeling.docksound', '0'); sessionStorage.setItem('seeded', '1'); } }, seed);
await p1.addInitScript(() => { try { Object.defineProperty(navigator, 'share', { value: undefined }); Object.defineProperty(navigator, 'canShare', { value: undefined }); } catch (e) {} });
await p1.goto(INDEX); await p1.waitForTimeout(1200);
const [dl] = await Promise.all([p1.waitForEvent('download', { timeout: 5000 }), p1.evaluate(() => document.getElementById('export-json').click())]);
const file = path.join(__dirname, 'backup-test.json'); await dl.saveAs(file);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
check(data.circles?.[0]?.code === 'testcircle1' && data.circles[0].id === 'member-abc', 'backup has the circle with its member id');
check(data.settings?.place === 'campo' && data.settings.rain === '1' && data.settings.sound === '0', 'backup has place, rain, sound');
check(!('members' in data.circles[0]), 'backup leaves out other members');
await p1.close();

// phone 2: empty, restores
const ctx2 = await b.newContext({ viewport: { width: 390, height: 844 } });
await ctx2.route(/^https?:/, (r) => r.abort());
const p2 = await ctx2.newPage();
const errs = []; p2.on('pageerror', (e) => errs.push(e.message));
await p2.goto(INDEX); await p2.waitForTimeout(1200);
await p2.setInputFiles('#import-file', file);
await p2.waitForTimeout(3000);
const st = await p2.evaluate(() => ({ db: JSON.parse(localStorage.getItem('feeling.v1')), place: localStorage.getItem('feeling.place'), rain: localStorage.getItem('feeling.rain'), sound: localStorage.getItem('feeling.docksound'), toast: document.getElementById('toast').textContent }));
check(st.db.entries.length === 1, 'entry restored');
check(st.db.circles.length === 1 && st.db.circles[0].id === 'member-abc', 'circle restored as the same member');
check(st.place === 'campo' && st.rain === '1' && st.sound === '0', 'settings restored');
check(/1 new entry and 1 circle/.test(st.toast), 'toast: ' + st.toast);
// restoring twice adds nothing
await p2.setInputFiles('#import-file', file); await p2.waitForTimeout(600);
check((await p2.evaluate(() => JSON.parse(localStorage.getItem('feeling.v1')).circles.length)) === 1, 'second restore adds no duplicate circle');
check(!errs.length, 'no page errors ' + errs.join(' | '));
fs.unlinkSync(file);
await b.close();
process.exit(fails ? 1 : 0);
