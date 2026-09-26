// palm() shared by the beach scenes (from palmpatch.cjs)
const Q = (t, a, b, c, d) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;
const CROWN = [[-58, 1, .62, 'p-frond', 'back'], [-58, -1, .6, 'p-frond', 'back'], [-18, 1, .95, 'p-frond', 'back'], [-22, -1, .9, 'p-frond', 'back'],
  [66, 1, .55, 'p-frond2', 'dry'],
  [8, 1, 1, 'p-frond2', 'front'], [10, -1, .98, 'p-frond2', 'front'], [-34, 1, .78, 'p-frond', 'front'], [-38, -1, .74, 'p-frond', 'front'], [40, 1, .7, 'p-frond2', 'front'], [44, -1, .66, 'p-frond2', 'front']];
const TONE = { back: 'fill="{{ c.frondBack }}" stroke="{{ c.frondBack }}"', front: 'fill="{{ c.frond }}" stroke="{{ c.rib }}"', dry: 'fill="{{ c.dry }}" stroke="{{ c.dry }}" opacity=".75"' };
// base: [x, y] of the trunk foot, top: [x, y] under the crown, bend: control offsets; w: foot width
function palm({ cls, base, top, c1, c2, w, s }) {
  const L = (t) => [Q(t, base[0] - w / 2, c1[0] - w * .35, c2[0] - 3, top[0] - 3), Q(t, base[1], c1[1], c2[1], top[1])];
  const R = (t) => [Q(t, base[0] + w / 2, c1[0] + w * .35, c2[0] + 3, top[0] + 3), Q(t, base[1], c1[1], c2[1], top[1])];
  const pt = ([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`;
  let left = '', right = '', shade = '', rings = '';
  for (let i = 0; i <= 24; i++) { const t = i / 24; left += (i ? ' L' : 'M') + pt(L(t)); right = ' L' + pt(R(t)) + right; }
  for (let i = 0; i <= 24; i++) { const t = i / 24, [lx, ly] = L(t), [rx, ry] = R(t); shade += (i ? ' L' : 'M') + pt([lx + (rx - lx) * .62, ly + (ry - ly) * .62]); }
  for (let i = 24; i >= 0; i--) shade += ' L' + pt(R(i / 24));
  for (let i = 1; i < 16; i++) { const t = i / 16, [lx, ly] = L(t), [rx, ry] = R(t); rings += `M${pt([lx, ly])} Q${pt([(lx + rx) / 2, (ly + ry) / 2 + 1.6])} ${pt([rx, ry])} `; }
  const foot = `M${pt(L(0))} C${pt([base[0] - w * .9, base[1] + 5])} ${pt([base[0] + w * .9, base[1] + 5])} ${pt(R(0))} Z`;
  const [cx, cy] = top;
  const fronds = CROWN.map(([a, m, k, id, tone]) => `<use href="#${id}" x="-4" y="-26" width="96" height="60" ${TONE[tone]} transform="translate(${cx},${cy}) scale(${+(m * s * k).toFixed(3)},${+(s * k).toFixed(3)}) rotate(${a})"></use>`).join('\n');
  return `<path d="${left}${right} Z" fill="{{ c.trunk }}"></path>
<path d="${shade} Z" fill="{{ c.trunkRing }}" opacity=".55"></path>
<path d="${foot}" fill="{{ c.trunk }}"></path>
<path d="${rings}" stroke="{{ c.trunkRing }}" stroke-width=".9" fill="none" opacity=".8"></path>
<g class="${cls}">
${fronds}
<circle cx="${cx - 3}" cy="${cy + 4}" r="${(3 * s / 1.25).toFixed(1)}" fill="{{ c.coconut }}"></circle><circle cx="${cx + 3}" cy="${cy + 5}" r="${(2.8 * s / 1.25).toFixed(1)}" fill="{{ c.coconut }}"></circle><circle cx="${cx}" cy="${cy + 8}" r="${(2.6 * s / 1.25).toFixed(1)}" fill="{{ c.coconut }}"></circle>
</g>`;
}
module.exports = { palm };
