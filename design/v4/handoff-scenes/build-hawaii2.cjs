// Hawaiʻi, second pass: layered Nā Pali in haze, a lava point with surf spray, a voyaging canoe offshore,
// an outrigger and a surfboard on the sand, a plumeria, tiki torches after dusk; Nick and his cats against the palm.
const fs = require('fs'), path = require('path');
const { frond } = require('./palm.cjs');
const { palm } = require('./palmlib.cjs');
const nick = fs.readFileSync(path.join(__dirname, 'hawaii-nick.txt'), 'utf8');

const prof = 'M166,208 C176,196 184,180 190,170 L196,156 L202,160 L210,140 L216,146 L224,124 L232,132 L240,112 L248,122 L258,104 L266,116 L276,100 L286,112 L296,96 L306,108 L318,94 L328,108 L340,98 L352,110 L364,96 L376,106 L390,100';
const valleys = [[202, 160, 16], [216, 146, 18], [232, 132, 20], [248, 122, 20], [266, 116, 22], [286, 112, 22], [306, 108, 22], [328, 108, 22], [352, 110, 22], [376, 106, 20]];
const flutes = valleys.map(([x, y, w]) => `<path d="M${x},${y} C${x - 2},${y + 26} ${x - 5},${y + 60} ${x - w / 2},208 L${x + w / 2},208 C${x + 4},${y + 60} ${x + 2},${y + 26} ${x},${y} Z"></path>`).join('');
const peaks = [[196, 156], [210, 140], [224, 124], [240, 112], [258, 104], [276, 100], [296, 96], [318, 94], [340, 98], [364, 96]];
const lit = peaks.map(([x, y]) => `M${x},${y} C${x - 2},${y + 30} ${x - 1},${y + 70} ${x + 1},208`).join(' ');
const plumeria = (() => {
  const tips = [[30, 236], [52, 222], [8, 226], [70, 246], [40, 262]];
  let leaves = '', flowers = '';
  for (const [x, y] of tips) {
    for (let i = 0; i < 7; i++) { const a = -150 + i * 30 + (x % 7); leaves += `<ellipse cx="${x}" cy="${y}" rx="12" ry="3.4" transform="rotate(${a} ${x} ${y}) translate(10,0)"></ellipse>`; }
    for (const [dx, dy] of [[-3, -3], [3, -2], [0, 3]]) flowers += `<g transform="translate(${x + dx},${y + dy})"><circle r="2.4" cx="0" cy="-1.6"></circle><circle r="2.4" cx="1.6" cy="0"></circle><circle r="2.4" cx="0" cy="1.6"></circle><circle r="2.4" cx="-1.6" cy="0"></circle><circle r="1" fill="{{ c.plumCenter }}"></circle></g>`;
  }
  return `<path d="M18,350 C20,320 24,296 30,276 M30,276 C28,262 30,248 30,236 M30,276 C40,262 48,240 52,222 M26,290 C18,270 12,246 8,226 M30,276 C48,268 62,258 70,246 M28,284 C36,276 40,270 40,262" stroke="{{ c.plumBark }}" stroke-width="4" fill="none" stroke-linecap="round"></path>
<g class="h-plum"><g fill="{{ c.plumLeaf }}">${leaves}</g><g fill="{{ c.plumFlower }}">${flowers}</g></g>`;
})();
const torch = (x, y) => `<path d="M${x},${y} L${x},${y + 44}" stroke="{{ c.bamboo }}" stroke-width="2.4"></path><path d="M${x - 3},${y} L${x + 3},${y} L${x + 2},${y + 6} L${x - 2},${y + 6} Z" fill="{{ c.bamboo }}"></path>
<g opacity="{{ v.torches }}"><circle cx="${x}" cy="${y - 4}" r="18" fill="url(#h-lampglow)"></circle><g class="h-flame"><path d="M${x},${y - 12} C${x - 4},${y - 6} ${x - 3},${y - 1} ${x},${y} C${x + 3},${y - 1} ${x + 4},${y - 6} ${x},${y - 12} Z" fill="#F08A3A"></path><path d="M${x},${y - 8} C${x - 2},${y - 4} ${x - 1.4},${y - 1} ${x},${y} C${x + 1.4},${y - 1} ${x + 2},${y - 4} ${x},${y - 8} Z" fill="#FFD27A"></path></g></g>`;

