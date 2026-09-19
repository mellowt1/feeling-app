// Builds ../tokyo-scene.html: the Tokyo scene with all motion and sound, for review before it goes into index.html.
// Run build.mjs first. Serve the repo root over http (sounds are fetched from /sounds/tokyo-*.mp3).
import fs from 'fs';
import { fileURLToPath } from 'url';
const D = fileURLToPath(new URL('.', import.meta.url));
const ROUTE = JSON.parse(fs.readFileSync(D + 'parts/order.json', 'utf8')).route;
// the lit spines, revealed by two blurred strokes along the charge route: thin along the tail crest, wide up the back
const hotSpines = () => { const sv = part('spines'); const i = sv.indexOf('>') + 1;
  return sv.slice(0, i) + '<defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter><mask id="charge" maskUnits="userSpaceOnUse" x="0" y="0" width="390" height="420"><path id="rTail" stroke="#fff" stroke-width="20" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1" filter="url(#soft)"/><path id="rBack" stroke="#fff" stroke-width="46" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1" filter="url(#soft)"/></mask></defs><g mask="url(#charge)">' + sv.slice(i).replace('</svg>', '</g></svg>'); };
const part = (k) => fs.readFileSync(D + `parts/${k}.svg`, 'utf8').replace('<svg ', `<svg class="layer ${k}" `);
const L = (k) => part(k);


