#!/usr/bin/env node
// El campo, Key West and Hawaiʻi in the new look (Feeling 68). Approved on the Claude Design canvas
// "Feeling scenes · new look"; the artboards (<Place>Scene.dc.html) and their motion (<place>-anim.css) live here.
// For each place this turns the artboard into the app's markup + CSS (colours → per-sky CSS variables, the sun or
// moon on a translate, the sky fading in from nothing) and puts it into index.html between its own markers.
// The old scene of the place stays in the file but is hidden. Same approach as design/v4/handoff-dock5.
//   node design/v4/handoff-scenes/build.cjs
const fs = require('fs'), path = require('path');
const here = __dirname, INDEX = path.resolve(here, '../../../index.html');
const PLACES = [
  { place: 'campo', dc: 'CampoScene.dc.html', anim: 'campo-anim.css', p: 'c', v: 'cp', cls: 'cp5', after: 'dock5' },
  { place: 'keywest', dc: 'KeyWestScene.dc.html', anim: 'keywest-anim.css', p: 'k', v: 'kw', cls: 'kw5', after: 'cp5' },
  { place: 'hawaii', dc: 'HawaiiScene.dc.html', anim: 'hawaii-anim.css', p: 'h', v: 'hi', cls: 'hi5', after: 'kw5' },
];
const skySel = (cls) => ({ day: `.waves.${cls}`, morning: `html[data-sky="morning"]:not(.night) .waves.${cls}`, evening: `html[data-sky="evening"]:not(.night) .waves.${cls}`, night: `html.night .waves.${cls}` });