const svg = `
<!-- sky, trade-wind clouds, sun or moon -->
<rect x="0" y="0" width="390" height="206" fill="url(#h-sky)"></rect>
<g opacity="{{ v.stars }}" fill="#E8EEF6"><circle class="h-star" cx="24" cy="36" r=".9"></circle><circle class="h-star s2" cx="70" cy="100" r=".7"></circle><circle class="h-star" cx="118" cy="28" r="1"></circle><circle class="h-star s3" cx="160" cy="80" r=".6"></circle><circle class="h-star s2" cx="210" cy="40" r=".8"></circle><circle class="h-star" cx="252" cy="70" r=".6"></circle><circle class="h-star s3" cx="300" cy="30" r=".9"></circle><circle class="h-star" cx="350" cy="60" r=".7"></circle><circle class="h-star s2" cx="14" cy="140" r=".6"></circle><circle class="h-star s3" cx="120" cy="150" r=".5"></circle></g>
<circle class="h-sunglow" cx="{{ v.sunX }}" cy="{{ v.sunY }}" r="{{ v.glowR }}" fill="url(#h-sunglow)"></circle>
<circle cx="{{ v.sunX }}" cy="{{ v.sunY }}" r="{{ v.sunR }}" fill="{{ c.sunCore }}"></circle>
<g class="h-cloud"><path d="M40,128 C46,118 60,118 66,112 C76,104 94,108 98,118 C110,116 118,122 116,130 L38,132 Z" fill="{{ c.cloud }}"></path><path d="M38,132 L116,130 C100,135 60,136 38,134 Z" fill="{{ c.cloudShade }}"></path></g>
<g class="h-cloud c2"><path d="M250,82 C258,70 276,72 282,64 C294,54 316,60 320,72 C334,70 344,78 340,88 L248,90 Z" fill="{{ c.cloud }}"></path><path d="M248,90 L340,88 C320,93 272,94 248,92 Z" fill="{{ c.cloudShade }}"></path></g>
<g class="h-koae" opacity="{{ v.birds }}"><use href="#f-tropicbird" x="160" y="140" width="24" height="10.6" fill="{{ c.koae }}"></use></g>

<!-- the sea; a voyaging canoe under crab-claw sails; a humpback -->
<rect x="0" y="202" width="390" height="120" fill="url(#h-sea)"></rect>
<g opacity="{{ v.waa }}" transform="translate(140,0)"><g class="h-waa">
<path d="M34,200 C44,203 70,203 82,199 L80,202 C68,205 46,205 36,203 Z M38,196 C48,199 70,199 80,195 L78,198 C66,201 48,201 40,199 Z" fill="{{ c.hull }}"></path>
<path d="M44,197 L44,200 M58,197 L58,201 M72,196 L72,200" stroke="{{ c.hull }}" stroke-width="1"></path>
<path d="M50,197 C44,186 44,176 48,168 C52,176 56,186 54,197 Z M66,197 C60,184 60,172 64,164 C68,172 72,184 70,197 Z" fill="{{ c.sail }}"></path>
</g></g>
<g opacity="{{ v.whale }}"><g class="h-whale"><use href="#f-humpback" x="104" y="196" width="32" height="8.5" fill="{{ c.whale }}"></use></g><ellipse class="h-spout" cx="112" cy="200" rx="3" ry="6" fill="{{ c.foam }}" opacity="0"></ellipse></g>
<g transform="translate({{ v.sunX }},0)" opacity="{{ v.glints }}" stroke="{{ c.glint }}" stroke-linecap="round">
<path class="h-gl" d="M-14,210 H14" stroke-width="2"></path><path class="h-gl g2" d="M-20,220 H8" stroke-width="1.8"></path><path class="h-gl g3" d="M-6,231 H22" stroke-width="1.6"></path><path class="h-gl" d="M-24,244 H2" stroke-width="1.4"></path>
</g>
<g class="h-wave" stroke="{{ c.foam }}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"><path d="M10,226 q10,-3 20,0 M70,240 q12,-3 24,0 M140,228 q9,-2 18,0 M40,262 q14,-4 28,0 M130,270 q16,-4 32,0 M220,262 q12,-3 24,0"></path></g>

<!-- Nā Pali: a far ridge in haze, then the fluted cliffs, mist, a waterfall, a rainbow in the morning -->
<path d="M206,210 L214,190 L222,194 L232,170 L244,176 L252,150 L208,154 L222,130 L236,138 L250,120 L264,128 L280,114 L296,120 L312,108 L330,116 L348,104 L366,112 L390,104 L390,210 Z" fill="{{ c.cliffFar }}"></path>
<g transform="translate(48,6)">
<path d="${prof} L390,208 Z" fill="url(#h-cliff)"></path>
<g fill="{{ c.flute }}" opacity=".85">${flutes}</g>
<path d="${lit}" stroke="{{ c.rim }}" stroke-width="1.1" fill="none" opacity=".45"></path>
<path d="${prof}" stroke="{{ c.rim }}" stroke-width="1.6" fill="none" stroke-linejoin="round" opacity=".7"></path>
<path class="h-fall" d="M268,118 C269,140 267,164 268,200" stroke="{{ c.fall }}" stroke-width="1.7" fill="none" stroke-linecap="round" opacity="{{ v.fall }}"></path>
<ellipse cx="268" cy="202" rx="7" ry="2.5" fill="{{ c.mist }}" opacity=".6" filter="url(#h-soft)"></ellipse>
</g>
<g class="h-mist" opacity="{{ v.mist }}"><ellipse cx="260" cy="168" rx="70" ry="7" fill="{{ c.mist }}" filter="url(#h-soft)"></ellipse><ellipse cx="350" cy="150" rx="50" ry="6" fill="{{ c.mist }}" filter="url(#h-soft)"></ellipse></g>
<g opacity="{{ v.rainbow }}" fill="none" stroke-width="3"><path d="M200,212 A74,74 0 0 1 348,212" stroke="#E88A7A"></path><path d="M203,212 A71,71 0 0 1 345,212" stroke="#F2D07A"></path><path d="M206,212 A68,68 0 0 1 342,212" stroke="#8ACB8A"></path><path d="M209,212 A65,65 0 0 1 339,212" stroke="#7AA8DA"></path></g>
<path d="M204,214 C240,208 290,210 390,208 L390,216 L204,218 Z" fill="{{ c.rock }}"></path>
<path class="h-surf" d="M204,216 C240,212 290,214 390,211" stroke="{{ c.foam }}" stroke-width="2" fill="none" opacity=".8"></path>

<!-- the beach -->
<path d="M0,300 C80,292 160,298 240,294 C310,291 350,296 390,292 L390,420 L0,420 Z" fill="url(#h-sand)"></path>
<path class="h-surf s2" d="M0,298 C80,290 160,296 240,292 C310,289 350,294 390,290" stroke="{{ c.foam }}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"></path>
<path class="h-surf s3" d="M0,291 C70,285 150,290 230,286 C300,283 350,288 390,284" stroke="{{ c.foam }}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".55"></path>

<!-- the lava point on the right, surf bursting on it -->
<path d="M316,314 L320,300 L328,293 L336,297 L343,287 L353,282 L361,289 L370,280 L381,285 L390,281 L390,316 Z" fill="{{ c.lava }}"></path>
<path d="M296,316 L300,306 L307,302 L313,306 L317,316 Z M352,316 L356,304 L364,300 L372,306 L376,316 Z" fill="{{ c.lavaLit }}" opacity=".55"></path>
<path d="M320,300 L328,293 L336,297 L343,287 L353,282 L361,289 L370,280 L381,285 L390,281" stroke="{{ c.lavaLit }}" stroke-width="1.4" fill="none" stroke-linejoin="round"></path>
<path d="M296,316 C320,312 360,313 390,314" stroke="{{ c.foam }}" stroke-width="2" fill="none" opacity=".8" class="h-surf s2"></path>
<g class="h-spray" fill="{{ c.foam }}"><circle cx="336" cy="284" r="6"></circle><circle cx="348" cy="276" r="8"></circle><circle cx="362" cy="274" r="7"></circle><circle cx="374" cy="278" r="6"></circle><circle cx="356" cy="264" r="5"></circle></g>

<!-- on the sand: the outrigger, a paddle, a surfboard, the honu, ʻakekeke, ʻōhiki after dark -->
<g opacity="{{ v.honu }}"><use href="#f-turtle" x="232" y="342" width="20" height="18.4" fill="{{ c.honu }}"></use></g>
<g opacity="{{ v.birds }}"><g class="h-akekeke"><use href="#f-turnstone" x="196" y="300" width="10" height="6.9" fill="{{ c.bird }}"></use></g><g class="h-akekeke k2"><use href="#f-turnstone" x="212" y="303" width="9" height="6.2" fill="{{ c.bird }}"></use></g></g>
<path d="M196,318 C210,316 250,316 262,314" stroke="{{ c.hullDark }}" stroke-width="3.4" stroke-linecap="round"></path>
<path d="M204,318 L208,328 M246,316 L248,328" stroke="{{ c.iako }}" stroke-width="1.8"></path>
<path d="M176,331 C196,338 260,338 292,327 L290,321 C260,330 200,330 178,325 Z" fill="{{ c.canoe }}"></path>
<path d="M178,326 C200,330 260,330 290,322" stroke="{{ c.canoeTrim }}" stroke-width="1.4" fill="none"></path>
<path d="M262,334 L286,300 M284,302 C288,296 292,296 290,302 Z" stroke="{{ c.iako }}" stroke-width="1.6" fill="{{ c.iako }}"></path>
<path d="M296,334 C294,312 296,292 302,278 C308,292 310,312 308,334 Z" fill="{{ c.board }}"></path>
<path d="M302,280 C300,298 301,316 302,334" stroke="{{ c.boardStripe }}" stroke-width="1.6" fill="none"></path>
<g opacity="{{ v.crab }}"><g class="h-crab"><use href="#f-crab" x="270" y="358" width="11" height="7.8" fill="{{ c.crab }}"></use></g></g>
<path d="M200,360 q2,-1 4,0 M320,370 q2,-1 4,0 M260,390 q2,-1 4,0" stroke="{{ c.sandDeep }}" stroke-width="1.2" fill="none"></path>

<!-- the plumeria framing the left, tiki torches -->
${plumeria}
${torch(60, 300)}
${torch(172, 296)}

<!-- the palm, Nick against it with his black Maine Coon and the little Somali -->
<ellipse cx="110" cy="344" rx="72" ry="7" fill="{{ c.shadow }}" opacity=".3"></ellipse>
PALM
${nick}
`;
const PAL = {
  morning: { page: '#F2E4DC', skyTop: '#E6E2EC', skyMid: '#F4DCD0', horizon: '#FAE4C4', sun: '#FFD28A', sunCore: '#FFE9BC', cloud: '#FAE6DC', cloudShade: '#E8C8C0', seaFar: '#6E9EB4', seaMid: '#7EC0C4', shallow: '#AEE0D4', hull: '#5A4A3E', sail: '#C88A62', whale: '#3E5666', foam: '#FFFBF4', glint: '#FFF1D2', cliffFar: '#A8BCB4', cliffTop: '#7EA878', cliffBase: '#4E7A5E', flute: '#3E6A52', rim: '#F2D6A0', fall: '#FFFFFF', mist: '#FFF6EE', rock: '#4E5A50', koae: '#FFFFFF', sandWet: '#D8C4A2', sand: '#F2E2C4', sandDeep: '#E6CFA8', lava: '#3A3634', lavaLit: '#6E6460', honu: '#5E6A4E', bird: '#5A4A3E', crab: '#E8DCC8', hullDark: '#5A4A3E', iako: '#8A6A48', canoe: '#B8583E', canoeTrim: '#F2D2A0', board: '#F4E8D0', boardStripe: '#3E88A8', plumBark: '#8A7E74', plumLeaf: '#4E8050', plumFlower: '#FFF8EE', plumCenter: '#F6C84E', bamboo: '#A8885A', shadow: '#7A6A58', trunk: '#8A6E58', trunkRing: '#6E5646', frond: '#4E7A52', frondBack: '#34604A', rib: '#9CC07E', dry: '#9A7A4E', coconut: '#6E5238', towel: '#F0D8C8', towelStripe: '#D07050', fig: '#2F3A3E', coon: '#252428', coonStripe: '#4E4C56', somali: '#B0703E' },
  day: { page: '#DCEFF2', skyTop: '#9CCFEA', skyMid: '#C4E4F2', horizon: '#EAF6F4', sun: '#FFFFFF', sunCore: '#FFFFFF', cloud: '#FFFFFF', cloudShade: '#DCE8F0', seaFar: '#1E7EA8', seaMid: '#30B4C0', shallow: '#98E2D2', hull: '#4A3A2E', sail: '#C07A52', whale: '#2A4656', foam: '#FFFFFF', glint: '#FFFFFF', cliffFar: '#9EC0B0', cliffTop: '#5CA466', cliffBase: '#2E6E48', flute: '#2A5E40', rim: '#B6E08E', fall: '#FFFFFF', mist: '#FFFFFF', rock: '#3E4A44', koae: '#FFFFFF', sandWet: '#DCC9A4', sand: '#F6E8CC', sandDeep: '#EAD5AE', lava: '#2E2A28', lavaLit: '#5E5652', honu: '#546048', bird: '#5A4636', crab: '#EDE2CE', hullDark: '#4A3A2E', iako: '#8A6A46', canoe: '#C4543A', canoeTrim: '#F6D8A4', board: '#FAF0DC', boardStripe: '#2E7EA8', plumBark: '#8E8278', plumLeaf: '#3E8048', plumFlower: '#FFFFFF', plumCenter: '#F8CC40', bamboo: '#B08E5C', shadow: '#8C7658', trunk: '#8E7058', trunkRing: '#705846', frond: '#3E7E4E', frondBack: '#2A5E40', rib: '#A6D08A', dry: '#A6844E', coconut: '#6A4E34', towel: '#F4E4D8', towelStripe: '#D8664A', fig: '#2C383C', coon: '#201F24', coonStripe: '#4A4952', somali: '#B8743E' },
  evening: { page: '#EDBFA2', skyTop: '#C890A8', skyMid: '#EEA286', horizon: '#FBC478', sun: '#FF8A48', sunCore: '#FFBC6E', cloud: '#E28E86', cloudShade: '#B26A76', seaFar: '#6E6A8A', seaMid: '#B8848A', shallow: '#E8B09A', hull: '#2E2228', sail: '#5A3A3A', whale: '#3A2E3E', foam: '#FFE6D2', glint: '#FFD29A', cliffFar: '#9A7E88', cliffTop: '#8A7A56', cliffBase: '#4A4048', flute: '#3E3440', rim: '#FFB078', fall: '#FFE0CC', mist: '#FFD8C4', rock: '#3A3036', koae: '#FFE6D6', sandWet: '#C99C84', sand: '#EEC6A6', sandDeep: '#DDAE8E', lava: '#2A2226', lavaLit: '#7A5A52', honu: '#4A3E38', bird: '#3E2E2A', crab: '#F2D6C4', hullDark: '#3A2A26', iako: '#5E4232', canoe: '#8E3E2E', canoeTrim: '#E0B08A', board: '#F0D6C4', boardStripe: '#4E5A7A', plumBark: '#5E524C', plumLeaf: '#3A3A30', plumFlower: '#F8DCD0', plumCenter: '#F0A860', bamboo: '#6E5440', shadow: '#6E4A40', trunk: '#5E4038', trunkRing: '#4A302A', frond: '#3A3A36', frondBack: '#2A2A2A', rib: '#6E5A48', dry: '#5E4432', coconut: '#3E2A24', towel: '#EFD0C0', towelStripe: '#B85A48', fig: '#271E24', coon: '#1F1719', coonStripe: '#4E3C40', somali: '#8E5634' },
  night: { page: '#0E1820', skyTop: '#0A131C', skyMid: '#12202E', horizon: '#1E3040', sun: '#DCE6EA', sunCore: '#E8EEF0', cloud: '#1A2833', cloudShade: '#131E28', seaFar: '#14283A', seaMid: '#183448', shallow: '#1E4450', hull: '#0A1014', sail: '#141A1E', whale: '#0A1218', foam: '#6A8A96', glint: '#C9D8DE', cliffFar: '#1A2A2A', cliffTop: '#16241E', cliffBase: '#0E1814', flute: '#0A1410', rim: '#2E4640', fall: '#8A9CA4', mist: '#3A4C58', rock: '#0C1210', koae: '#8A949A', sandWet: '#2A3034', sand: '#363C40', sandDeep: '#2C3236', lava: '#0A0C0E', lavaLit: '#22262A', honu: '#1A1E1C', bird: '#141816', crab: '#C8C4BA', hullDark: '#141414', iako: '#2A241E', canoe: '#3A1E1A', canoeTrim: '#5A4A40', board: '#4A4C50', boardStripe: '#2A3E4E', plumBark: '#26241E', plumLeaf: '#10181A', plumFlower: '#8A8C90', plumCenter: '#6E6040', bamboo: '#3A3026', shadow: '#0A0E12', trunk: '#1E1C1C', trunkRing: '#141212', frond: '#10181A', frondBack: '#0A1012', rib: '#1E2A2A', dry: '#16120E', coconut: '#141010', towel: '#4A4C50', towelStripe: '#5A3A36', fig: '#0B1014', coon: '#0E0E12', coonStripe: '#26282E', somali: '#3A2A20' },
};
const V = {
  morning: { sunX: 190, sunY: 170, sunR: 10, glowR: 70, stars: 0, glints: .7, rainbow: .35, whale: 1, fall: 1, mist: .8, birds: 1, honu: 1, crab: 0, torches: 0, waa: 1 },
  day: { sunX: 70, sunY: 96, sunR: 9, glowR: 56, stars: 0, glints: .6, rainbow: 0, whale: 1, fall: 1, mist: .5, birds: 1, honu: 1, crab: 0, torches: 0, waa: 1 },
  evening: { sunX: 204, sunY: 192, sunR: 15, glowR: 120, stars: 0, glints: 1, rainbow: 0, whale: .8, fall: .8, mist: .6, birds: 0, honu: 1, crab: 0, torches: 1, waa: 1 },
  night: { sunX: 150, sunY: 60, sunR: 9, glowR: 46, stars: 1, glints: .55, rainbow: 0, whale: 0, fall: .5, mist: .5, birds: 0, honu: 0, crab: 1, torches: 1, waa: 0 },
};
const body = svg.replace('PALM', palm({ cls: 'h-crown', base: [147, 342], top: [92, 192], c1: [146, 300], c2: [124, 240], w: 12, s: 1 }));
const defs = `<defs>
<!--FAUNA-->
${frond('p-frond', 1)}
${frond('p-frond2', 1.6)}
<linearGradient id="h-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{{ c.skyTop }}"></stop><stop offset=".55" stop-color="{{ c.skyMid }}"></stop><stop offset="1" stop-color="{{ c.horizon }}"></stop></linearGradient>
<linearGradient id="h-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{{ c.seaFar }}"></stop><stop offset=".55" stop-color="{{ c.seaMid }}"></stop><stop offset="1" stop-color="{{ c.shallow }}"></stop></linearGradient>
<linearGradient id="h-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{{ c.sandWet }}"></stop><stop offset=".2" stop-color="{{ c.sand }}"></stop><stop offset="1" stop-color="{{ c.sandDeep }}"></stop></linearGradient>
<linearGradient id="h-cliff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{{ c.cliffTop }}"></stop><stop offset="1" stop-color="{{ c.cliffBase }}"></stop></linearGradient>
<radialGradient id="h-sunglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{{ c.sun }}" stop-opacity=".75"></stop><stop offset=".35" stop-color="{{ c.sun }}" stop-opacity=".25"></stop><stop offset="1" stop-color="{{ c.sun }}" stop-opacity="0"></stop></radialGradient>
<radialGradient id="h-lampglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFC870" stop-opacity=".7"></stop><stop offset="1" stop-color="#FFB050" stop-opacity="0"></stop></radialGradient>
<filter id="h-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter>
</defs>`;
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Hawaii scene</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<style>body{margin:0}</style>
</helmet>
<div style="width: 390px; height: 420px; position: relative; overflow: hidden; background: {{ c.page }}">
<svg xmlns="http://www.w3.org/2000/svg" width="390" height="420" viewBox="0 0 390 420" style="display: block">
${defs}
${body}
</svg>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"sky":{"editor":"enum","options":["morning","day","evening","night"],"default":"day"},"$preview":{"width":390,"height":420}}'>
class Component extends DCLogic {
  renderVals() {
    const sky = this.props.sky || 'day';
    const P = ${JSON.stringify(PAL).replace(/"/g, "'")}[sky];
    const V = ${JSON.stringify(V).replace(/"/g, "'")}[sky];
    return { c: P, v: V };
  }
}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'project', 'HawaiiScene.dc.html'), page);
console.log('HawaiiScene written', page.length);
