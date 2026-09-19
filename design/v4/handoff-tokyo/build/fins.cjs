// Finds the inner (dorsal) edge of the curled tail on the traced silhouette and grows fins along it, from the
// base of the back spines to the tail tip. Also emits the CHARGE ROUTE (scene coords): tail tip → tail base →
// up the back spines → head, which the charge light follows. Output: parts/fins.json
const sharp = require(process.argv[2] + '/node_modules/sharp'), fs = require('fs');
const G = { x: 196, y: 76, s: 0.238 };
(async () => {
  const svg = fs.readFileSync('godzilla-side-trace.svg', 'utf8');
  const { data, info } = await sharp(Buffer.from(svg)).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const inside = (x, y) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= info.width || y >= info.height) return false; return data[y * info.width + x] > 128; };
  const C = [640, 560]; // the empty space enclosed by the curl
  const edge = [];
  for (let a = 100; a >= -125; a -= 1.5) {
    const r = a * Math.PI / 180, d = [Math.cos(r), Math.sin(r)];
    for (let k = 5; k < 260; k += .5) { const x = C[0] + d[0] * k, y = C[1] + d[1] * k; if (inside(x, y)) { edge.push([x, y, a]); break; } }
  }
  // keep the tail only: stop where the ray hits the back instead of the tail (big jump in distance)
  const pts = []; for (let i = 0; i < edge.length; i++) { if (i && Math.hypot(edge[i][0] - edge[i - 1][0], edge[i][1] - edge[i - 1][1]) > 30) break; pts.push(edge[i]); }
  // resample by arc length
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = L[L.length - 1], at = (s) => { let i = 1; while (i < L.length - 1 && L[i] < s) i++; const t = (s - L[i - 1]) / (L[i] - L[i - 1] || 1); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t]; };
  // a solid serrated crest: along the edge (rooted inside the tail), then back over tooth tips and valleys
  const r1 = (n) => Math.round(n * 10) / 10;
  const frame = (ss) => { const p = at(ss), q = at(Math.min(total, ss + 3)), o = at(Math.max(0, ss - 3)); const tg = [q[0] - o[0], q[1] - o[1]], tl = Math.hypot(...tg) || 1;
    const n = [C[0] - p[0], C[1] - p[1]], nl = Math.hypot(...n); return { p, tg: [tg[0] / tl, tg[1] / tl], n: [n[0] / nl, n[1] / nl] }; };
  const P = (f, a, b) => `${r1(f.p[0] + f.tg[0] * a + f.n[0] * b)},${r1(f.p[1] + f.tg[1] * a + f.n[1] * b)}`;
  const s0 = 4, s1 = total - 6, root = [], crest = [];
  for (let ss = s0; ss <= s1; ss += 4) root.push(P(frame(ss), 0, -6));
  let ss = s0, k = 0;
  while (ss < s1) {
    const u = ss / total, h = 34 - 24 * u, step = h * .55;           // tall at the base, small at the tip
    const f = frame(ss);
    crest.push(P(f, 0, 3));                                           // valley
    const mid = frame(Math.min(s1, ss + step * .55));
    crest.push(P(mid, step * .25, h * (k % 2 ? .78 : 1)));            // tooth tip, leaning toward the tail tip
    ss += step; k++;
  }
  crest.push(P(frame(s1), 0, 2));
  const fins = 'M' + root.join(' L') + ' L' + crest.reverse().join(' L') + ' Z';
  const scene = ([x, y]) => [r1(G.x + x * G.s), r1(G.y + y * G.s)];
  // route: tip → base along the fins (offset a little into the fins), then up the back plates to the head
  const route = [];
  for (let k = 0; k <= 24; k++) { const ss = total * (1 - k / 24), p = at(ss), n = [C[0] - p[0], C[1] - p[1]], nl = Math.hypot(...n); route.push(scene([p[0] + n[0] / nl * 10, p[1] + n[1] / nl * 10])); }
  for (const p of [[600, 660], [555, 590], [520, 520], [495, 450], [470, 380], [440, 310], [410, 250], [370, 195], [320, 150], [285, 125]]) route.push(scene(p));
  const routeD = 'M' + route.map((p) => p.join(',')).join(' L');
  fs.writeFileSync('parts/fins.json', JSON.stringify({ fins, route: routeD, tailLen: r1(total * G.s) }));
  console.log('tail edge pts', pts.length, 'tail length', r1(total), 'fins chars', fins.length, '\nroute', routeD.slice(0, 120));
})();
