// Builds the Hawaiʻi (Kaʻaʻawa, windward Oʻahu) scene for Feeling: sprite symbols, markup and CSS.
// Output: symbols.html, markup.html, style.css, parts/*.svg (for Figma)
import fs from 'fs';
const D = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const r1 = (n) => Math.round(n * 10) / 10;
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// ---------- PhyloPic symbols ----------
function symbol(id, file) {
  const s = fs.readFileSync(D + file, 'utf8');
  const vb = s.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const tr = s.match(/<g transform="([^"]+)"/)[1].replace(/\.0+(?=[,)\s])/g, '').replace(/0\.100000/g, '.1').replace(/-0\.1\b/g, '-.1');
  const ds = [...s.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1].replace(/\s+/g, ' ').trim()).join(' ');
  return `<symbol id="${id}" viewBox="0 0 ${vb[2]} ${vb[3]}"><g transform="${tr}"><path d="${ds}"/></g></symbol>`;
}
const symbols = [symbol('f-tropicbird', 'tropicbird.svg'), symbol('f-humpback', 'humpback.svg'), symbol('f-turnstone', 'turnstone.svg')].join('\n');
const vbOf = (f) => fs.readFileSync(D + f, 'utf8').match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number).slice(2).join(' ');

// ---------- the Koʻolau pali (viewBox 0 0 390 100, base on the horizon) ----------
function ridge(x0, x1, env, jag, step = 3) {
  const pts = [];
  for (let x = x0; x <= x1; x += step) {
    const e = env(x);
    const j = jag * (Math.sin(x * 0.21 + 1.3) * 0.5 + Math.sin(x * 0.53) * 0.35 + (rnd() - 0.5) * 0.6);
    pts.push([x, Math.min(100, e + j)]);
  }
  return pts;
}
const smoothPath = (pts, close = true) => {
  let d = `M${r1(pts[0][0])},100 L${r1(pts[0][0])},${r1(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i], [px, py] = pts[i - 1];
    d += ` Q${r1(px)},${r1(py)} ${r1((px + x) / 2)},${r1((py + y) / 2)}`;
  }
  const L = pts[pts.length - 1];
  d += ` L${r1(L[0])},${r1(L[1])} L${r1(L[0])},100` + (close ? ' Z' : '');
  return d;
};
const bump = (x, c, w, h) => h * Math.exp(-((x - c) ** 2) / (2 * w * w));
seed = 11;
const ramp = (x, x0, w) => { const t = Math.max(0, Math.min(1, (x - x0) / w)); return t * t * (3 - 2 * t); };
const farEnv = (x) => 100 - ramp(x, 50, 60) * (20 + bump(x, 124, 26, 50) + bump(x, 196, 30, 36) + bump(x, 300, 50, 44) + bump(x, 380, 30, 34));
const nearEnv = (x) => 100 - ramp(x, 84, 40) * (6 + bump(x, 152, 22, 76) + bump(x, 118, 14, 30) + bump(x, 234, 26, 50) + bump(x, 322, 30, 62) + bump(x, 392, 20, 44));
const far = ridge(48, 390, (x) => farEnv(x), 2.4, 4);
const near = ridge(82, 390, nearEnv, 4.2, 3);
const nearTop = (x) => { let best = near[0]; for (const p of near) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p; return best[1]; };
// flutes: shadowed gullies and lit spurs running down the near face
let flutes = '', spurs = '';
seed = 5;
for (let x = 90; x < 388; x += 9 + rnd() * 8) {
  const top = nearTop(x) + 3 + rnd() * 4; if (top > 84) continue;
  const lean = (rnd() - 0.5) * 8, mid = (top + 100) / 2, end = top + (100 - top) * (0.55 + rnd() * 0.4);
  flutes += `M${r1(x)},${r1(top)} Q${r1(x + lean)},${r1(mid)} ${r1(x + lean * 1.4)},${r1(end)} `;
  const xs = x + 3.2;
  spurs += `M${r1(xs)},${r1(nearTop(xs) + 4)} Q${r1(xs + lean)},${r1(mid + 4)} ${r1(xs + lean * 1.5)},100 `;
}
// Kualoa point on the left with a few far palms, and Mokoliʻi offshore
const point = 'M0,100 L0,92 C10,90 22,89 34,90 C44,91 52,93 60,96 L66,100 Z';
const farPalms = [[8, 90, 10], [15, 89.5, 8.5], [27, 89.6, 9.5], [44, 91, 7]].map(([x, y, h]) =>
  `M${x - 0.5},${y} L${x + 0.3},${y - h} L${x + 0.9},${y - h} L${x + 0.4},${y} Z M${x + 0.6},${y - h} l-3.2,1.4 l3,-0.4 l-1.8,2.4 l2.2,-2 l2.6,1.8 l-1.6,-2.4 l3.2,0.6 l-3.2,-1.6 l1.4,-1.6 Z`).join(' ');
const mokolii = 'M62,100 C66,99 70,97 73,93 C75,90 76,86 78,83.5 C79,82.4 80.6,82.4 81.4,84 C82.6,86.8 83.4,90 86,93.4 C88.6,96.4 92,98.6 96,100 Z';
const pali = `<svg class="pali" viewBox="0 0 390 100" preserveAspectRatio="none">`
  + `<path class="far" d="${smoothPath(far)}"/>`
  + `<path class="near" d="${smoothPath(near)}"/>`
  + `<path class="flutes" d="${flutes.trim()}"/><path class="spurs" d="${spurs.trim()}"/>`
  + `<path class="point" d="${point}"/><path class="point" d="${farPalms}"/><path class="moku" d="${mokolii}"/></svg>`;

// ---------- coconut palms, leaning to the water; fronds stream inland with the trade wind ----------
const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]; };
function trunk(p0, p1, p2, p3, w0, w1) {
  const L = [], R = [], N = 28;
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = bez(p0, p1, p2, p3, t), q = bez(p0, p1, p2, p3, Math.min(1, t + 0.01)), a = bez(p0, p1, p2, p3, Math.max(0, t - 0.01));
    let dx = q[0] - a[0], dy = q[1] - a[1]; const l = Math.hypot(dx, dy); dx /= l; dy /= l;
    const w = (w0 * (1 - t) + w1 * t) / 2 + (t < 0.06 ? (0.06 - t) * 18 : 0) + Math.sin(t * 60) * 0.12; // flare at the foot, ring scars
    L.push([p[0] - dy * w, p[1] + dx * w]); R.push([p[0] + dy * w, p[1] - dx * w]);
  }
  const pts = [...L, ...R.reverse()];
  return 'M' + pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' L') + ' Z';
}
seed = 19;
function frond(c, ang, len, droop, leaf) {
  const a = ang * Math.PI / 180, dir = [Math.cos(a), Math.sin(a)];
  const P = (t) => [c[0] + dir[0] * len * t, c[1] + dir[1] * len * t + droop * len * t * t];
  let d = '';
  // rachis
  const rs = []; const ls = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10, p = P(t), q = P(Math.min(1, t + 0.02)), b = P(Math.max(0, t - 0.02)); let tx = q[0] - b[0], ty = q[1] - b[1]; const l = Math.hypot(tx, ty); tx /= l; ty /= l; const w = 0.9 * (1 - t) + 0.25; rs.push([p[0] - ty * w, p[1] + tx * w]); ls.push([p[0] + ty * w, p[1] - tx * w]); }
  d += 'M' + [...rs, ...ls.reverse()].map(([x, y]) => `${r1(x)},${r1(y)}`).join(' L') + ' Z ';
  // leaflets hanging from both sides, longest in the middle
  for (let t = 0.12; t < 0.98; t += 0.05 + rnd() * 0.02) {
    const p = P(t), q = P(t + 0.02); let tx = q[0] - p[0], ty = q[1] - p[1]; const l = Math.hypot(tx, ty); tx /= l; ty /= l;
    const nx = -ty, ny = tx, L = leaf * (0.45 + Math.sin(t * Math.PI) * 0.65) * (0.8 + rnd() * 0.4);
    for (const s of [1, -1]) {
      // leaflets sweep back along the frond in a V, the lower side hangs a little: a feather streaming in the wind
      const side = ny * s > 0 ? 1 : -1, sag = side > 0 ? 0.45 : 0.1;
      const tip = [p[0] + (tx * 0.75 + nx * s * 0.62) * L, p[1] + (ty * 0.75 + ny * s * 0.62) * L + sag * L];
      const b2 = [p[0] + tx * 1.7, p[1] + ty * 1.7];
      d += `M${r1(p[0])},${r1(p[1])} L${r1(b2[0])},${r1(b2[1])} L${r1(tip[0])},${r1(tip[1])} Z `;
    }
  }
  return d.trim();
}
// trunk base, two controls, crown; frond fan [angle, length, droop]
const FAN = [[-64, .55, .5], [-34, .9, .45], [-12, 1, .4], [10, 1, .5], [32, .9, .6], [60, .7, .6], [100, .45, .5], [150, .5, .6], [192, .55, .45], [232, .45, .4]];
const PALMS = [
  { id: 'p3', base: [226, 150], c1: [224, 104], c2: [214, 60], top: [206, 26], w: [5.8, 3.4], size: 26, tilt: -4 },  // off the right edge, only its crown
  { id: 'p4', base: [140, 150], c1: [118, 116], c2: [78, 76], top: [30, 44], w: [6, 3.3], size: 28, tilt: 10 },      // the long one leaning out over the sand
  { id: 'p2', base: [155, 150], c1: [150, 100], c2: [140, 40], top: [132, 0], w: [6.2, 3.5], size: 32, tilt: 0 },
  { id: 'p1', base: [148, 150], c1: [140, 96], c2: [104, 44], top: [76, 12], w: [7, 3.8], size: 31, tilt: 4 },       // Nick leans on this one
];
let palmSvg = '';
for (const P of PALMS) {
  palmSvg += `<path class="trunk" d="${trunk(P.base, P.c1, P.c2, P.top, P.w[0], P.w[1])}"/>`;
  const c = P.top;
  palmSvg += `<g class="crown ${P.id}" style="transform-origin:${c[0]}px ${c[1]}px">`;
  for (const [ang, lf, dr] of FAN) palmSvg += `<path d="${frond(c, ang + P.tilt, P.size * lf, dr * 0.9, 5.2 * P.size / 32)}"/>`;
  palmSvg += `<circle cx="${c[0] - 1.6}" cy="${c[1] + 3}" r="2.4"/><circle cx="${c[0] + 2.2}" cy="${c[1] + 3.6}" r="2.4"/><circle cx="${c[0] + 0.3}" cy="${c[1] + 5.4}" r="2.2"/></g>`;
}

// ---------- ironwood and naupaka behind the palms (same 210 x 160 box) ----------
seed = 3;
function fringe(cx, baseY, h, w) { // a feathery ironwood: stacked irregular sprays
  let pts = [];
  const N = 46;
  for (let i = 0; i <= N; i++) { const t = i / N, y = baseY - h * t, half = w * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (0.75 + rnd() * 0.5) + (t < 0.1 ? 3 : 0); pts.push([cx + half + (rnd() - .5) * 3, y]); }
  const right = pts; pts = [];
  for (let i = N; i >= 0; i--) { const t = i / N, y = baseY - h * t, half = w * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (0.75 + rnd() * 0.5) + (t < 0.1 ? 3 : 0); pts.push([cx - half + (rnd() - .5) * 3, y]); }
  return 'M' + [...right, ...pts].map(([x, y]) => `${r1(x)},${r1(y)}`).join(' L') + ' Z';
}
function mound(x0, x1, baseY, h) {
  let d = `M${x0},${baseY}`; const n = 14;
  for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = baseY - h * Math.sin(Math.PI * t) ** 0.6 - (rnd() - .3) * 5; d += ` Q${r1(x - (x1 - x0) / n / 2)},${r1(y - 4)} ${r1(x)},${r1(y)}`; }
  return d + ` L${x1},${baseY} Z`;
}
const bush = `<svg class="bush" viewBox="0 0 210 160"><path class="iron" d="${fringe(214, 128, 100, 15)}"/><path class="naupaka" d="${mound(178, 240, 132, 16)}"/></svg>`;

// ---------- lava rocks at the water's edge (sand coords 390 x 240) ----------
const rocks = [[236, 158.5, 6, 2.2], [245, 156.6, 4, 1.8], [254, 155, 7, 2.6], [262, 153.4, 3.5, 1.5], [372, 142.5, 8, 2.6]].map(([x, y, w, h]) =>
  `M${x - w},${y} C${x - w},${y - h * 1.2} ${x - w * .3},${y - h * 1.5} ${x + w * .2},${y - h * 1.3} C${x + w * .8},${y - h} ${x + w},${y - h * .5} ${x + w},${y} Z`).join(' ');

// ---------- markup ----------
const kw = fs.readFileSync('C:/Users/Admin/Desktop/PAUL AGENTS/Feeling App/index.html', 'utf8');
const kwBlock = kw.slice(kw.indexOf('<div class="waves keywest"'), kw.indexOf('<div class="headrow">'));
const pick = (re) => { const m = kwBlock.match(re); if (!m) throw new Error('missing ' + re); return m[0]; };
const sandKW = pick(/<svg class="sand"[\s\S]*?<\/svg>/);
const person = pick(/<g class="person-wrap">[\s\S]*?<\/g><\/g><\/g>/);
const cats = pick(/<g class="cats">[\s\S]*?<\/g>\s*<\/g>/);
// a calm bay: the back water is nearly flat, its crest a hair above the horizon so the land's foot stays in the water
const w1 = '<svg class="w1" viewBox="0 0 1200 200" preserveAspectRatio="none"><path class="w1" d="M0,72 C100,70 200,74 300,72 C400,70 500,74 600,72 C700,70 800,74 900,72 C1000,70 1100,74 1200,72 L1200,200 L0,200 Z"></path></svg>';
const w2 = pick(/<svg class="w2"[\s\S]*?<\/svg>/), w3 = pick(/<svg class="w3"[\s\S]*?<\/svg>/);
const sand = sandKW.replace('</svg>', `<path class="rock" d="${rocks}"/></svg>`);
const glitter = '<div class="glitter" aria-hidden="true">' + '<span></span>'.repeat(12) + '</div>';

const markup = `<div class="waves hawaii" aria-hidden="true">
      <div class="amb afterglow dusk-only"></div>
      <div class="wave-wrap"><div class="swell">
        ${glitter}
        ${w1}
        <div class="amb caps"><i></i><i></i><i></i></div>
        ${pali}
        <div class="amb shower"></div>
        <div class="amb rainbow not-dusk day-only"></div>
        <div class="koae-wrap day-only not-dusk"><svg class="koae" viewBox="0 0 ${vbOf('tropicbird.svg')}"><use href="#f-tropicbird"/></svg></div>
        <div class="whale-wrap"><div class="spout"></div><div class="whale-sea"><svg class="whale" viewBox="0 0 ${vbOf('humpback.svg')}"><use href="#f-humpback"/></svg></div></div>
        <div class="bw b2">${w2}</div>
        <div class="iwa-wrap day-only not-dusk"><svg class="iwa" viewBox="0 0 873 1536"><use href="#f-frigate"/></svg></div>
        <div class="honu-wrap not-night"><svg class="honu" viewBox="0 0 1536 1410"><use href="#f-turtle"/></svg></div>
        <div class="bw b3">${w3}</div>
      </div></div>
      ${sand}
      <svg class="amb akekeke k1 day-only" viewBox="0 0 ${vbOf('turnstone.svg')}"><use href="#f-turnstone"/></svg>
      <svg class="amb akekeke k2 day-only" viewBox="0 0 ${vbOf('turnstone.svg')}"><use href="#f-turnstone"/></svg>
      <svg class="amb ohiki night-only" viewBox="0 0 1536 1096"><use href="#f-crab"/></svg>
      ${bush}
      <svg class="palm" viewBox="0 0 210 160">
        <g class="fig">${palmSvg}</g>
        ${person}
        ${cats}
      </svg>
    </div>
`;

fs.writeFileSync(D + 'symbols.html', symbols);
fs.writeFileSync(D + 'markup.html', markup);
fs.mkdirSync(D + 'parts', { recursive: true });
fs.writeFileSync(D + 'parts/pali.svg', pali.replace('<svg class="pali"', '<svg xmlns="http://www.w3.org/2000/svg" width="390" height="100"'));
fs.writeFileSync(D + 'parts/palms.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 240 180" width="240" height="180">${bush.replace(/<\/?svg[^>]*>/g, '')}<g fill="#2E463F">${palmSvg}${person}${cats}</g></svg>`);
console.log('ok', markup.length, symbols.length);
