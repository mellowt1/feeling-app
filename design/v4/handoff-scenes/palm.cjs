// A coconut palm frond: the rachis arches up and droops, leaflets hang from it like a curtain,
// longest in the middle. Prints a <symbol> for the scenes, pointing right; mirror it for the left side.
const B = (t, p0, p1, p2) => [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
function frond(id, droop = 1) {
  const p0 = [0, 0], p1 = [42, -16 * droop], p2 = [86, 22 * droop];
  const N = 22, top = [], bottom = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, [x, y] = B(t, p0, p1, p2);
    const [x2, y2] = B(Math.min(1, t + 0.01), p0, p1, p2);
    const ang = Math.atan2(y2 - y, x2 - x);
    const len = (4 + 20 * Math.sin(Math.PI * Math.min(1, t * 1.15))) * (t < 0.06 ? 0.3 : 1);   // longest in the middle
    const back = 0.55;                                                                            // leaflets sweep back towards the base
    const dx = Math.cos(ang + Math.PI / 2 + back), dy = Math.sin(ang + Math.PI / 2 + back);
    const ux = Math.cos(ang - Math.PI / 2 - back * 0.6), uy = Math.sin(ang - Math.PI / 2 - back * 0.6);
    bottom.push([x + dx * len, y + dy * len * 1.05], [x + dx * 1.2, y + dy * 1.2]);
    top.push([x + ux * len * 0.32, y + uy * len * 0.32], [x - ux * 0.6, y - uy * 0.6]);
  }
  const f = (p) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
  const shape = `M${f(top)} L${p2[0].toFixed(1)},${p2[1].toFixed(1)} L${f(bottom.reverse())} Z`;
  const rib = `M0,0 Q${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`;
  return `<symbol id="${id}" viewBox="-4 -26 96 60" overflow="visible"><path d="${shape}" stroke="none"></path><path d="${rib}" fill="none" stroke-width="1.1" opacity=".55" class="rib"></path></symbol>`;
}
module.exports = { frond };
if (require.main === module) console.log(frond('p-frond', 1) + '\n' + frond('p-frond2', 1.6));
