#!/usr/bin/env node
// Florida dock, new look (Feeling 67): turns the approved Claude Design artboard (DockScene.dc.html, canvas
// "Feeling scenes · new look") into the app's scene.html + scene.css. Colours become CSS variables per sky,
// {{ v.* }} opacities become per-sky variables, the sun/moon rides on a translate.
//   node design/v4/handoff-dock5/convert.cjs <DockScene.dc.html> <anim.css>
const fs = require('fs'), path = require('path');
const here = __dirname;
const [, , dcFile, animFile] = process.argv;
let src = fs.readFileSync(dcFile, 'utf8');

// the palettes, straight from the artboard's renderVals
const logic = src.slice(src.indexOf('class Component'), src.lastIndexOf('</script>'));
const Comp = new Function('DCLogic', logic + '; return Component;')(class { constructor(p) { this.props = p || {}; } });
const skies = ['morning', 'day', 'evening', 'night'], vals = {};
for (const s of skies) vals[s] = new Comp({ sky: s }).renderVals();

let svg = src.slice(src.indexOf('<svg'), src.lastIndexOf('</svg>') + 6);
svg = svg.replace(/<defs>[\s\S]*?<!--FAUNA-->\n?/, '<defs>\n');                          // the app already has the fauna sprite
svg = svg.replace(/<symbol[\s\S]*?<\/symbol>\n?/g, '');
svg = svg.replace(/<!--[\s\S]*?-->/g, (m) => m);                                              // keep comments
svg = svg.replace(/ style="display: block"/, ' class="dk-layer"');

// the sun or moon: one group moved per sky
const sunA = svg.indexOf('<circle class="d-sunglow"'), sunB = svg.indexOf('<g class="d-clouds">');
svg = svg.slice(0, sunA) + `<g style="transform: translate(var(--dkv-sunX), var(--dkv-sunY))">
<g style="transform: scale(var(--dkv-glowR))"><circle class="d-sunglow" r="1" fill="url(#d-sunglow)"></circle></g>
<g style="transform: scale(var(--dkv-sunR))"><circle r="1" style="fill: var(--dk-sunCore)"></circle></g>
<g style="opacity: var(--dkv-stars)"><circle cx="-3" cy="-2" r="3" fill="#C9D3D8" opacity=".6"></circle><circle cx="3" cy="3" r="1.8" fill="#C9D3D8" opacity=".5"></circle></g>
</g>
` + svg.slice(sunB);
svg = svg.replace('<g transform="translate({{ v.sunX }},0)" opacity="{{ v.glints }}"', '<g style="transform: translateX(var(--dkv-sunX)); opacity: var(--dkv-glints)"');

// every other {{ hole }} becomes a style declaration on its element
svg = svg.replace(/<([a-zA-Z]+)((?:[^>"]|"[^"]*")*)>/g, (tag, name, attrs) => {
  const decl = [];
  attrs = attrs.replace(/\s([\w-]+)="\{\{\s*(c|v)\.(\w+)\s*\}\}"/g, (m, attr, kind, key) => {
    decl.push(`${attr}: var(--dk${kind === 'v' ? 'v' : ''}-${key})`); return '';
  });
  if (!decl.length) return tag;
  if (/\sstyle="/.test(attrs)) attrs = attrs.replace(/\sstyle="([^"]*)"/, (m, s) => ` style="${s.replace(/;?\s*$/, '')}; ${decl.join('; ')}"`);
  else attrs += ` style="${decl.join('; ')}"`;
  return `<${name}${attrs}>`;
});
if (/\{\{/.test(svg)) throw new Error('holes left: ' + svg.match(/.{40}\{\{.{30}/)[0]);
svg = svg.replace(/<(path|circle|rect|ellipse|use|stop)((?:[^>"]|"[^"]*")*)><\/\1>/g, '<$1$2/>');   // back to the app's short tags

// in the app the sky fades in from nothing, so the scene melts into the page sky above it
svg = svg.replace('<stop offset="0" style="stop-color: var(--dk-skyTop)"/>', '<stop offset="0" style="stop-color: var(--dk-skyTop); stop-opacity: 0"/>')
  .replace('<stop offset=".55" style="stop-color: var(--dk-skyMid)"/>', '<stop offset=".5" style="stop-color: var(--dk-skyMid); stop-opacity: .7"/>');

const html = `    <div class="waves dk5" aria-hidden="true"><div class="dk-scene" id="dk-scene">\n${svg}\n    </div></div>\n`;
fs.writeFileSync(path.join(here, 'scene.html'), html);

// css: variables per sky (night = html.night, which also covers a dark phone by day), then the motion
const skySel = { day: '.waves.dk5', morning: 'html[data-sky="morning"]:not(.night) .waves.dk5', evening: 'html[data-sky="evening"]:not(.night) .waves.dk5', night: 'html.night .waves.dk5' };
const unit = { sunX: 'px', sunY: 'px' };
let css = `  /* Florida dock, new look (Feeling 67). Approved on the Claude Design canvas "Feeling scenes · new look"; built by
     design/v4/handoff-dock5/convert.cjs from DockScene.dc.html. Colours per sky; html.night (after 22:00 or a dark phone) is the night palette. */
  .waves.dk5 { display: none; overflow: visible; }
  html[data-place="dock"] .waves:not(.dk5) { display: none; }
  html[data-place="dock"] .waves.dk5 { display: block; }
  html[data-place="dock"] .waves.dk5::after { display: none; }
  html[data-place="dock"] .orb { display: none; }   /* the scene has its own sun and moon */
  .dk5 .dk-scene { position: absolute; left: 0; bottom: 0; width: 390px; height: 420px; transform-origin: 0 100%; transform: scale(var(--dk-k, 1)); }
  .waves.dk5 svg.dk-layer { position: absolute; left: 0; top: 0; bottom: auto; width: 390px; height: 420px; overflow: visible; animation: none; }
`;
for (const s of ['day', 'morning', 'evening', 'night']) {
  const { c, v } = vals[s];
  const decl = Object.entries(c).filter(([k]) => k !== 'page').map(([k, x]) => `--dk-${k}:${x}`)
    .concat(Object.entries(v).filter(([k]) => !/^crater/.test(k)).map(([k, x]) => `--dkv-${k}:${x}${unit[k] || ''}`));
  css += `  ${skySel[s]} { ${decl.join('; ')}; }\n`;
}
const anim = fs.readFileSync(animFile, 'utf8').split('\n').filter((l) => l.trim() && !/^body\{/.test(l));
css += anim.map((l) => {
  if (/^@keyframes/.test(l.trim())) return '  ' + l;
  if (/^@media/.test(l)) return '  @media (prefers-reduced-motion: reduce) { .dk5 .dk-scene * { animation: none !important; } }';
  // scope every rule (and the rules sharing a line with a keyframes block) under .dk5
  return '  ' + l.replace(/(^|\})\s*([^@{}][^{}]*)\{/g, (m, brace, sel) => /^\s*(from|to|\d)/.test(sel) ? m : `${brace}${sel.split(',').map((x) => '.dk5 ' + x.trim()).join(',')}{`);
}).join('\n') + '\n';
css += `  /* sit mode: the water stays as it is; the lamp and the sun breathe a little slower */
  body.dock .dk5 .d-sunglow { animation-duration: 9.2s; }
`;
fs.writeFileSync(path.join(here, 'scene.css'), css);
console.log('scene.html', html.length, 'scene.css', css.length);