function convert({ place, dc, anim, p, v, cls }) {
  const src = fs.readFileSync(path.join(here, dc), 'utf8');
  const logic = src.slice(src.indexOf('class Component'), src.lastIndexOf('</script>'));
  const Comp = new Function('DCLogic', logic + '; return Component;')(class { constructor(q) { this.props = q || {}; } });
  const vals = {}; for (const s of ['morning', 'day', 'evening', 'night']) vals[s] = new Comp({ sky: s }).renderVals();

  let svg = src.slice(src.indexOf('<svg'), src.lastIndexOf('</svg>') + 6);
  svg = svg.replace('<!--FAUNA-->\n', '').replace(/<symbol id="f-[\s\S]*?<\/symbol>\n?/g, '');   // the app has the fauna sprite
  svg = svg.replace(/p-frond/g, `${p}-frond`).replace(' style="display: block"', ` class="${cls}-layer"`);
  // the sun or moon rides on one translate per sky; the moon gets its two craters
  const sun = new RegExp(`<circle class="${p}-sunglow"[^>]*></circle>\\s*<circle cx="\\{\\{ v\\.sunX \\}\\}"[^>]*></circle>`);
  if (!sun.test(svg)) throw new Error(place + ': sun not found');
  svg = svg.replace(sun, `<g style="transform: translate(var(--${v}v-sunX), var(--${v}v-sunY))">
<g style="transform: scale(var(--${v}v-glowR))"><circle class="${p}-sunglow" r="1" fill="url(#${p}-sunglow)"></circle></g>
<g style="transform: scale(var(--${v}v-sunR))"><circle r="1" style="fill: var(--${v}-sunCore)"></circle></g>
<g style="opacity: var(--${v}v-stars)"><circle cx="-3" cy="-2" r="3" fill="#C9D3D8" opacity=".6"></circle><circle cx="3" cy="3" r="1.8" fill="#C9D3D8" opacity=".5"></circle></g>
</g>`);
  svg = svg.replace('<g transform="translate({{ v.sunX }},0)" opacity="{{ v.glints }}"', `<g style="transform: translateX(var(--${v}v-sunX)); opacity: var(--${v}v-glints)"`);
  // every other {{ hole }} becomes a style declaration on its element
  svg = svg.replace(/<([a-zA-Z]+)((?:[^>"]|"[^"]*")*)>/g, (tag, name, attrs) => {
    const decl = [];
    attrs = attrs.replace(/\s([\w-]+)="\{\{\s*(c|v)\.(\w+)\s*\}\}"/g, (m, attr, kind, key) => { decl.push(`${attr}: var(--${v}${kind === 'v' ? 'v' : ''}-${key})`); return ''; });
    if (!decl.length) return tag;
    if (/\sstyle="/.test(attrs)) attrs = attrs.replace(/\sstyle="([^"]*)"/, (m, s) => ` style="${s.replace(/;?\s*$/, '')}; ${decl.join('; ')}"`);
    else attrs += ` style="${decl.join('; ')}"`;
    return `<${name}${attrs}>`;
  });
  if (/\{\{/.test(svg)) throw new Error(place + ': holes left: ' + svg.match(/.{60}\{\{.{30}/)[0]);
  svg = svg.replace(/<(path|circle|rect|ellipse|use|stop)((?:[^>"]|"[^"]*")*)><\/\1>/g, '<$1$2/>');
  // the sky melts into the page sky above the scene
  svg = svg.replace(`<stop offset="0" style="stop-color: var(--${v}-skyTop)"/>`, `<stop offset="0" style="stop-color: var(--${v}-skyTop); stop-opacity: 0"/>`)
    .replace(`<stop offset=".55" style="stop-color: var(--${v}-skyMid)"/>`, `<stop offset=".5" style="stop-color: var(--${v}-skyMid); stop-opacity: .7"/>`);
  const html = `    <div class="waves ${cls}" aria-hidden="true"><div class="${cls}-scene" id="${cls}-scene">\n${svg}\n    </div></div>\n`;

  const unit = { sunX: 'px', sunY: 'px' }, sel = skySel(cls);
  let css = `  /* ${place}, new look (Feeling 68): built by design/v4/handoff-scenes/build.cjs from ${dc}. Colours per sky; html.night is the night palette. */
  .waves.${cls} { display: none; overflow: visible; }
  html[data-place="${place}"] .waves:not(.${cls}) { display: none !important; }
  html[data-place="${place}"] .waves.${cls} { display: block !important; }
  html[data-place="${place}"] .waves.${cls}::after { display: none; }
  html[data-place="${place}"] .orb { display: none; }   /* the scene has its own sun and moon */
  .${cls} .${cls}-scene { position: absolute; left: 0; bottom: 0; width: 390px; height: 420px; transform-origin: 0 100%; transform: scale(var(--${cls}-k, 1)); }
  .waves.${cls} svg.${cls}-layer { position: absolute; left: 0; top: 0; bottom: auto; width: 390px; height: 420px; overflow: visible; animation: none; }
`;
  for (const s of ['day', 'morning', 'evening', 'night']) {
    const { c, v: vv } = vals[s];
    const decl = Object.entries(c).filter(([k]) => k !== 'page').map(([k, x]) => `--${v}-${k}:${x}`)
      .concat(Object.entries(vv).map(([k, x]) => `--${v}v-${k}:${x}${unit[k] || ''}`));
    css += `  ${sel[s]} { ${decl.join('; ')}; }\n`;
  }
  const lines = fs.readFileSync(path.join(here, anim), 'utf8').split('\n').filter((l) => l.trim() && !/^body\{/.test(l));
  css += lines.map((l) => {
    if (/^@keyframes/.test(l.trim())) return '  ' + l;
    if (/^@media/.test(l)) return `  @media (prefers-reduced-motion: reduce) { .${cls} .${cls}-scene * { animation: none !important; } }`;
    return '  ' + l.replace(/(^|\})\s*([^@{}][^{}]*)\{/g, (m, brace, s) => /^\s*(from|to|\d)/.test(s) ? m : `${brace}${s.split(',').map((x) => `.${cls} ` + x.trim()).join(',')}{`);
  }).join('\n') + '\n';
  const js = `<script>
(() => {
  // ${place}, new look (Feeling 68): fit the 390-wide scene to the screen
  const sc = document.getElementById('${cls}-scene');
  if (!sc) return;
  const fit = () => sc.style.setProperty('--${cls}-k', ((sc.parentElement.clientWidth || window.innerWidth) / 390).toFixed(4));
  window.addEventListener('resize', fit); document.addEventListener('placechange', fit); fit();
})();
</script>
`;
  return { html, css, js };
}

let s = fs.readFileSync(INDEX, 'utf8');
function put(open, close, after, body) {
  const block = open + '\n' + body + close;
  const a = s.indexOf(open);
  if (a >= 0) { const b = s.indexOf(close, a); s = s.slice(0, a) + block + s.slice(b + close.length); return; }
  const at = s.indexOf(after); if (at < 0) throw new Error('anchor missing: ' + after);
  const end = at + after.length;
  s = s.slice(0, end) + '\n' + block + s.slice(end);
}
for (const P of PLACES) {
  const { html, css, js } = convert(P);
  put(`  /* ${P.cls}:css */`, `  /* /${P.cls}:css */`, `  /* /${P.after}:css */`, css);
  put(`    <!-- ${P.cls}:scene -->`, `    <!-- /${P.cls}:scene -->`, `    <!-- /${P.after}:scene -->`, html);
  put(`<!-- ${P.cls}:js -->`, `<!-- /${P.cls}:js -->`, `<!-- /${P.after}:js -->`, js);
  console.log(P.place, 'in place');
}
fs.writeFileSync(INDEX, s);
