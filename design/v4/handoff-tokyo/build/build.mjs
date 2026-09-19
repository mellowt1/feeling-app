// Builds the Tokyo kaiju scene for Feeling (Paul's own place): one SVG per layer, all in the
// same 390x420 frame so they stack 1:1 in Figma and in the app. Output: parts/*.svg
// Godzilla comes from godzilla-side-trace.svg + godzilla-side-plates.svg (potrace, see trace-side.cjs / trace-plates.cjs).
import fs from 'fs';
import { fileURLToPath } from 'url';
const D = fileURLToPath(new URL('.', import.meta.url));
const r1 = (n) => Math.round(n * 10) / 10;
let seed = 3; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const W = 390, H = 420;
const svg = (body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;
const out = {};

// Fixed dusk. Horizon (far shore) at y=232, bay down to y=300, rooftop from y=300.
const C = {
  skyTop: '#1c1630', skyMid: '#4b2447', skyLow: '#b8483a', skyGlow: '#f0934a',
  far: '#6a3a55', farWin: '#ffc98a',
  near: '#2a1a2c', nearWin: '#ffd48a',
  tower: '#e2552b', towerLit: '#ffb070',
  water: '#3b2440', waterGlow: '#d86a3a',
  gz: '#171220', plate: '#9fe6ff',
  smoke: '#2e1f2b', fire: '#ff7a2a', fireCore: '#ffd08a',
  roof: '#1d1520', parapet: '#2a1e2a', rail: '#4a3a48',
  lantern: '#ff5a3a', lanternGlow: '#ffb46a', cord: '#120d14',
};

// ---------- sky ----------
out.sky = svg(`<rect width="${W}" height="300" fill="url(#g)"/><ellipse cx="300" cy="238" rx="210" ry="48" fill="${C.skyGlow}" opacity=".45"/>`,
  `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.skyTop}"/><stop offset=".45" stop-color="${C.skyMid}"/><stop offset=".72" stop-color="${C.skyLow}"/><stop offset=".8" stop-color="${C.skyGlow}"/></linearGradient>`);

// ---------- far skyline + Skytree (hazy, across the bay) ----------
function blocks(x0, x1, base, hMin, hMax, wMin, wMax) {
  const r = []; let x = x0;
  while (x < x1) { const w = wMin + rnd() * (wMax - wMin), h = hMin + rnd() ** 1.6 * (hMax - hMin); r.push([r1(x), r1(base - h), r1(w), r1(h)]); x += w - 0.6; }
  return r;
}
seed = 21;
const farB = blocks(0, W, 234, 4, 26, 5, 14);
const farD = farB.map(([x, y, w, h]) => `M${x},234 V${y} H${r1(x + w)} V234 Z`).join(' ');
// Skytree at x=58: tapering lattice needle, two decks, antenna. Top at y=96.
const st = 'M52,234 L56.4,150 L55.2,150 L55.2,146 L61.8,146 L61.8,150 L60.6,150 L57.6,118 L56.2,118 L56.2,114.5 L60.8,114.5 L60.8,118 L59.4,118 L58.8,104 L58.6,96 L58.4,104 L57.6,118 L60.6,150 L65,234 Z';
let farWin = ''; seed = 4;
for (const [x, y, w, h] of farB) for (let yy = y + 2; yy < 232; yy += 3) for (let xx = x + 1; xx < x + w - 1; xx += 2.2) if (rnd() < 0.09) farWin += `M${r1(xx)},${r1(yy)}h1v1h-1z`;
out.farSkyline = svg(`<path d="${farD} ${st}" fill="${C.far}"/><path d="${farWin}" fill="${C.farWin}" opacity=".55"/><circle cx="58.5" cy="116" r="1.4" fill="${C.farWin}" opacity=".9"/>`);

// ---------- bay ----------
seed = 17;
const waves = [...Array(70)].map(() => { const y = 300 + rnd() ** 1.3 * 118, x = rnd() * W, w = 6 + (y - 300) / 118 * 22 * (0.6 + rnd()); return `M${r1(x)},${r1(y)} h${r1(w)}`; }).join(' ');
const towerStreak = `<rect class="streak" x="107" y="304" width="10" height="74" fill="${C.tower}" opacity=".28"/>`;
const fireStreaks = towerStreak + [[150, 16], [182, 10], [300, 9], [376, 14], [36, 12]].map(([x, r]) => `<rect class="streak" x="${x - r * .45}" y="${x === 376 || x === 36 ? 292 : 238}" width="${r * .9}" height="${x === 376 || x === 36 ? 60 : 56}" fill="${C.fire}" opacity=".22"/>`).join("");
out.bay = svg(`<rect y="232" width="${W}" height="188" fill="url(#bayg)"/>${fireStreaks}<path class="waves" d="${waves}" stroke="#8a5a7a" stroke-width=".8" opacity=".45"/>`, `<linearGradient id="bayg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.water}"/><stop offset=".4" stop-color="#2c1a33"/><stop offset="1" stop-color="#140c18"/></linearGradient>`) + '';
out.bayGlints = svg(`<path d="M180,236 h200 v3 h-200z M210,246 h160 v2 h-160z M236,258 h120 v2 h-120z M250,272 h90 v2 h-90z M262,286 h60 v2 h-60z" fill="${C.waterGlow}" opacity=".5"/>`);

// ---------- Godzilla, side profile facing Tokyo Tower (trace of design/109-…-final-wars-render.png, see trace-side.cjs
// and trace-plates.cjs; plates are the pale areas of the photo, traced as their own layer so they glow) ----------
const clean = (d) => d.replace(/-?\d+\.\d+/g, (m) => String(Math.round(+m))).replace(/\s+/g, ' ').replace(/, /g, ',').replace(/ ?([MLCZ]) ?/g, '$1');
const gzD = clean(fs.readFileSync(D + 'godzilla-side-trace.svg', 'utf8').match(/ d="([^"]+)"/)[1]);
const plD = clean(fs.readFileSync(D + 'godzilla-side-plates.svg', 'utf8').match(/ d="([^"]+)"/)[1]);
// tail crest + charge route come from fins.cjs (run it after changing the trace)
const FINS = JSON.parse(fs.readFileSync(D + 'parts/fins.json', 'utf8'));
export const CHARGE_ROUTE = FINS.route; // scene coords: tail tip → tail base → up the back → head
const GZ = { x: 196, y: 76, s: 0.238 }; // trace is 786x840 → about 187x200 in the scene, feet at the waterline
const gzG = (inner) => `<g transform="translate(${GZ.x} ${GZ.y}) scale(${GZ.s})">${inner}</g>`;
out.godzilla = svg(gzG(`<path d="${gzD}" fill="${C.gz}"/><path d="${FINS.fins}" fill="${C.gz}"/>`) +
  `<path d="M204,266 q16,-5 32,-1 M322,266 q16,-4 34,0" stroke="#f3d6c0" stroke-width="1.2" fill="none" opacity=".7"/>`);
// Spines are their own layer: only they glow (no aura, no body glow — Paul, 2026-09-19).
// Figma: DROP_SHADOW screen #9fe6ff r3 + #4db3ff r12 (calm); during the beam fill #eafcff, r4 + r22.
// The lit area is the body outline clipped to a band along the back (plate bases → tips), with the traced
// pale plate details on top as hot highlights. In Figma the band is an intersect of body ∩ SPINE_BAND.
export const SPINE_BAND = 'M270,120 L330,100 L500,200 L540,420 L560,560 L640,660 L640,700 L600,700 L555,672 L500,612 L468,548 L442,478 L418,408 L388,338 L356,268 L318,208 L276,160 Z';
out.spines = svg(gzG(`<linearGradient id="sg" x1="0" y1=".62" x2=".62" y2=".3"><stop offset="0" stop-color="${C.plate}" stop-opacity="0"/><stop offset=".5" stop-color="${C.plate}" stop-opacity=".95"/></linearGradient><clipPath id="band"><path d="${SPINE_BAND}"/></clipPath><path d="${gzD}" fill="url(#sg)" clip-path="url(#band)"/><path d="${plD}" fill="#eafcff"/><path d="${FINS.fins}" fill="${C.plate}" opacity=".95"/>`));
// Breath cycle (Paul, 2026-09-19): idle spines at .45; CHARGE 3.5 s — a mask-image linear-gradient on the lit
// spines climbs from the tail (bottom, y≈262) to the head (y≈80) with a ~14 px soft edge and flicker, glow grows
// calm → beam; mouth flare fades in over the last 0.5 s; FIRE = breath clip; fade 2 s; then 20 s rest. The roar is separate:
// once per rest, 6–12 s after the fade, never within 5 s of the next charge; Godzilla rears back 2.4° while it plays.
export const BREATH = { idleOpacity: 0.45, chargeMs: 3500, mouthMs: 500, fireMs: 2000, fadeMs: 2000, restMs: 20000, roarInRestMs: [6000, 12000], chargeTop: 80, chargeBottom: 262 };
export const SPINE_GLOW = { calm: 'drop-shadow(0 0 1.5px #9fe6ff) drop-shadow(0 0 6px rgba(77,179,255,.8))', beam: 'drop-shadow(0 0 2px #eafcff) drop-shadow(0 0 11px #4db3ff)' };
// where the beam starts: between the open jaws (trace ≈ 72,112)
const mouth = [r1(GZ.x + 72 * GZ.s), r1(GZ.y + 112 * GZ.s)];

// ---------- Rainbow Bridge, crossing in front of Godzilla's legs ----------
const tw = (x) => `M${x - 2.4},292 V214 H${x + 2.4} V292 Z M${x - 3.6},220 H${x + 3.6} V223 H${x - 3.6} Z M${x - 3.6},236 H${x + 3.6} V238.6 H${x - 3.6} Z`;
const cable = 'M150,262 Q180,258 196,216 Q254,262 324,216 Q352,258 390,262';
out.bridge = svg(`<path d="M200,268 q40,-8 80,-2 q44,4 92,0 v8 h-172z" fill="${C.water}"/><path d="${tw(196)} ${tw(324)} M140,260 H390 V265 H140 Z" fill="#d9c7d6"/><path d="${cable}" stroke="#d9c7d6" stroke-width="1.1" fill="none"/>` +
  [...Array(26)].map((_, i) => `<circle cx="${144 + i * 9.6}" cy="262.5" r=".9" fill="#fff4dc"/>`).join(''));

// ---------- near shore skyline + Tokyo Tower (left) ----------
seed = 9;
const nearB = blocks(0, 170, 300, 10, 62, 9, 22).concat(blocks(356, W + 10, 300, 20, 70, 10, 20));
const nearD = nearB.map(([x, y, w, h]) => `M${x},300 V${y} H${r1(x + w)} V300 Z`).join(' ');
let nearWin = ''; seed = 12;
for (const [x, y, w] of nearB) for (let yy = y + 3; yy < 296; yy += 4) for (let xx = x + 1.5; xx < x + w - 2; xx += 3.2) if (rnd() < 0.22) nearWin += `M${r1(xx)},${r1(yy)}h1.6v1.8h-1.6z`;
// Tokyo Tower at x=112, top y=128: flared legs, two observation decks, antenna
const TT = 'M94,300 C104,262 108,212 110.4,176 L108.6,176 L108.6,172 L115.4,172 L115.4,176 L113.6,176 L112.8,146 L111,146 L111,143 L113,143 L112.4,128 L111.6,143 L113,143 L113,146 L111.2,146 L110.4,176 L113.6,176 C116,212 120,262 130,300 L124,300 C118,272 115,246 113.4,226 L110.6,226 C109,246 106,272 100,300 Z M104,262 H120 V265 H104 Z';
out.nearSkyline = svg(`<path d="${nearD}" fill="${C.near}"/><path d="M0,298 H186 V304 H0 Z M354,298 H390 V304 H354 Z" fill="#1a1020"/><path d="${nearWin}" fill="${C.nearWin}" opacity=".6"/><path d="${TT}" fill="${C.tower}"/><path d="M108.6,172 H115.4 V176 H108.6 Z M111,143 H113 V146 H111 Z" fill="${C.towerLit}"/>`);

// ---------- fires + smoke (glows are blurred in Figma / CSS) ----------
const fires = [[150, 232, 16], [182, 234, 10], [36, 290, 12], [376, 286, 14], [300, 233, 9]];
const smoke = [[150, 200, 26, 40], [176, 176, 34, 30], [120, 150, 44, 26], [36, 262, 16, 30], [60, 232, 26, 22], [372, 246, 20, 40], [350, 196, 34, 28]];
out.smoke = svg(smoke.map(([x, y, rx, ry]) => `<ellipse class="puff" style="transform-origin:${x}px ${y + ry}px" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.smoke}" opacity=".55"/>`).join(''));
out.fires = svg(fires.map(([x, y, r]) => `<g class="fire" style="transform-origin:${x}px ${y + r * 0.5}px"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.6}" fill="${C.fire}" opacity=".85"/><ellipse cx="${x}" cy="${y + 1}" rx="${r * 0.4}" ry="${r * 0.25}" fill="${C.fireCore}"/></g>`).join(''));

// ---------- rooftop, railing, lanterns ----------
const rail = [...Array(40)].map((_, i) => `M${i * 10 + 2},300 V318`).join(' ');
const lanternPts = [...Array(9)].map((_, i) => { const x = 20 + i * 44, t = (x - 195) / 195; return [x, r1(288 + 14 * (1 - t * t))]; });
out.rooftop = svg(
  `<rect y="318" width="${W}" height="102" fill="${C.roof}"/><rect y="316" width="${W}" height="8" fill="${C.parapet}"/>` +
  `<path d="${rail} M0,300 H${W}" stroke="${C.rail}" stroke-width="1.6" fill="none"/>` +
  // AC unit + water tank left, a potted pine right
  `<path d="M14,352 h54 v36 h-54z M18,388 v5 h6 v-5z M58,388 v5 h6 v-5z" fill="#2c2230"/><circle cx="41" cy="370" r="13" fill="#1a1219"/><path d="M34,370 h14 M41,363 v14" stroke="#3a2e3c" stroke-width="2"/>` +
  `<path d="M330,396 h30 l-4,20 h-22z" fill="#3a2a30"/><path d="M345,398 c-18,-6 -22,-20 -8,-24 c-10,-10 4,-20 10,-14 c6,-10 22,-2 14,8 c14,2 12,18 -4,20 c6,6 -4,12 -12,10z" fill="#1b2a24"/>` +
  // string lights: cord + lanterns, sagging across the frame
  `<path d="M0,286 ${lanternPts.map(([x, y]) => `L${x},${y}`).join(' ')} L${W},286" stroke="${C.cord}" stroke-width="1" fill="none"/>` +
  lanternPts.map(([x, y]) => `<g class="lantern" style="transform-origin:${x}px ${y}px"><path d="M${x},${y} v1.6" stroke="${C.cord}" stroke-width=".8"/><ellipse cx="${x}" cy="${y + 6}" rx="7" ry="6" fill="${C.lanternGlow}" opacity=".35"/><rect x="${x - 3.4}" y="${y + 1.5}" width="6.8" height="9" rx="3" fill="${C.lantern}"/></g>`).join(''));

// ---------- life: two news helicopters circling the kaiju, and the tower block that topples at the impact ----------
const heli = (id) => `<g class="heli ${id}"><path d="M-6,0 q0,-3 5,-3 h3 q4,0 4,3 q0,2.4 -4,2.4 h-5 q-3,0 -3,-2.4z M5,-.6 h9 v1.2 h-9z M-9,-4.6 h16" fill="#120d16" stroke="#120d16" stroke-width=".6"/><circle class="blink" cx="13.5" cy="0" r="1" fill="#ff4a3a"/><path class="searchlight" d="M0,2 L-14,46 L14,46 Z" fill="#fff5d0" opacity=".12"/></g>`;
out.helis = svg(heli('h1') + heli('h2'));
out.topple = svg(`<g class="topple" style="transform-origin:164px 234px"><path d="M158,234 V200 H170 V234 Z" fill="${C.far}"/><path d="M160,204h1.4v1.4h-1.4z M164,210h1.4v1.4h-1.4z M161,218h1.4v1.4h-1.4z M166,224h1.4v1.4h-1.4z" fill="${C.farWin}" opacity=".7"/></g>`);

// ---------- the spines' light on the water (the app raises its opacity with the charge) ----------
out.reflect = svg(`<ellipse cx="318" cy="292" rx="26" ry="42" fill="${C.plate}" opacity=".55"/><path d="M300,272 h36 M296,284 h44 M302,296 h32 M298,308 h40 M306,320 h26" stroke="#dff8ff" stroke-width="1.2"/>`);

// ---------- Paul, small, in a rowboat out on the bay — his v4 figure (with the rod) at 0.3 scale, back to the kaiju ----------
// Paul sits IN the boat: hips just below the gunwale (legs hidden by the hull), 0.2× the v4 figure
// the boat sits above the tab bar on Today, in open water under the bridge
const PK = 0.2, HULL = { l: 236, r: 266, rim: 312, keel: 320 }, CX = (HULL.l + HULL.r) / 2;
const paulFig = `<g transform="translate(${CX - 60 * PK} ${HULL.rim + 2 - 70 * PK}) scale(${PK})" fill="#0e0910"><path d="M64 33C70 35 74 40 74 48C74 56 75 64 75 70H45C44 78 42 87 42 94C42 97.5 40 99.5 36.5 99.5L29 101C26 101 25 98 27.5 96.5L34 95C33 86 32 78 33 71.5C33.5 64 36 59 42 58H50C52.5 56 52 50 54 44C56 38 58 35 60 33.5L64 33Z"/><path d="M59 34.5L68 33L65.5 27L57.5 30L59 34.5Z"/><path d="M61.7 33.4C65.8 32.8 68.6 28.6 67.9 24C67.3 19.3 63.4 16 59.3 16.6C55.2 17.2 52.4 21.4 53.1 26C53.7 30.7 57.6 34 61.7 33.4Z"/><path fill="none" stroke="#0e0910" stroke-width="5.5" stroke-linecap="round" d="M69 43C66 49 62 54 58 56.5C54 59 49 60.5 45 60.5"/></g>`;
// hand position in the scene, then a rod that reaches past the bow and a line into the water
const hand = [CX - 60 * PK + 47 * PK, HULL.rim + 2 - 70 * PK + 59 * PK], tip = [HULL.l - 9, HULL.rim - 9];
const rod = `<path d="M${r1(hand[0])},${r1(hand[1])} L${tip[0]},${tip[1]}" stroke="#0e0910" stroke-width=".9" stroke-linecap="round"/><path d="M${tip[0]},${tip[1]} Q${tip[0] - .6},${tip[1] + 8} ${tip[0] - .4},${HULL.keel}" stroke="#c8a6a0" stroke-opacity=".7" stroke-width=".4" fill="none"/>`;
const hull = (y0, y1) => `M${HULL.l},${y0} L${HULL.r},${y0} Q${HULL.r - 1.5},${y0 + (y1 - y0) * .75} ${HULL.r - 8},${y1} L${HULL.l + 7},${y1} Q${HULL.l + 1},${y0 + (y1 - y0) * .75} ${HULL.l},${y0} Z`;
out.boat = svg(`<g class="ripples"><ellipse cx="${CX}" cy="${HULL.keel}" rx="19" ry="2.2" fill="none" stroke="#c8a6a0" stroke-width=".6" opacity=".45"/><ellipse cx="${tip[0] - .4}" cy="${HULL.keel - .5}" rx="3" ry=".7" fill="none" stroke="#c8a6a0" stroke-width=".5" opacity=".5"/></g>` +
  `<path class="boat-reflect" style="transform-origin:${CX}px ${HULL.keel + 3}px" d="${hull(HULL.keel, HULL.keel + 6)}" fill="#4a2e24" opacity=".3"/>` +
  `<g class="boat" style="transform-origin:${CX}px ${HULL.rim + 4}px"><g clip-path="url(#inboat)">${paulFig}</g>${rod}<path d="${hull(HULL.rim, HULL.keel)}" fill="#4a2e24"/><path d="M${HULL.l},${HULL.rim} L${HULL.r},${HULL.rim}" stroke="#d9804a" stroke-width=".8"/><path d="M${HULL.r - 8},${HULL.rim + 2} L${HULL.r + 7},${HULL.keel - .5}" stroke="#6b4a36" stroke-width="1.1" stroke-linecap="round"/></g>`, `<clipPath id="inboat"><rect width="390" height="${HULL.rim + 3}"/></clipPath>`);

// ---------- lounge chair (retired: Paul moved to the bay) (Paul goes on it in Figma, same figure as the other places) ----------
out.chair = svg(`<path d="M196,380 L262,380 L290,352 L295,355 L268,386 L196,386 Z" fill="#b89478"/><path d="M204,386 v18 M258,386 v18 M284,362 l6,42" stroke="#6e5646" stroke-width="3"/>` +
  `<path d="M300,392 h14 v12 h-14z" fill="#3a2e3c"/><path d="M303,380 h7 l-1,12 h-5z" fill="#ffd9a0" opacity=".85"/>`);

// ---------- the beam (every ~50 s in the app) ----------
// Layers carry ids so Figma names them; blurs per id: beam-glow 10, beam-mid 2, mouth-flare 3,
// impact-fire 7, impact-flash 5, bay-light 8 (CSS: filter: blur() on the same groups).
const E = [146, 226]; // impact, on the far shore just right of Tokyo Tower
const bv = [E[0] - mouth[0], E[1] - mouth[1]], bl = Math.hypot(...bv), u = [bv[0] / bl, bv[1] / bl], nrm = [-u[1], u[0]];
const taper = (w0, w1, over = 0) => { const a = [mouth[0] - u[0] * 2, mouth[1] - u[1] * 2], b = [E[0] + u[0] * over, E[1] + u[1] * over];
  return `M${r1(a[0] + nrm[0] * w0)},${r1(a[1] + nrm[1] * w0)} L${r1(b[0] + nrm[0] * w1)},${r1(b[1] + nrm[1] * w1)} L${r1(b[0] - nrm[0] * w1)},${r1(b[1] - nrm[1] * w1)} L${r1(a[0] - nrm[0] * w0)},${r1(a[1] - nrm[1] * w0)} Z`; };
// energy rings pulsing down the beam
const rings = [0.18, 0.36, 0.54, 0.72, 0.88].map((t) => { const c = [mouth[0] + bv[0] * t, mouth[1] + bv[1] * t], w = 5 + t * 6;
  return `M${r1(c[0] + nrm[0] * w)},${r1(c[1] + nrm[1] * w)} Q${r1(c[0] + u[0] * 3)},${r1(c[1] + u[1] * 3)} ${r1(c[0] - nrm[0] * w)},${r1(c[1] - nrm[1] * w)}`; }).join(' ');
seed = 31;
const sparks = [...Array(22)].map(() => { const a = rnd() * Math.PI * 2, d = 10 + rnd() * 30; return `<circle cx="${r1(E[0] + Math.cos(a) * d * 1.3)}" cy="${r1(E[1] - Math.abs(Math.sin(a)) * d)}" r="${r1(0.6 + rnd() * 1.2)}"/>`; }).join('');
out.beam = svg(
  `<ellipse id="bay-light" cx="${E[0] + 6}" cy="${E[1] + 30}" rx="60" ry="14" fill="#6fd0ff" opacity=".45"/>` +
  `<path id="beam-glow" d="${taper(7, 18, 6)}" fill="#3d8fff" opacity=".55"/>` +
  `<path id="beam-mid" d="${taper(3.6, 8, 2)}" fill="#8fe4ff"/>` +
  `<path id="beam-rings" d="${rings}" stroke="#dff8ff" stroke-width="1.1" fill="none" opacity=".75"/>` +
  `<path id="beam-core" d="${taper(1.4, 3.2)}" fill="#ffffff"/>` +
  `<circle id="mouth-flare" cx="${mouth[0]}" cy="${mouth[1]}" r="7" fill="#dff8ff"/>` +
  `<ellipse id="impact-fire" cx="${E[0]}" cy="${E[1] - 6}" rx="34" ry="24" fill="#ff8a3a" opacity=".85"/>` +
  `<ellipse id="impact-flash" cx="${E[0]}" cy="${E[1] - 2}" rx="24" ry="14" fill="#bff2ff"/>` +
  `<ellipse id="impact-core" cx="${E[0]}" cy="${E[1]}" rx="11" ry="6" fill="#ffffff"/>` +
  `<g id="sparks" fill="#fff3d6">${sparks}</g>`);

fs.mkdirSync(D + 'parts', { recursive: true });
for (const [k, v] of Object.entries(out)) fs.writeFileSync(D + `parts/${k}.svg`, v);
fs.writeFileSync(D + 'parts/order.json', JSON.stringify({ route: FINS.route, order: ['sky', 'farSkyline', 'topple', 'smoke', 'helis', 'bay', 'bayGlints', 'reflect', 'godzilla', 'spines', 'fires', 'bridge', 'nearSkyline', 'boat'], beam: 'beam', mouth }, null, 1));
console.log(Object.entries(out).map(([k, v]) => `${k} ${v.length}`).join('\n'), '\nmouth', mouth);
