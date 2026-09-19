// node app.mjs <index.html>   (run build.mjs first)
// Adds Paul's Tokyo place to the app. Idempotent: strips an earlier Tokyo insert first (markers tokyo:*).
// Everything in the scene is prefixed tk- (ids and classes) and scoped under .waves.tokyo, so nothing collides
// with the other places (see memory: a bare .gust once matched body.gust).
import fs from 'fs';
import { fileURLToPath } from 'url';
const D = fileURLToPath(new URL('.', import.meta.url));
const [, , file] = process.argv;
let s = fs.readFileSync(file, 'utf8');
const ROUTE = JSON.parse(fs.readFileSync(D + 'parts/order.json', 'utf8')).route;
const part = (k) => fs.readFileSync(D + `parts/${k}.svg`, 'utf8').replace('<svg ', `<svg class="layer ${k}" `);
const px = (h) => h
  .replace(/\bclass="([^"]+)"/g, (m, c) => `class="${c.trim().split(/\s+/).map((x) => 'tk-' + x).join(' ')}"`)
  .replace(/\bid="([^"]+)"/g, 'id="tk-$1"')
  .replace(/url\(#([^)]+)\)/g, 'url(#tk-$1)');

// ---------- markup ----------
// the page draws the dusk sky (theme vars below); the scene keeps only the warm glow over the horizon
const skyGlow = part('sky').replace(/<defs>[\s\S]*?<\/defs>/, '').replace(/<rect width="390" height="300"[^>]*\/>/, '');
const hotSpines = () => { const sv = part('spines'); const i = sv.indexOf('>') + 1;
  return sv.slice(0, i) + '<defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter><mask id="charge" maskUnits="userSpaceOnUse" x="0" y="0" width="390" height="420"><path id="rTail" stroke="#fff" stroke-width="20" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1" filter="url(#soft)"/><path id="rBack" stroke="#fff" stroke-width="46" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1" filter="url(#soft)"/></mask></defs><g mask="url(#charge)">' + sv.slice(i).replace('</svg>', '</g></svg>'); };
const beam = part('beam').replace(/<path id="beam-(glow|mid|core|rings)"/g, '<path class="shoot" id="beam-$1"')
  .replace(/<ellipse id="impact-(fire|flash|core)"/g, '<ellipse class="impact" id="impact-$1"').replace('<g id="sparks"', '<g class="impact" id="sparks"');
// the idle spines must not share ids with the hot copy
const idleSpines = part('spines').replace('class="layer spines"', 'class="layer spines spines-idle"').replace(/id="(sg|band)"/g, 'id="$1-idle"').replace(/url\(#(sg|band)\)/g, 'url(#$1-idle)');
const inner = skyGlow + part('farSkyline') + part('topple') + part('smoke') + part('helis') + part('bay') + part('bayGlints') +
  `<div id="reflectWrap" class="reflect-wrap">${part('reflect')}</div>` +
  `<div class="kaiju"><div class="rearer" id="rearer"><div class="skyglow" id="skyglow"></div>${part('godzilla')}<div class="spines-idle-wrap">${idleSpines}</div>` +
  `<div class="hot" id="hot"><div id="hotMask" class="layer">${hotSpines()}</div></div></div><div class="beam-wrap" id="beam">${beam}</div></div>` +
  part('fires') + part('bridge') + part('nearSkyline') + part('boat') + `<div class="flash" id="flash"></div>`;
const markup = `<div class="waves tokyo" aria-hidden="true"><div class="tk-scene" id="tk-scene">${px(inner)}</div></div>`;

// ---------- style ----------
const css = `
  /* Tokyo — Paul's own place (Feeling 52). Fixed dusk; Godzilla in the bay, Paul small in a rowboat. Design: Figma v9 (280:2639). */
  html[data-place="tokyo"][data-place][data-place][data-place] { color-scheme: dark; --sky-top:#1C1630; --sky-mid:#4B2447; --sky-horizon:#C05A3C; --bg:#241A2C; --card:#221A28; --glass:rgba(34,26,40,.55); --glass-strong:rgba(34,26,40,.8); --card-a:var(--glass); --glass-line:rgba(255,255,255,.14); --line:rgba(255,255,255,.09); --ink:#F2E6DC; --muted:#B8A3A6; --accent:#F29A5C; --accent-rgb:242,154,92; --accent-ink:#1C1630; --accent-soft:rgba(242,154,92,.16); --accent-40:rgba(242,154,92,.40); --orb:#F0934A; --orb-rgb:240,147,74; --scene-back:#3B2440; --scene-mid:#2C1A33; --scene-front:#1D1320; --scene-land:#1A1020; --water:#2C1A33; --range:#3B2440; --ground:#1D1320; --sand:#1A1020; --silhouette:#C9B4B8; --chip:rgba(255,255,255,.07); --track:rgba(255,255,255,.08); }
  .waves.tokyo { display: none; overflow: visible; }
  html[data-place="tokyo"] .waves:not(.tokyo) { display: none; }
  html[data-place="tokyo"] .waves.tokyo { display: block; }
  html[data-place="tokyo"] .waves.tokyo::after { display: none; }
  html[data-place="tokyo"] :is(.clouds, .nightsky, .orb, .bird, .wind) { display: none; }
  .tokyo .tk-scene { position: absolute; left: 0; bottom: 0; width: 390px; height: 420px; transform-origin: 0 100%; transform: scale(var(--tk-k, 1)); }
  .waves.tokyo svg.tk-layer { position: absolute; left: 0; top: 0; bottom: auto; width: 390px; height: 420px; overflow: visible; animation: none; }
  .tokyo .tk-layer { position: absolute; inset: 0; width: 390px; height: 420px; }
  /* always-on life */
  .tokyo .tk-puff { filter: blur(5px); animation: tkDrift 14s ease-in-out infinite alternate; }
  .tokyo .tk-puff:nth-child(2n) { animation-duration: 17s; animation-delay: -6s; }
  .tokyo .tk-puff:nth-child(3n) { animation-duration: 11s; animation-delay: -3s; }
  @keyframes tkDrift { from { transform: translate(0,0) scale(1); opacity: .5 } to { transform: translate(-7px,-12px) scale(1.18); opacity: .85 } }
  .tokyo .tk-fires { filter: drop-shadow(0 0 5px #FF7A2A) drop-shadow(0 0 12px rgba(255,122,42,.55)); }
  .tokyo .tk-fire { animation: tkFlicker .9s ease-in-out infinite alternate; }
  .tokyo .tk-fire:nth-child(2) { animation-duration: .7s; } .tokyo .tk-fire:nth-child(3) { animation-duration: 1.2s; } .tokyo .tk-fire:nth-child(4) { animation-duration: .8s; animation-delay: -.3s; }
  @keyframes tkFlicker { 0% { transform: scale(.9,.85); opacity: .75 } 40% { transform: scale(1.06,1.12); opacity: 1 } 100% { transform: scale(.96,1.02); opacity: .85 } }
  .tokyo .tk-bayGlints path, .tokyo .tk-bay .tk-waves { animation: tkShimmer 6s ease-in-out infinite alternate; }
  @keyframes tkShimmer { from { transform: translateX(-4px); opacity: .7 } to { transform: translateX(5px); opacity: 1 } }
  .tokyo .tk-bay .tk-streak { filter: blur(3px); animation: tkFlicker 1.1s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 0; }
  .tokyo .tk-reflect-wrap { position: absolute; inset: 0; opacity: 0; filter: blur(6px); }
  .tokyo .tk-boat { animation: tkRock 5.5s ease-in-out infinite; }
  .tokyo .tk-boat-reflect { filter: blur(1.5px); animation: tkRock 5.5s ease-in-out infinite; }
  .tokyo .tk-scene.tk-rough .tk-boat, .tokyo .tk-scene.tk-rough .tk-boat-reflect { animation: tkRough 1.6s ease-in-out 3; }
  @keyframes tkRock { 0%, 100% { transform: rotate(-2.5deg) translateY(0) } 50% { transform: rotate(2.5deg) translateY(1.2px) } }
  @keyframes tkRough { 0%, 100% { transform: rotate(-6deg) translateY(-1px) } 50% { transform: rotate(6deg) translateY(2px) } }
  .tokyo .tk-ripples ellipse { transform-box: fill-box; transform-origin: 50% 50%; animation: tkRipple 3.2s ease-out infinite; }
  .tokyo .tk-ripples ellipse + ellipse { animation-delay: -1.6s; }
  @keyframes tkRipple { from { transform: scale(.7); opacity: .6 } to { transform: scale(1.35); opacity: 0 } }
  .tokyo .tk-kaiju { position: absolute; inset: 0; transform-origin: 282px 266px; animation: tkSway 9s ease-in-out infinite alternate; }
  @keyframes tkSway { from { transform: rotate(-.7deg) } to { transform: rotate(.6deg) } }
  .tokyo .tk-rearer { position: absolute; inset: 0; transform-origin: 282px 266px; transition: transform .8s cubic-bezier(.3,.7,.3,1); }
  .tokyo .tk-rearer.tk-up { transform: rotate(-2.4deg) translateY(-2px); }
  .tokyo .tk-heli { offset-rotate: 0deg; animation: tkFly 38s linear infinite; }
  .tokyo .tk-h1 { offset-path: path('M150,70 C230,30 360,40 380,100 C400,160 300,170 250,130 C200,90 90,110 150,70'); }
  .tokyo .tk-h2 { offset-path: path('M360,150 C300,120 250,40 170,60 C90,80 110,170 200,180 C290,190 400,190 360,150'); animation-duration: 46s; animation-delay: -20s; }
  @keyframes tkFly { to { offset-distance: 100% } }
  .tokyo .tk-blink { animation: tkBlink 1.1s steps(1) infinite; } @keyframes tkBlink { 50% { opacity: 0 } }
  .tokyo .tk-searchlight { filter: blur(2px); animation: tkSweep 5s ease-in-out infinite alternate; transform-origin: 0 2px; }
  @keyframes tkSweep { from { transform: rotate(-18deg) } to { transform: rotate(22deg) } }
  /* the breath: the script drives these */
  .tokyo .tk-spines-idle { opacity: .45; filter: drop-shadow(0 0 2px rgba(159,230,255,.6)) drop-shadow(0 0 8px rgba(77,179,255,.35)); animation: tkIdle 5s ease-in-out infinite alternate; }
  @keyframes tkIdle { from { opacity: .38 } to { opacity: .52 } }
  .tokyo .tk-hot, .tokyo .tk-beam-wrap { position: absolute; inset: 0; opacity: 0; }
  .tokyo #tk-beam-glow { filter: blur(10px); } .tokyo #tk-beam-mid { filter: blur(2px); } .tokyo #tk-mouth-flare { filter: blur(3px); }
  .tokyo #tk-impact-fire { filter: blur(7px); } .tokyo #tk-impact-flash { filter: blur(5px); } .tokyo #tk-bay-light { filter: blur(7px); }
  .tokyo .tk-shoot { transform-origin: 213.1px 102.7px; }
  .tokyo #tk-beam-rings { animation: tkRings .28s linear infinite; }
  @keyframes tkRings { from { transform: translate(0,0) } to { transform: translate(-10.4px,19.1px) } }
  .tokyo .tk-impact { transform-box: fill-box; transform-origin: 50% 50%; }
  .tokyo .tk-skyglow { position: absolute; left: 210px; top: 40px; width: 190px; height: 250px; border-radius: 50%; background: radial-gradient(closest-side, rgba(110,200,255,.55), rgba(64,140,255,.18) 60%, transparent); filter: blur(12px); opacity: 0; }
  .tokyo .tk-beam-wrap.tk-on { filter: drop-shadow(0 0 10px rgba(94,191,255,.9)) drop-shadow(0 0 26px rgba(64,140,255,.6)); }
  .tokyo .tk-flash { position: absolute; inset: -40px; background: #9FE6FF; mix-blend-mode: screen; opacity: 0; }
  .tokyo .tk-topple { transition: transform 2.6s cubic-bezier(.5,0,.9,.6), opacity 1s 2.2s; }
  .tokyo .tk-topple.tk-down { transform: translateY(8px) rotate(-32deg); opacity: 0; }
  @media (prefers-reduced-motion: reduce) { .tokyo .tk-scene * { animation: none !important; transition: none !important; } }
`;

// ---------- engine ----------
const js = `
(() => {
  // Tokyo (Feeling 52): Godzilla's breath cycle. The picture runs whenever Tokyo is open; the sound only plays in the
  // sit mode, through the bowl engine's own context (TK.attach from buildSound), so its master fade covers it too.
  const root = document.documentElement, sc = document.getElementById('tk-scene');
  if (!sc) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById('tk-' + id);
  const fit = () => sc.style.setProperty('--tk-k', ((sc.parentElement.clientWidth || window.innerWidth) / 390).toFixed(4));
  window.addEventListener('resize', fit); fit();
  const T = { charge: 10400, mouth: 500, fire: 4700, fade: 2000, rest: 20000 };
  const hot = $('hot'), beam = $('beam'), flash = $('flash'), sky = $('skyglow'), refl = $('reflectWrap'), rearer = $('rearer');
  const shoot = [...beam.querySelectorAll('.tk-shoot')], impact = [...beam.querySelectorAll('.tk-impact')];
  const flare = $('mouth-flare'), bayLight = $('bay-light'), core = $('beam-core'), topple = sc.querySelector('.tk-topple');
  const RP = ${JSON.stringify(ROUTE)}.slice(1).split(' L'), rTail = $('rTail'), rBack = $('rBack');
  rTail.setAttribute('d', 'M' + RP.slice(0, 25).join(' L')); rBack.setAttribute('d', 'M' + RP.slice(24).join(' L'));
  let FT = .3; try { FT = rTail.getTotalLength() / (rTail.getTotalLength() + rBack.getTotalLength()); } catch (e) {}
  const ease = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  let state = 'idle', t0 = 0, next = 0, roarAt = 0, raf = 0;
  function setCharge(p, glow, alpha) {
    const q = p * 1.04, a = Math.min(1, q / FT), b = Math.max(0, Math.min(1, (q - FT) / (1 - FT)));
    rTail.setAttribute('stroke-dashoffset', (1 - a).toFixed(4)); rBack.setAttribute('stroke-dashoffset', (1 - b).toFixed(4));
    hot.style.filter = 'drop-shadow(0 0 ' + (2 + 5 * glow) + 'px #eafcff) drop-shadow(0 0 ' + (6 + 26 * glow) + 'px rgba(94,191,255,.95)) drop-shadow(0 0 ' + (14 + 70 * glow) + 'px rgba(64,140,255,' + (.2 + .55 * glow) + '))';
    sky.style.opacity = (glow * .55).toFixed(3); refl.style.opacity = (Math.min(1, glow) * alpha * .8).toFixed(3); hot.style.opacity = alpha;
  }
  function reset(now) {
    state = 'idle'; next = now + 6000; roarAt = 0; setCharge(0, 0, 0); hot.style.filter = '';
    beam.style.opacity = 0; beam.classList.remove('tk-on'); flash.style.opacity = 0; sc.style.translate = '';
    topple.classList.remove('tk-down'); rearer.classList.remove('tk-up');
  }
  function planRoar(now) { const at = now + 6000 + Math.random() * 6000; roarAt = next - at > 5000 ? at : 0; }
  function doRoar() { roarAt = 0; A.roar(); rearer.classList.add('tk-up'); setTimeout(() => rearer.classList.remove('tk-up'), 2600); }
  const on = () => root.getAttribute('data-place') === 'tokyo' && !document.hidden && !reduce;
  function loop(now) {
    raf = 0;
    if (!on()) return;
    if (state === 'idle' && roarAt && now >= roarAt) doRoar();
    if (state === 'idle' && now >= next) { state = 'charge'; t0 = now; roarAt = 0; A.charge(); }
    const t = now - t0;
    if (state === 'charge') {
      const e = ease(Math.min(1, t / T.charge)), crackle = .82 + .18 * Math.sin(now / 37) * Math.sin(now / 61);
      setCharge(e, e, crackle);
      const m = Math.max(0, (t - (T.charge - T.mouth)) / T.mouth);
      beam.style.opacity = m > 0 ? 1 : 0; shoot.forEach((x) => { x.style.opacity = 0; }); impact.forEach((x) => { x.style.opacity = 0; }); bayLight.style.opacity = 0;
      flare.style.opacity = Math.min(1, m); flare.style.transformOrigin = '213.1px 102.7px'; flare.style.transform = 'scale(' + (.3 + m * .9) + ')';
      if (t >= T.charge) {
        state = 'fire'; t0 = now; A.fire(); topple.classList.add('tk-down'); beam.classList.add('tk-on');
        setTimeout(() => { sc.classList.add('tk-rough'); setTimeout(() => sc.classList.remove('tk-rough'), 4800); }, 1400);
      }
    } else if (state === 'fire') {
      setCharge(1, 1.3 + .15 * Math.sin(now / 45), 1);
      const grow = Math.min(1, t / 240), hit = Math.min(1, Math.max(0, (t - 200) / 300));
      shoot.forEach((x) => { x.style.opacity = 1; x.style.transform = 'scale(' + grow + ')'; });
      impact.forEach((x) => { x.style.opacity = hit; x.style.transform = 'scale(' + (.4 + hit * (.8 + .15 * Math.sin(now / 50))) + ')'; });
      bayLight.style.opacity = hit; core.style.opacity = .85 + .15 * Math.sin(now / 23);
      flash.style.opacity = Math.max(0, .22 - t / 1400);
      const sh = t < 700 ? (1 - t / 700) * 1.6 : 0; sc.style.translate = (Math.sin(now / 17) * sh).toFixed(2) + 'px ' + (Math.cos(now / 23) * sh).toFixed(2) + 'px';
      if (t >= T.fire) { state = 'fade'; t0 = now; sc.style.translate = ''; }
    } else if (state === 'fade') {
      const f = Math.min(1, t / T.fade);
      shoot.forEach((x) => { x.style.opacity = Math.max(0, 1 - t / 350); });
      impact.forEach((x) => { x.style.opacity = Math.max(0, 1 - t / 1600); });
      bayLight.style.opacity = Math.max(0, 1 - t / 1600); flare.style.opacity = Math.max(0, 1 - t / 300);
      setCharge(1, 1.3 * (1 - f), 1 - ease(f));
      if (f >= 1) { state = 'idle'; beam.style.opacity = 0; beam.classList.remove('tk-on'); next = now + T.rest; planRoar(now); setTimeout(() => topple.classList.remove('tk-down'), 4000); }
    }
    raf = requestAnimationFrame(loop);
  }
  function wake() { fit(); if (!raf && on()) { reset(performance.now()); raf = requestAnimationFrame(loop); } }
  document.addEventListener('placechange', wake); document.addEventListener('visibilitychange', wake);

  // ---------- sound: Paul's clips, all far across the bay, plus a quiet bed (his breathing, water at the boat, the city) ----------
  const A = (() => {
    let ctx = null, out, verb, farHall, noiseBuf, amb, ambTimer, bufs = {}, nextLap = 0, nextStep = 0, nextBreath = 0;
    const R = (a, b) => a + Math.random() * (b - a);
    const live = () => ctx && ctx.state === 'running';
    const impulse = (secs, decay) => { const len = ctx.sampleRate * secs, b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); } return b; };
    const noise = (t, dur) => { const n = ctx.createBufferSource(); n.buffer = noiseBuf; n.loop = true; n.start(t, Math.random() * 2); n.stop(t + dur); return n; };
    const env = (g, pts) => { g.gain.setValueAtTime(pts[0][1], pts[0][0]); for (const [t, v] of pts.slice(1)) g.gain.linearRampToValueAtTime(v, t); };
    const bus = (to, dry, wet) => { const g = ctx.createGain(), d = ctx.createGain(), w = ctx.createGain(); d.gain.value = dry; w.gain.value = wet; g.connect(d).connect(to); g.connect(w).connect(verb); return g; };
    const active = (b) => { const d = b.getChannelData(0); let i = d.length - 1; while (i > 0 && Math.abs(d[i]) < .01) i--; return i / b.sampleRate; };
    function attach(c, dest) {
      detach(); ctx = c;
      const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -10; lim.ratio.value = 12; lim.attack.value = .003; lim.release.value = .2;
      const lift = ctx.createGain(); lift.gain.value = 3.5;                     // the bowl master rests at .28; ×3.5 brings Godzilla back to the preview's levels
      out = ctx.createGain(); out.gain.value = .6; out.connect(lim).connect(lift).connect(dest);
      const conv = ctx.createConvolver(); conv.buffer = impulse(2.8, 2.4); verb = ctx.createGain(); verb.gain.value = .45; verb.connect(conv).connect(out);
      const fc = ctx.createConvolver(); fc.buffer = impulse(5.5, 1.8); farHall = ctx.createGain(); farHall.gain.value = .9; farHall.connect(fc).connect(out);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const nd = noiseBuf.getChannelData(0); let pink = 0; for (let i = 0; i < nd.length; i++) { const w = Math.random() * 2 - 1; pink = .97 * pink + .03 * w; nd[i] = w * .6 + pink * 3; }
      const mine = ctx;
      for (const k of ['charge', 'breath', 'roar']) fetch('sounds/tokyo-' + k + '.mp3').then((r) => r.arrayBuffer()).then((a) => mine.decodeAudioData(a)).then((b) => {
        if (ctx !== mine) return; bufs[k] = b;
        if (k === 'charge') T.charge = active(b) * 1000; if (k === 'breath') T.fire = Math.min(active(b), 7) * 1000;
      }).catch(() => {});
      startBed();
    }
    function detach() { clearInterval(ambTimer); ctx = null; bufs = {}; }
    function far(src, t, o) {
      const hp = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter(), g = ctx.createGain(), send = ctx.createGain();
      hp.type = 'highpass'; hp.frequency.value = 110; lp.type = 'lowpass'; lp.frequency.value = o.lpf || 1100;
      g.gain.value = .28 * (o.gain || 1); send.gain.value = 2.4;
      if (o.dur) { g.gain.setValueAtTime(.28 * (o.gain || 1), t + o.dur - 1); g.gain.linearRampToValueAtTime(0, t + o.dur); }
      src.connect(hp).connect(lp).connect(g).connect(out); g.connect(send).connect(verb); g.connect(farHall);
      for (const [time, fbk, wetv] of [[.45, .55, .5], [.82, .45, .4], [1.3, .35, .3]]) {
        const dl = ctx.createDelay(2), fb = ctx.createGain(), dark = ctx.createBiquadFilter(), wet = ctx.createGain();
        dl.delayTime.value = time; fb.gain.value = fbk; dark.type = 'lowpass'; dark.frequency.value = 900; wet.gain.value = wetv;
        g.connect(dl); dl.connect(dark).connect(fb).connect(dl); dark.connect(wet).connect(out); wet.connect(verb);
      }
    }
    function clip(k, t, o) { const b = bufs[k]; if (!b) return; const s = ctx.createBufferSource(); s.buffer = b; far(s, t, o); s.start(t); if (o.dur) s.stop(t + o.dur + .05); }
    function roar(t, level) { if (!live()) return; clip('roar', t === undefined ? ctx.currentTime : t, { gain: level || 1 }); }
    function charge() { if (!live()) return; clip('charge', ctx.currentTime, { gain: 1.45, lpf: 1200 }); }
    function fire() {
      if (!live()) return;
      const t = ctx.currentTime, b = bufs.breath, dur = T.fire / 1000 + .6;
      clip('breath', t, { gain: 1.5, lpf: 1500, dur: b && dur < b.duration ? dur : 0 });
      boom(t + .35); duck(T.fire / 1000 + 1); roar(t + .15, .45);
    }
    function boom(t) {
      const o = bus(out, .9, 1), n = noise(t, 2.2), lp = ctx.createBiquadFilter(), g = ctx.createGain(), s = ctx.createOscillator(), sg = ctx.createGain();
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(90, t + 1.8);
      env(g, [[t, 0], [t + .02, .35], [t + 1.8, 0]]); n.connect(lp).connect(g).connect(o);
      s.frequency.setValueAtTime(95, t); s.frequency.exponentialRampToValueAtTime(28, t + 1.2);
      env(sg, [[t, 0], [t + .02, .3], [t + 1.3, 0]]); s.connect(sg).connect(o); s.start(t); s.stop(t + 1.4);
    }
    function duck(secs) { const t = ctx.currentTime; amb.gain.cancelScheduledValues(t); amb.gain.setValueAtTime(amb.gain.value, t);
      amb.gain.linearRampToValueAtTime(.45, t + .3); amb.gain.setValueAtTime(.45, t + secs); amb.gain.linearRampToValueAtTime(1, t + secs + 2); }
    function startBed() {
      amb = ctx.createGain(); amb.connect(out);
      const t0 = ctx.currentTime;
      const rn = noise(t0, 1e6), rlp = ctx.createBiquadFilter(), rg = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      rlp.type = 'lowpass'; rlp.frequency.value = 110; rg.gain.value = .22; lfo.frequency.value = .045; lg.gain.value = .08;
      lfo.connect(lg).connect(rg.gain); lfo.start(); rn.connect(rlp).connect(rg).connect(bus(amb, 1, .4));
      const bo = ctx.createOscillator(), bg = ctx.createGain(); bo.frequency.value = 41; bg.gain.value = 0; bo.connect(bg).connect(bus(amb, 1, .5)); bo.start();
      const hn = noise(t0, 1e6), hlp = ctx.createBiquadFilter(), hg = ctx.createGain(); hlp.type = 'lowpass'; hlp.frequency.value = 260; hg.gain.value = 0; hn.connect(hlp).connect(hg).connect(bus(amb, 1, .6));
      nextLap = t0 + .5; nextStep = t0 + R(3, 6); nextBreath = t0 + .2;
      const mine = ctx;
      ambTimer = setInterval(() => {
        if (ctx !== mine || !live()) return;
        const now = ctx.currentTime, until = now + 1;
        while (nextBreath < until) { const t = nextBreath, inh = R(2.2, 2.8), exh = R(3.2, 4);
          bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(.16, t + inh); bg.gain.linearRampToValueAtTime(.05, t + inh + exh);
          hg.gain.setValueAtTime(0, t + inh); hg.gain.linearRampToValueAtTime(.09, t + inh + .5); hg.gain.linearRampToValueAtTime(0, t + inh + exh);
          nextBreath = t + inh + exh + R(.3, 1.2); }
        while (nextLap < until) { lap(nextLap); nextLap += R(1, 2.1); }
        while (nextStep < until) { step(nextStep); nextStep += R(8, 11); }
        for (let k = 0; k < 3; k++) if (Math.random() < .5) crackle(now + .25 + Math.random() * .25);
      }, 250);
    }
    function lap(t) { const n = noise(t, 1.4), bp = ctx.createBiquadFilter(), g = ctx.createGain(); bp.type = 'bandpass'; bp.frequency.value = R(320, 700); bp.Q.value = 1.3;
      env(g, [[t, 0], [t + R(.15, .25), R(.06, .12)], [t + 1.3, 0]]); n.connect(bp).connect(g).connect(bus(amb, 1, .15)); }
    function crackle(t) { const n = noise(t, .02), hp = ctx.createBiquadFilter(), g = ctx.createGain(); hp.type = 'highpass'; hp.frequency.value = R(1800, 3500);
      env(g, [[t, 0], [t + .002, R(.012, .035)], [t + .018, 0]]); n.connect(hp).connect(g).connect(bus(amb, .5, .9)); }
    function step(t) { const o = bus(amb, 1, .9), s = ctx.createOscillator(), sg = ctx.createGain(), n = noise(t, .6), lp = ctx.createBiquadFilter(), ng = ctx.createGain();
      s.frequency.setValueAtTime(58, t); s.frequency.exponentialRampToValueAtTime(30, t + .5); env(sg, [[t, 0], [t + .015, .38], [t + .7, 0]]);
      lp.type = 'lowpass'; lp.frequency.value = 180; env(ng, [[t, 0], [t + .01, .2], [t + .4, 0]]);
      s.connect(sg).connect(o); n.connect(lp).connect(ng).connect(o); s.start(t); s.stop(t + .75); }
    return { attach, detach, charge, fire, roar };
  })();
  window.TK = { attach: A.attach, detach: A.detach, breathe: () => { if (state === 'idle') next = performance.now(); }, roar: () => { if (state === 'idle') doRoar(); } };
  wake();
})();
`;

// ---------- patch index.html (idempotent) ----------
s = s.replace(/ *<!-- tokyo:(\w+) -->[\s\S]*?<!-- \/tokyo:\1 -->\n\n?/g, '');
s = s.replace(/  \/\* tokyo:css \*\/\n[\s\S]*?  \/\* \/tokyo:css \*\/\n/, '');
const once = (from, to) => { if (!s.includes(from)) throw new Error('anchor missing: ' + from.slice(0, 90)); s = s.replace(from, to); };
const rep = (a, b) => { if (s.includes(b)) return; once(a, b); };
// 1 css at the end of the main stylesheet
{ const i = s.indexOf('</style>'); s = s.slice(0, i) + '  /* tokyo:css */\n' + css.replace(/^\n/, '') + '  /* /tokyo:css */\n' + s.slice(i); }
// 2 scene, after Hawaiʻi
once('    <div class="headrow">', '    <!-- tokyo:scene -->\n    ' + markup + '\n    <!-- /tokyo:scene -->\n\n    <div class="headrow">');
// 3 place pill: Tokyo Tower (for everyone)
const MARK = 'M8 0 L9.2 5 L10.8 11 L9.6 11 L8.7 7.5 L7.3 7.5 L6.4 11 L5.2 11 L6.8 5 Z M6.2 8.8 H9.8 V9.6 H6.2 Z';
if (!s.includes('data-p="tokyo"')) once('        <button data-p="dock" type="button"', `        <button data-p="tokyo" type="button" aria-label="Tokyo"><svg viewBox="0 0 16 12" aria-hidden="true"><path d="${MARK}"/></svg></button>\n        <button data-p="dock" type="button"`);
// 4 head script: accept the place, fixed-dusk theme colour
rep("if (p === 'campo' || p === 'keywest' || p === 'hawaii') place = p; } catch (e) {}", "if (p === 'campo' || p === 'keywest' || p === 'hawaii' || p === 'tokyo') place = p; } catch (e) {}");
rep("if (/^(dock|campo|keywest|hawaii)$/.test(q.get('place') || '')) place = q.get('place');", "if (/^(dock|campo|keywest|hawaii|tokyo)$/.test(q.get('place') || '')) place = q.get('place');");
rep("hawaii: ['#A9D0E6', '#8E86B0', '#0A1419'] };", "hawaii: ['#A9D0E6', '#8E86B0', '#0A1419'], tokyo: ['#1C1630', '#1C1630', '#1C1630'] };");
// 5 names, marks, pill visibility, hints, sound
rep("hawaii: 'Hawaiʻi' };", "hawaii: 'Hawaiʻi', tokyo: 'Tokyo' };");
rep("L14.2 6.2 L16 11 Z' };", `L14.2 6.2 L16 11 Z', tokyo: '${MARK}' };`);
rep("hawaii: 'Breathe with the trade wind · tap anywhere to come back' };", "hawaii: 'Breathe with the trade wind · tap anywhere to come back', tokyo: 'Breathe in the boat · tap anywhere to come back' };");
rep("return p === 'campo' || p === 'keywest' || p === 'hawaii' ? p : 'dock'; };", "return p === 'campo' || p === 'keywest' || p === 'hawaii' || p === 'tokyo' ? p : 'dock'; };");
// E major, bowl on E4, the water kept low under Godzilla's own bed
rep("    hawaii:  { root: 65.41,", "    tokyo:   { root: 82.41, chord: [0, 7, 12, 16, 19], bowl: 329.63, water: { lp: 360, base: 0.02, swell: 0.1, open: 520 }, padLp: 300, pad: 0.3 },\n    hawaii:  { root: 65.41,");
rep("    const master = gain(0); master.connect(ctx.destination);", "    const master = gain(0); master.connect(ctx.destination);\n    if (p === 'tokyo' && window.TK) window.TK.attach(ctx, master);   // Godzilla's sounds ride on the same master fade");
rep("      if (audio && audio.place !== place()) { audio.ctx.close(); audio = null; }", "      if (audio && audio.place !== place()) { if (audio.place === 'tokyo' && window.TK) window.TK.detach(); audio.ctx.close(); audio = null; }");
// the pad can be quieter per place (P.pad, default 1): in Tokyo Godzilla's own bed carries the room
rep("      breatheIn: () => { env(pad.gain, [[0.1, 3]]); env(water.gain, [[P.water.base, 3]]); },", "      breatheIn: () => { env(pad.gain, [[0.1 * (P.pad || 1), 3]]); env(water.gain, [[P.water.base, 3]]); },");
rep("        env(pad.gain, [[0.05, s]]);", "        env(pad.gain, [[0.05 * (P.pad || 1), s]]);");
// 6 engine, after the main script
{ const i = s.lastIndexOf('</body>'); s = s.slice(0, i) + '<!-- tokyo:js -->\n<script>' + js + '</script>\n<!-- /tokyo:js -->\n' + s.slice(i); }
fs.writeFileSync(file, s);
console.log('written', file, s.length, '(+' + (s.length - fs.statSync(file).size) + ')');
