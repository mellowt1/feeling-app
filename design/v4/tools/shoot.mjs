#!/usr/bin/env node
// Feeling scene-grammar plan, task 0.1 (design/v4/PLAN-scene-grammar.md).
// Screenshots every place x sky combination, plus a sit-mode variant and a
// night late-mode variant, cropped to the scene band. Node only.
//
// Usage:
//   node shoot.mjs                       shoot everything (45 PNGs)
//   node shoot.mjs --place keywest        one place, all skies
//   node shoot.mjs --place keywest --sky evening
//   node shoot.mjs --reduce               reducedMotion: 'reduce'
//   node shoot.mjs --gust                 also add body.gust before the shot

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..'); // .../Feeling App
const INDEX_HTML = path.join(REPO_ROOT, 'index.html');
const SHOTS_DIR = path.resolve(__dirname, '..', 'shots');

const PLACES = ['dock', 'campo', 'keywest', 'hawaii', 'tokyo', 'hearth'];
const SKIES = ['morning', 'day', 'evening', 'night'];

const VIEWPORT = { width: 390, height: 844 };
const DEVICE_SCALE_FACTOR = 2;
const SETTLE_MS = 4000;   // let ambient loops settle after load
const MODE_WAIT_MS = 1500; // let the sit/late transition finish

function parseArgs(argv) {
  const args = { place: null, sky: null, reduce: false, gust: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--place') args.place = argv[++i];
    else if (a === '--sky') args.sky = argv[++i];
    else if (a === '--reduce') args.reduce = true;
    else if (a === '--gust') args.gust = true;
  }
  if (args.place && !PLACES.includes(args.place)) {
    throw new Error(`unknown place "${args.place}" (expected one of ${PLACES.join(', ')})`);
  }
  if (args.sky && !SKIES.includes(args.sky)) {
    throw new Error(`unknown sky "${args.sky}" (expected one of ${SKIES.join(', ')})`);
  }
  return args;
}

// Today crop: bottom 42% of the viewport. Sit mode crop: bottom 44vh (the
// .waves height in body.dock, see index.html line ~847). Late mode rides on
// top of the Today view (no -sit suffix), so it uses the Today crop.
function cropHeightFor(variant) {
  const pct = variant === 'sit' ? 0.44 : 0.42;
  return Math.round(VIEWPORT.height * pct);
}

async function shotFor(page, { place, sky, variant }) {
  const suffix = variant === 'sit' ? '-sit' : variant === 'late' ? '-late' : '';
  const fileName = `${place}-${sky}${suffix}.png`;
  const filePath = path.join(SHOTS_DIR, fileName);
  const cropHeight = cropHeightFor(variant);
  const clip = { x: 0, y: VIEWPORT.height - cropHeight, width: VIEWPORT.width, height: cropHeight };
  await page.screenshot({ path: filePath, clip });
  return filePath;
}

// One context/page per place+sky pair, reused across the today/sit/late
// variants for that pair — avoids repeating the 4 s ambient-loop settle wait
// once per shot (that was the whole rig's runtime budget).
async function shootPair(browser, { place, sky, reduce, gust }) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    reducedMotion: reduce ? 'reduce' : 'no-preference',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const fileUrl = `file://${INDEX_HTML.replace(/\\/g, '/')}?place=${place}&sky=${sky}`;
  await page.goto(fileUrl);
  await page.waitForTimeout(SETTLE_MS);
  if (gust) {
    await page.evaluate(() => document.body.classList.add('gust'));
    await page.waitForTimeout(300);
  }

  const saved = [];
  saved.push(await shotFor(page, { place, sky, variant: 'today' }));

  await page.evaluate(() => document.body.classList.add('dock'));
  await page.waitForTimeout(MODE_WAIT_MS);
  saved.push(await shotFor(page, { place, sky, variant: 'sit' }));

  if (sky === 'night') {
    await page.evaluate(() => {
      document.body.classList.remove('dock');
      document.body.classList.add('late');
    });
    await page.waitForTimeout(MODE_WAIT_MS);
    saved.push(await shotFor(page, { place, sky, variant: 'late' }));
  }

  await context.close();
  return saved;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  fs.mkdirSync(SHOTS_DIR, { recursive: true });

  const places = args.place ? [args.place] : PLACES;
  const skies = args.sky ? [args.sky] : SKIES;

  const browser = await chromium.launch();
  let saved = [];
  try {
    // Shoot place/sky pairs concurrently (separate contexts) to use the 4 s
    // settle wait in parallel instead of serially.
    const jobs = [];
    for (const place of places) {
      for (const sky of skies) {
        jobs.push(shootPair(browser, { place, sky, reduce: args.reduce, gust: args.gust }));
      }
    }
    const results = await Promise.all(jobs);
    saved = results.flat();
  } finally {
    await browser.close();
  }

  for (const f of saved) console.log(path.relative(REPO_ROOT, f));
  console.log(`\nSaved ${saved.length} screenshots to ${path.relative(REPO_ROOT, SHOTS_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
