// Builds a self-contained living Hawaiʻi scene (no app) from the patched app copy: CSS rules the scene needs + markup + sprite.
import fs from 'fs';
const D = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const app = fs.readFileSync(D + '../app/index.html', 'utf8');
const css = app.slice(app.indexOf('<style>') + 7, app.indexOf('</style>')).replace(/\/\*[\s\S]*?\*\//g, '');
// split top-level css into blocks (rules, @keyframes, @media)
const blocks = []; let depth = 0, start = 0;
for (let i = 0; i < css.length; i++) { const c = css[i]; if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) { blocks.push(css.slice(start, i + 1).trim()); start = i + 1; } } }
const markup = fs.readFileSync(D + 'markup.html', 'utf8');
const used = new Set(['bob','drift','glint','glintDim','glitterDrift','catTail','earTwitch','frigateLoop','frigateTilt','kwWet','kwLap','kwLapNight','kwFoamNight','foam','crownSway','frondSway','crownLean','figBreath','twinkle']);
const keep = blocks.filter(b => {
  if (b.startsWith('@keyframes')) { const n = b.match(/@keyframes\s+([\w-]+)/)[1]; return used.has(n) || fs.readFileSync(D + 'style.css', 'utf8').includes('@keyframes ' + n); }
  if (b.startsWith('@media') || b.startsWith('@')) return false;
  const sel = b.slice(0, b.indexOf('{'));
  if (/hawaii/.test(sel)) return true;
  if (/^\s*(\.waves( |\.| svg| path|::after)|\.amb\b|\.night-only|html:not\(\.night\) \.day-only|html\.night \.night-only|html\[data-sky="evening"\]:not\(\.night\) \.dusk-only|html\[data-sky="evening"\] \.day-only|\.person|\.palm \.person-wrap|\.dock \.person-wrap|\.waves \.glitter|html\[data-sky="(morning|evening)"\] \.glitter|\.glitter span|html\[data-sky="evening"\] \.glitter span|html\.night \.glitter span)/.test(sel)) return !/campo|keywest|dock\b(?!.*person)|fish|mullet|boat|swell/.test(sel) || /person-wrap/.test(sel);
  return false;
});
let out = keep.join('\n').replace(/(^|[\s,}])html(?=[\[.:\s])/g, '$1.stage');
const sym = app.match(/<svg[^>]*>\s*(?:<defs>)?[\s\S]*?<symbol id="f-/)?.[0];
const spriteIds = ['f-tropicbird','f-humpback','f-turnstone','f-turtle','f-frigate','f-crab'];
const syms = spriteIds.map(id => { const i = app.indexOf(`<symbol id="${id}"`); return app.slice(i, app.indexOf("</symbol>", i) + 9); }).join('');
const stageCss = `
.stage { position: relative; width: 390px; height: 420px; overflow: hidden; background: linear-gradient(var(--sky-top), var(--sky-mid) 55%, var(--sky-horizon)); font-family: system-ui, sans-serif; }
.stage .waves { position: absolute !important; height: 300px !important; }
.stage .sun { position: absolute; left: 60%; top: 34px; width: 46px; height: 46px; border-radius: 50%; background: radial-gradient(circle, rgba(var(--orb-rgb),1) 45%, rgba(var(--orb-rgb),0) 70%); }
.stage[data-sky="morning"] .sun { left: 14%; top: 70px; }
.stage[data-sky="evening"] .sun { display: none; }
.stage .stars { display: none; } .stage.night .stars { display: block; }
.stage .stars i { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: #fff; opacity: .6; animation: twinkle 6s ease-in-out infinite; }
.stage .label { position: absolute; left: 16px; top: 14px; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink); opacity: .6; }`;
let stars = ''; let s = 3; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
for (let i = 0; i < 26; i++) stars += `<i style="left:${(r()*100).toFixed(1)}%;top:${(r()*34).toFixed(1)}%;animation-delay:-${(r()*6).toFixed(1)}s"></i>`;
const stage = (sky, label, extra='') => `<div class="stage${sky==='night'?' night':''}${extra}" data-place="hawaii" data-sky="${sky==='night'?'night':sky}"><div class="sun"></div><div class="stars">${stars}</div><div class="label">${label}</div>${markup.replace(/<svg class="palm"/, '<svg class="palm"')}</div>`;
fs.writeFileSync(D + 'scene.css', stageCss + '\n' + out);
fs.writeFileSync(D + 'sprite.html', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${syms}</defs></svg>`);
fs.writeFileSync(D + 'stage-fn.json', JSON.stringify({ stars, markup }));
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Hawaiʻi scene</title><style>body{margin:0;background:#ddd;display:flex;flex-wrap:wrap;gap:20px;padding:20px}${stageCss}\n${out}</style></head><body>${fs.readFileSync(D+'sprite.html','utf8')}
${stage('morning','Morning · whale season',' whales migrants')}${stage('day','Day',' migrants')}${stage('evening','Evening',' migrants')}${stage('night','Night')}</body></html>`;
fs.writeFileSync(D + 'hawaii-scene.html', page);
console.log('css', out.length, 'blocks', keep.length);