const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tokyo scene preview</title>
<style>
  :root { --ink:#f3e6d8; --dim:#b39c8c; }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; background:#120d14; color:var(--ink); font:15px/1.4 Inter,system-ui,sans-serif;
         display:flex; flex-direction:column; align-items:center; gap:14px; padding:16px; }
  .frame { width:min(100%, 520px); aspect-ratio:390/420; position:relative; overflow:hidden; border-radius:18px; }
  .scene { position:absolute; left:0; top:0; width:390px; height:420px; transform-origin:0 0; }
  .layer { position:absolute; inset:0; width:390px; height:420px; overflow:visible; }
  .bar { display:flex; gap:10px; align-items:center; flex-wrap:wrap; justify-content:center; }
  button.on { border-color:#9fe6ff; box-shadow:0 0 12px #4db3ff66; }
  button { font:inherit; color:var(--ink); background:#2a1f2c; border:1px solid #ffffff22; border-radius:12px; padding:10px 16px; cursor:pointer; }
  .state { color:var(--dim); min-width:12ch; text-align:center; }
  .start { position:absolute; inset:0; display:grid; place-items:center; background:#0008; font-size:17px; cursor:pointer; z-index:5; }

  /* ---- always-on life ---- */
  .smoke .puff { filter: blur(5px); animation: drift var(--d,14s) ease-in-out infinite alternate; }
  .smoke .puff:nth-child(2n) { --d: 17s; animation-delay: -6s; }
  .smoke .puff:nth-child(3n) { --d: 11s; animation-delay: -3s; }
  @keyframes drift { from { transform: translate(0,0) scale(1); opacity:.5 } to { transform: translate(-7px,-12px) scale(1.18); opacity:.85 } }
  .fires { filter: drop-shadow(0 0 5px #ff7a2a) drop-shadow(0 0 12px rgba(255,122,42,.55)); }
  .fire { animation: flicker .9s ease-in-out infinite alternate; }
  .fire:nth-child(2) { animation-duration: .7s; } .fire:nth-child(3) { animation-duration: 1.2s; } .fire:nth-child(4) { animation-duration: .8s; animation-delay:-.3s }
  @keyframes flicker { 0% { transform: scale(.9,.85); opacity:.75 } 40% { transform: scale(1.06,1.12); opacity:1 } 100% { transform: scale(.96,1.02); opacity:.85 } }
  .lantern { animation: swing 4s ease-in-out infinite alternate; }
  .lantern:nth-child(odd) { animation-duration: 4.6s; animation-delay: -1.4s; }
  @keyframes swing { from { transform: rotate(-5deg) } to { transform: rotate(5deg) } }
  .bayGlints path, .bay .waves { animation: shimmer 6s ease-in-out infinite alternate; }
  .bay .streak { filter: blur(3px); animation: flicker 1.1s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0; }
  .reflect-wrap { position:absolute; inset:0; opacity:0; filter: blur(6px); }
  /* Paul's boat: a slow rock and bob; rougher for a while after each blast (the wave reaches him) */
  .boat { animation: rock 5.5s ease-in-out infinite; }
  .boat-reflect { filter: blur(1.5px); animation: rock 5.5s ease-in-out infinite; }
  .rough .boat, .rough .boat-reflect { animation: rough 1.6s ease-in-out 3; }
  @keyframes rock { 0%,100% { transform: rotate(-2.5deg) translateY(0) } 50% { transform: rotate(2.5deg) translateY(1.2px) } }
  @keyframes rough { 0%,100% { transform: rotate(-6deg) translateY(-1px) } 50% { transform: rotate(6deg) translateY(2px) } }
  .ripples ellipse { transform-box: fill-box; transform-origin: 50% 50%; animation: ripple 3.2s ease-out infinite; }
  .ripples ellipse + ellipse { animation-delay: -1.6s; }
  @keyframes ripple { from { transform: scale(.7); opacity:.6 } to { transform: scale(1.35); opacity:0 } }
  @keyframes shimmer { from { transform: translateX(-4px); opacity:.7 } to { transform: translateX(5px); opacity:1 } }
  .kaiju { position:absolute; inset:0; transform-origin: 282px 266px; animation: sway 9s ease-in-out infinite alternate; }
  @keyframes sway { from { transform: rotate(-.7deg) } to { transform: rotate(.6deg) } }
  .paul-body { transform-box: fill-box; transform-origin: 50% 100%; animation: breathe 4.8s ease-in-out infinite; }
  @keyframes breathe { 0%,100% { transform: scaleY(1) } 45% { transform: scaleY(1.018) } }
  .heli { offset-rotate: 0deg; animation: fly 38s linear infinite; }
  .h1 { offset-path: path('M150,70 C230,30 360,40 380,100 C400,160 300,170 250,130 C200,90 90,110 150,70'); }
  .h2 { offset-path: path('M360,150 C300,120 250,40 170,60 C90,80 110,170 200,180 C290,190 400,190 360,150'); animation-duration: 46s; animation-delay: -20s; }
  @keyframes fly { to { offset-distance: 100% } }
  .blink { animation: blink 1.1s steps(1) infinite; } @keyframes blink { 50% { opacity: 0 } }
  .searchlight { filter: blur(2px); animation: sweep 5s ease-in-out infinite alternate; transform-origin: 0 2px; }
  @keyframes sweep { from { transform: rotate(-18deg) } to { transform: rotate(22deg) } }

  /* ---- the breath: JS drives these ---- */
  .spines { transition: none; }
  .spines-idle { opacity:.45; filter: drop-shadow(0 0 2px rgba(159,230,255,.6)) drop-shadow(0 0 8px rgba(77,179,255,.35)); animation: idle 5s ease-in-out infinite alternate; }
  @keyframes idle { from { opacity:.38 } to { opacity:.52 } }
  .hot { position:absolute; inset:0; opacity:0; }
  .hot .spines { -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat; }
  .beam-wrap { position:absolute; inset:0; opacity:0; }
  .beam #beam-glow { filter: blur(10px); } .beam #beam-mid { filter: blur(2px); } .beam #mouth-flare { filter: blur(3px); }
  .beam #impact-fire { filter: blur(7px); } .beam #impact-flash { filter: blur(5px); } .beam #bay-light { filter: blur(7px); }
  .beam .shoot { transform-origin: 213.1px 102.7px; }
  .beam #beam-rings { animation: rings .28s linear infinite; }
  @keyframes rings { from { transform: translate(0,0) } to { transform: translate(-10.4px,19.1px) } }
  .beam .impact { transform-box: fill-box; transform-origin: 50% 50%; }
  .skyglow { position:absolute; left:210px; top:40px; width:190px; height:250px; border-radius:50%; background: radial-gradient(closest-side, rgba(110,200,255,.55), rgba(64,140,255,.18) 60%, transparent); filter: blur(12px); opacity:0; }
  .beam-wrap.on { filter: drop-shadow(0 0 10px rgba(94,191,255,.9)) drop-shadow(0 0 26px rgba(64,140,255,.6)); }
  .rearer { position:absolute; inset:0; transform-origin: 282px 266px; transition: transform .8s cubic-bezier(.3,.7,.3,1); }
  .rearer.up { transform: rotate(-2.4deg) translateY(-2px); }
  .flash { position:absolute; inset:0; background:#9fe6ff; mix-blend-mode: screen; opacity:0; pointer-events:none; }
  .topple { transition: transform 2.6s cubic-bezier(.5,0,.9,.6), opacity 1s 2.2s; }
  .topple.down { transform: translateY(8px) rotate(-32deg); opacity:0; }
  @media (prefers-reduced-motion: reduce) { .scene * { animation: none !important; } }
</style></head>
<body>
<div class="frame" id="frame">
  <div class="scene" id="scene">
    ${L('sky')}${L('farSkyline')}${L('topple')}${L('smoke')}${L('helis')}${L('bay')}${L('bayGlints')}<div id="reflectWrap" class="reflect-wrap">${L('reflect')}</div>
    <div class="kaiju"><div class="rearer" id="rearer"><div class="skyglow" id="skyglow"></div>${L('godzilla')}
      <div class="spines-idle-wrap">${part('spines').replace('class="layer spines"', 'class="layer spines spines-idle"')}</div>
      <div class="hot" id="hot"><div id="hotMask" class="layer">${hotSpines()}</div></div>
      </div><div class="beam-wrap" id="beam">${L('beam').replace(/<path id="beam-(glow|mid|core)"/g, '<path class="shoot" id="beam-$1"').replace('<path id="beam-rings"', '<path class="shoot" id="beam-rings"').replace(/<ellipse id="impact-(fire|flash|core)"/g, '<ellipse class="impact" id="impact-$1"').replace('<g id="sparks"', '<g class="impact" id="sparks"')}</div>
    </div>
    ${L('fires')}${L('bridge')}${L('nearSkyline')}${L('boat')}
    <div class="flash" id="flash"></div>
  </div>
  <div class="start" id="start">Tap to start (sound on)</div>
</div>
<div class="bar"><button id="now">Breathe now</button><button id="roarNow">Roar now</button><span class="state" id="state">idle</span><button id="mute">Sound: on</button></div>
<div class="bar"><span class="state">Charge</span><button data-k="charge" data-i="0">1</button><button data-k="charge" data-i="1">2</button><span class="state">Breath</span><button data-k="breath" data-i="0">1</button><button data-k="breath" data-i="1">2</button></div>
<div class="bar"><span class="state" id="clips"></span></div>
<script>
const $ = (id) => document.getElementById(id);
const frame = $('frame'), scene = $('scene');
const fit = () => { const k = frame.clientWidth / 390; scene.style.transform = 'scale(' + k + ')'; };
addEventListener('resize', fit); fit();

// ---- timings (same as build.mjs BREATH; preview repeats faster) ----
const q = new URLSearchParams(location.search);
const T = { charge: 3500, mouth: 500, fire: 2000, fade: 2000, every: (+q.get('every') || 20) * 1000 }; // rest between breaths
const hot = $('hot'), hotMask = $('hotMask'), beam = $('beam'), flash = $('flash');
const shoot = [...beam.querySelectorAll('.shoot')], impact = [...beam.querySelectorAll('.impact')];
const flare = beam.querySelector('#mouth-flare'), bayLight = beam.querySelector('#bay-light');
const topple = document.querySelector('.topple'), sky = $('skyglow'), reflectWrap = $('reflectWrap');
// spine span on screen: tail tip y≈262 → head y≈80, as % from the bottom of the 420 frame
// split the route: tail part (first 25 points) and back part, each revealed in turn
const ROUTE = ${JSON.stringify(ROUTE)}; const RP = ROUTE.slice(1).split(' L');
const rTail = document.getElementById('rTail'), rBack = document.getElementById('rBack');
rTail.setAttribute('d', 'M' + RP.slice(0, 25).join(' L')); rBack.setAttribute('d', 'M' + RP.slice(24).join(' L'));
const FT = rTail.getTotalLength() / (rTail.getTotalLength() + rBack.getTotalLength());
const ease = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
let state = 'idle', t0 = 0, next = performance.now() + 4000, roarAt = 0;
const rearer = document.getElementById('rearer');
// the roar: once in each rest, 6–12 s after the fade, never within 5 s of the next charge
function planRoar(now) { const at = now + 6000 + Math.random() * 6000; roarAt = next - at > 5000 ? at : 0; }
function doRoar() { roarAt = 0; audio.roar(); rearer.classList.add('up'); setTimeout(() => rearer.classList.remove('up'), 2600); }

function setCharge(p, glow, alpha) {
  // soft leading edge ~5 % (≈20 px) climbing from the tail
  const q = p * 1.04, a = Math.min(1, q / FT), b = Math.max(0, Math.min(1, (q - FT) / (1 - FT)));
  rTail.setAttribute('stroke-dashoffset', (1 - a).toFixed(4)); rBack.setAttribute('stroke-dashoffset', (1 - b).toFixed(4));
  // progressive, wide glow: tight white rim, blue halo, then a broad soft bloom that grows with the charge
  hot.style.filter = 'drop-shadow(0 0 ' + (2 + 5 * glow) + 'px #eafcff) drop-shadow(0 0 ' + (6 + 26 * glow) + 'px rgba(94,191,255,.95)) drop-shadow(0 0 ' + (14 + 70 * glow) + 'px rgba(64,140,255,' + (.2 + .55 * glow) + '))';
  sky.style.opacity = (glow * .55).toFixed(3); reflectWrap.style.opacity = (Math.min(1, glow) * alpha * .8).toFixed(3);
  hot.style.opacity = alpha;
}
function show(el, o) { el.style.opacity = o; }

function frameLoop(now) {
  if (state === 'idle' && roarAt && now >= roarAt) doRoar();
  if (state === 'idle' && now >= next) { state = 'charge'; t0 = now; roarAt = 0; audio.charge(); }
  const t = now - t0;
  if (state === 'charge') {
    const p = Math.min(1, t / T.charge), e = ease(p);
    const crackle = .82 + .18 * Math.sin(now / 37) * Math.sin(now / 61);
    setCharge(e, e, crackle);
    const m = Math.max(0, (t - (T.charge - T.mouth)) / T.mouth);
    show(beam, m > 0 ? 1 : 0); shoot.forEach((s) => { s.style.opacity = 0; }); impact.forEach((s) => { s.style.opacity = 0; }); show(bayLight, 0);
    flare.style.opacity = Math.min(1, m); flare.style.transform = 'scale(' + (0.3 + m * 0.9) + ')'; flare.style.transformOrigin = '213.1px 102.7px';
    if (t >= T.charge) { state = 'fire'; t0 = now; audio.fire(); topple.classList.add('down'); beam.classList.add('on'); setTimeout(() => { scene.classList.add('rough'); setTimeout(() => scene.classList.remove('rough'), 4800); }, 1400); }
  } else if (state === 'fire') {
    const grow = Math.min(1, t / 240);
    setCharge(1, 1.3 + .15 * Math.sin(now / 45), 1);
    shoot.forEach((s) => { s.style.opacity = 1; s.style.transform = 'scale(' + grow + ')'; });
    const hit = Math.max(0, (t - 200) / 300);
    impact.forEach((s) => { s.style.opacity = Math.min(1, hit); s.style.transform = 'scale(' + (0.4 + Math.min(1, hit) * (0.8 + .15 * Math.sin(now / 50))) + ')'; });
    show(bayLight, Math.min(1, hit));
    beam.querySelector('#beam-core').style.opacity = .85 + .15 * Math.sin(now / 23);
    flash.style.opacity = Math.max(0, .22 - t / 1400);
    const sh = t < 700 ? (1 - t / 700) * 1.6 : 0; scene.style.translate = (Math.sin(now / 17) * sh).toFixed(2) + 'px ' + (Math.cos(now / 23) * sh).toFixed(2) + 'px';
    if (t >= T.fire) { state = 'fade'; t0 = now; scene.style.translate = ''; }
  } else if (state === 'fade') {
    const f = Math.min(1, t / T.fade);
    shoot.forEach((s) => { s.style.opacity = Math.max(0, 1 - t / 350); });
    impact.forEach((s) => { s.style.opacity = Math.max(0, 1 - t / 1600); });
    show(bayLight, Math.max(0, 1 - t / 1600)); flare.style.opacity = Math.max(0, 1 - t / 300);
    setCharge(1, 1.3 * (1 - f), 1 - ease(f));
    if (f >= 1) { state = 'idle'; show(beam, 0); beam.classList.remove('on'); next = now + T.every; planRoar(now); setTimeout(() => topple.classList.remove('down'), 4000); }
  }
  $('state').textContent = state === 'idle' ? 'next breath in ' + Math.max(0, Math.round((next - now) / 1000)) + ' s' : state;
  requestAnimationFrame(frameLoop);
}

${fs.readFileSync(D + 'breath-audio.js', 'utf8').replace(/`/g, '\`').replace(/${/g, '\${')}

const pick = () => { const i = audio.info(); document.querySelectorAll('[data-k]').forEach((b) => b.classList.toggle('on', i.sel[b.dataset.k] === +b.dataset.i));
  $('clips').textContent = 'charge ' + (i.charge[i.sel.charge] || '?') + ' s · breath ' + (i.breath[i.sel.breath] || '?') + ' s'; };
document.querySelectorAll('[data-k]').forEach((b) => b.onclick = () => { audio.select(b.dataset.k, +b.dataset.i); pick(); });
$('start').onclick = async () => { $('start').textContent = 'Loading sounds…'; await audio.init(); $('start').remove(); pick(); requestAnimationFrame(frameLoop); };
$('roarNow').onclick = () => { if (state === 'idle') doRoar(); };
$('now').onclick = () => { if (state === 'idle') next = performance.now(); };
$('mute').onclick = (e) => { e.target.textContent = 'Sound: ' + (audio.toggle() ? 'off' : 'on'); };
</script>
</body></html>`;
fs.writeFileSync(D + '../tokyo-scene.html', html);
console.log('wrote tokyo-scene.html', html.length);
