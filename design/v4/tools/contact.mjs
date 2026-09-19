#!/usr/bin/env node
// Feeling scene-grammar plan, task 0.1 (design/v4/PLAN-scene-grammar.md).
// Tiles the sit-mode shots from shoot.mjs into one contact sheet:
// 5 columns (places) x 4 rows (skies), 195px per cell.
//
// Composites with an in-page <canvas> inside a headless Playwright page, so
// no third dependency (sharp, etc.) is needed beyond playwright itself.
//
// Usage: node contact.mjs

import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const SHOTS_DIR = path.resolve(__dirname, '..', 'shots');

const PLACES = ['dock', 'campo', 'keywest', 'hawaii', 'tokyo'];
const SKIES = ['morning', 'day', 'evening', 'night'];
const CELL = 195;

function todayStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function main() {
  const cells = [];
  const missing = [];
  SKIES.forEach((sky, row) => {
    PLACES.forEach((place, col) => {
      const file = path.join(SHOTS_DIR, `${place}-${sky}-sit.png`);
      if (!fs.existsSync(file)) {
        missing.push(file);
        return;
      }
      const dataUri = `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
      cells.push({ row, col, dataUri, label: `${place} / ${sky}` });
    });
  });

  if (missing.length) {
    console.warn(`contact.mjs: missing ${missing.length} sit-mode shot(s), leaving those cells blank:`);
    for (const m of missing) console.warn(`  ${path.relative(REPO_ROOT, m)}`);
  }
  if (cells.length === 0) {
    throw new Error('no sit-mode shots found — run shoot.mjs first');
  }

  const width = PLACES.length * CELL;
  const height = SKIES.length * CELL;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<!doctype html><html><body style="margin:0"><canvas id="c" width="${width}" height="${height}"></canvas></body></html>`
  );

  const dataUrl = await page.evaluate(
    ({ cells, cell }) => {
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const loadImage = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      return Promise.all(cells.map((c) => loadImage(c.dataUri).then((img) => ({ ...c, img })))).then((loaded) => {
        for (const c of loaded) {
          const x = c.col * cell;
          const y = c.row * cell;
          const scale = Math.max(cell / c.img.width, cell / c.img.height);
          const w = c.img.width * scale;
          const h = c.img.height * scale;
          const dx = x + (cell - w) / 2;
          const dy = y + (cell - h) / 2;

          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, cell, cell);
          ctx.clip();
          ctx.drawImage(c.img, dx, dy, w, h);
          ctx.restore();

          ctx.strokeStyle = 'rgba(255,255,255,.25)';
          ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
          ctx.fillStyle = 'rgba(0,0,0,.55)';
          ctx.fillRect(x, y + cell - 16, cell, 16);
          ctx.fillStyle = 'rgba(255,255,255,.9)';
          ctx.font = '10px sans-serif';
          ctx.fillText(c.label, x + 4, y + cell - 5);
        }
        return canvas.toDataURL('image/png');
      });
    },
    { cells, cell: CELL }
  );

  await browser.close();

  const outPath = path.join(SHOTS_DIR, `contact-${todayStamp()}.png`);
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
  console.log(`Wrote ${path.relative(REPO_ROOT, outPath)} (${cells.length}/${PLACES.length * SKIES.length} cells filled)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
