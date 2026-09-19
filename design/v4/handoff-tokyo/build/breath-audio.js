// ---- sound of the atomic breath: electric power-up while the spines charge, a plasma blast that rushes and
// crackles, a distant boom where it lands, and the real roar echoing over the bay ----
const audio = (() => {
  let ctx, out, verb, roarBuf, noiseBuf, muted = false;
  // Paul's real clips (sounds/). The synth below stays as the fallback if a clip fails to load.
  const CLIPS = { charge: ['tokyo-charge.mp3'], breath: ['tokyo-breath.mp3'] }; // Paul's picks (G2000 charge take 1, breath take 2), encoded from the WAVs
  const MAX_FIRE = 7; // s — a longer breath clip is faded out here so the cycle stays calm between breaths
  const bufs = { charge: [], breath: [] }, sel = { charge: 0, breath: 0 } // Paul picked charge 1 + breath 2;
  // length of the sound without its silent tail (last sample above about −40 dB)
  const active = (b) => { const d = b.getChannelData(0); let i = d.length - 1; while (i > 0 && Math.abs(d[i]) < .01) i--; return i / b.sampleRate; };
  function applyTiming() {
    const c = bufs.charge[sel.charge], b = bufs.breath[sel.breath];
    if (c) T.charge = active(c) * 1000;
    if (b) T.fire = Math.min(active(b), MAX_FIRE) * 1000;
  }
  function impulse(secs, decay) {
    const len = ctx.sampleRate * secs, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }
  async function init() {
    ctx = new AudioContext();
    const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -10; lim.ratio.value = 12; lim.attack.value = .003; lim.release.value = .2;
    out = ctx.createGain(); out.gain.value = .6; out.connect(lim).connect(ctx.destination);
    // one shared hall so everything sounds like it happens across the bay
    const conv = ctx.createConvolver(); conv.buffer = impulse(2.8, 2.4);
    verb = ctx.createGain(); verb.gain.value = .45; verb.connect(conv).connect(out);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); let pink = 0;
    for (let i = 0; i < nd.length; i++) { const w = Math.random() * 2 - 1; pink = .97 * pink + .03 * w; nd[i] = w * .6 + pink * 3; }
    const load = async (name) => { try { return await ctx.decodeAudioData(await (await fetch('/sounds/' + encodeURIComponent(name))).arrayBuffer()); } catch (e) { console.warn('not loaded: ' + name, e); return null; } };
    roarBuf = await load('tokyo-roar.mp3');
    for (const k of ['charge', 'breath']) bufs[k] = await Promise.all(CLIPS[k].map(load));
    applyTiming();
    startAmbience();
  }
  const bus = (dry = 1, wet = .6) => { const g = ctx.createGain(), d = ctx.createGain(), w = ctx.createGain(); d.gain.value = dry; w.gain.value = wet; g.connect(d).connect(out); g.connect(w).connect(verb); return g; };
  const noise = (t, dur) => { const n = ctx.createBufferSource(); n.buffer = noiseBuf; n.loop = true; n.start(t, Math.random() * 2); n.stop(t + dur); return n; };
  const env = (g, pts) => { g.gain.setValueAtTime(pts[0][1], pts[0][0]); for (const [t, v] of pts.slice(1)) g.gain.linearRampToValueAtTime(v, t); };

  function play(buf, t, gain, wet, dur) {
    const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = buf; g.gain.value = gain;
    s.connect(g); const o = bus(1, wet); g.connect(o);
    s.start(t);
    if (dur && dur < buf.duration) { g.gain.setValueAtTime(gain, t + dur - 1); g.gain.linearRampToValueAtTime(0, t + dur); s.stop(t + dur + .05); }
    return s;
  }
  function charge() {
    if (!ctx || muted) return;
    const c = bufs.charge[sel.charge];
    if (c) { const s = ctx.createBufferSource(); s.buffer = c; far(s, ctx.currentTime, { gain: 1.45, lpf: 1200 }); s.start(); } else synthCharge();
  }
  // ---- ambience between the events (Paul picked: Godzilla himself, water at the boat, the distant city — without the oarlock creak and the collapses) ----
  // Everything is quiet and synthesized; a scheduler looks 1 s ahead. The whole bed ducks while he fires.
  let amb, ambTimer, nextLap = 0, nextStep = 0, nextBreath = 0;
  const R = (a, b) => a + Math.random() * (b - a);
  function ambBus(dry, wet) { const g = ctx.createGain(), d = ctx.createGain(), w = ctx.createGain(); d.gain.value = dry; w.gain.value = wet; g.connect(d).connect(amb); g.connect(w).connect(verb); return g; }
  function startAmbience() {
    amb = ctx.createGain(); amb.gain.value = 1; amb.connect(out);
    // the burning city: a low rumble that swells slowly
    const rn = noise(ctx.currentTime, 1e6), rlp = ctx.createBiquadFilter(), rg = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
    rlp.type = 'lowpass'; rlp.frequency.value = 110; rg.gain.value = .22; lfo.frequency.value = .045; lg.gain.value = .08;
    lfo.connect(lg).connect(rg.gain); lfo.start(); rn.connect(rlp).connect(rg).connect(ambBus(1, .4));
    // Godzilla's breathing: a 41 Hz body plus a low huff on the out-breath; gain driven per breath below
    const bo = ctx.createOscillator(); bo.frequency.value = 41; const bg = ctx.createGain(); bg.gain.value = 0; bo.connect(bg).connect(ambBus(1, .5)); bo.start();
    const hn = noise(ctx.currentTime, 1e6), hlp = ctx.createBiquadFilter(), hg = ctx.createGain(); hlp.type = 'lowpass'; hlp.frequency.value = 260; hg.gain.value = 0;
    hn.connect(hlp).connect(hg).connect(ambBus(1, .6));
    const t0 = ctx.currentTime; nextLap = t0 + .5; nextStep = t0 + R(3, 6); nextBreath = t0 + .2;
    ambTimer = setInterval(() => {
      if (!ctx || muted) return;
      const now = ctx.currentTime, until = now + 1;
      while (nextBreath < until) { const t = nextBreath, inh = R(2.2, 2.8), exh = R(3.2, 4);   // in… and out, ~6 s
        bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(.16, t + inh); bg.gain.linearRampToValueAtTime(.05, t + inh + exh);
        hg.gain.setValueAtTime(0, t + inh); hg.gain.linearRampToValueAtTime(.09, t + inh + .5); hg.gain.linearRampToValueAtTime(0, t + inh + exh);
        nextBreath = t + inh + exh + R(.3, 1.2); }
      while (nextLap < until) { lap(nextLap); nextLap += R(1, 2.1); }
      while (nextStep < until) { step(nextStep); nextStep += R(8, 11); }
      for (let k = 0; k < 3; k++) if (Math.random() < .5) crackle(now + .25 + Math.random() * .25);
    }, 250);
  }
  // water slapping the hull: a soft band of noise that swells and falls
  function lap(t) { const n = noise(t, 1.4), bp = ctx.createBiquadFilter(), g = ctx.createGain(); bp.type = 'bandpass'; bp.frequency.value = R(320, 700); bp.Q.value = 1.3;
    const pk = R(.06, .12); env(g, [[t, 0], [t + R(.15, .25), pk], [t + 1.3, 0]]); n.connect(bp).connect(g).connect(ambBus(1, .15)); }
  // far fires: tiny dry ticks, mostly reverb
  function crackle(t) { const n = noise(t, .02), hp = ctx.createBiquadFilter(), g = ctx.createGain(); hp.type = 'highpass'; hp.frequency.value = R(1800, 3500);
    env(g, [[t, 0], [t + .002, R(.012, .035)], [t + .018, 0]]); n.connect(hp).connect(g).connect(ambBus(.5, .9)); }
  // Godzilla shifting his weight: a heavy, distant thud
  function step(t) { const o = ambBus(1, .9), s = ctx.createOscillator(), sg = ctx.createGain(), n = noise(t, .6), lp = ctx.createBiquadFilter(), ng = ctx.createGain();
    s.frequency.setValueAtTime(58, t); s.frequency.exponentialRampToValueAtTime(30, t + .5); env(sg, [[t, 0], [t + .015, .38], [t + .7, 0]]);
    lp.type = 'lowpass'; lp.frequency.value = 180; env(ng, [[t, 0], [t + .01, .2], [t + .4, 0]]);
    s.connect(sg).connect(o); n.connect(lp).connect(ng).connect(o); s.start(t); s.stop(t + .75); }
  function duck(secs) { if (!amb) return; const t = ctx.currentTime; amb.gain.cancelScheduledValues(t); amb.gain.setValueAtTime(amb.gain.value, t);
    amb.gain.linearRampToValueAtTime(.45, t + .3); amb.gain.setValueAtTime(.45, t + secs); amb.gain.linearRampToValueAtTime(1, t + secs + 2); }
  function fire() {
    if (!ctx || muted) return;
    const b = bufs.breath[sel.breath], t = ctx.currentTime;
    if (!b) return synthFire();
    { const s = ctx.createBufferSource(); s.buffer = b; const dur = T.fire / 1000 + .6; far(s, t, { gain: 1.5, lpf: 1500, dur: dur < b.duration ? dur : 0 }); s.start(t); if (dur < b.duration) s.stop(t + dur + .05); }
    boom(t + .35); duck(T.fire / 1000 + 1);
    roar(t + .15, .45); // a small roar under every breath; the full roar is its own event (Paul, 2026-09-19)
  }
  // 3.5 s power-up: a whine that climbs and pulses faster, a low hum, and static crackle that thickens
  function synthCharge() {
    const t = ctx.currentTime, d = T.charge / 1000, o = bus(1, .5);
    const hum = ctx.createOscillator(), hg = ctx.createGain(), hlp = ctx.createBiquadFilter();
    hum.type = 'sawtooth'; hum.frequency.setValueAtTime(45, t); hum.frequency.exponentialRampToValueAtTime(90, t + d);
    hlp.type = 'lowpass'; hlp.frequency.setValueAtTime(160, t); hlp.frequency.exponentialRampToValueAtTime(700, t + d);
    env(hg, [[t, 0], [t + d, .22], [t + d + .15, 0]]);
    hum.connect(hlp).connect(hg).connect(o); hum.start(t); hum.stop(t + d + .2);
    const whine = ctx.createGain(), bp = ctx.createBiquadFilter(), trem = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
    bp.type = 'bandpass'; bp.Q.value = 6; bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(1600, t + d);
    lfo.frequency.setValueAtTime(6, t); lfo.frequency.exponentialRampToValueAtTime(34, t + d); lg.gain.value = .5; trem.gain.value = .5;
    lfo.connect(lg).connect(trem.gain); lfo.start(t); lfo.stop(t + d + .2);
    for (const det of [-7, 6]) { const s = ctx.createOscillator(); s.type = 'sawtooth'; s.detune.value = det; s.frequency.setValueAtTime(150, t); s.frequency.exponentialRampToValueAtTime(620, t + d); s.connect(bp); s.start(t); s.stop(t + d + .2); }
    env(whine, [[t, 0], [t + d * .3, .03], [t + d, .1], [t + d + .1, 0]]);
    bp.connect(trem).connect(whine).connect(o);
    // crackle: short bright ticks, sparse at first, dense at the end
    for (let k = 0; k < 70; k++) {
      const at = t + d * Math.pow(Math.random(), .45), n = noise(at, .02), hp = ctx.createBiquadFilter(), g = ctx.createGain();
      hp.type = 'highpass'; hp.frequency.value = 2500 + Math.random() * 3000;
      env(g, [[at, 0], [at + .002, .05 + .1 * (at - t) / d], [at + .018, 0]]);
      n.connect(hp).connect(g).connect(o);
    }
  }

  // 2 s blast: rushing plasma with a wobbling resonance, a screaming tone, sizzle on top, sub pressure underneath
  function synthFire() {
    const t = ctx.currentTime, d = T.fire / 1000, o = bus(1, .7);
    const n = noise(t, d + .6), wob = ctx.createOscillator(), wg = ctx.createGain(), g = ctx.createGain();
    wob.frequency.value = 7; wg.gain.value = 260; wob.connect(wg); wob.start(t); wob.stop(t + d + .6);
    for (const [f, q, lvl] of [[520, 2.5, .5], [1900, 3, .35], [4200, 1.2, .18]]) {
      const bp = ctx.createBiquadFilter(), bg = ctx.createGain(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q; bg.gain.value = lvl;
      wg.connect(bp.frequency); n.connect(bp).connect(bg).connect(g);
    }
    env(g, [[t, 0], [t + .06, .75], [t + .35, .55], [t + d - .2, .6], [t + d + .45, 0]]);
    g.connect(o);
    const scream = ctx.createOscillator(), sv = ctx.createOscillator(), svg = ctx.createGain(), ws = ctx.createWaveShaper(), sg = ctx.createGain(), slp = ctx.createBiquadFilter();
    const curve = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; curve[i] = Math.tanh(3 * x); } ws.curve = curve;
    scream.type = 'sawtooth'; scream.frequency.setValueAtTime(420, t); scream.frequency.exponentialRampToValueAtTime(300, t + d);
    sv.frequency.value = 11; svg.gain.value = 14; sv.connect(svg).connect(scream.frequency);
    slp.type = 'lowpass'; slp.frequency.value = 2400; env(sg, [[t, 0], [t + .1, .07], [t + d, .06], [t + d + .3, 0]]);
    scream.connect(ws).connect(slp).connect(sg).connect(o); scream.start(t); sv.start(t); scream.stop(t + d + .4); sv.stop(t + d + .4);
    const sub = ctx.createOscillator(), subg = ctx.createGain(); sub.frequency.setValueAtTime(52, t); sub.frequency.linearRampToValueAtTime(38, t + d);
    env(subg, [[t, 0], [t + .08, .5], [t + d, .4], [t + d + .5, 0]]); sub.connect(subg).connect(out); sub.start(t); sub.stop(t + d + .6);
    for (let k = 0; k < 90; k++) {
      const at = t + Math.random() * (d + .8), cn = noise(at, .015), hp = ctx.createBiquadFilter(), cg = ctx.createGain();
      hp.type = 'highpass'; hp.frequency.value = 4000; env(cg, [[at, 0], [at + .002, at < t + d ? .09 : .05], [at + .014, 0]]); cn.connect(hp).connect(cg).connect(o);
    }
    boom(t + .35);
  }
  // FAR (Paul, 2026-09-19): the roar, the charge and the breath all sound like they happen far across the bay —
  // muffled (110 Hz – ~1.2 kHz), quiet dry signal, mostly a long hall and three far echoes that darken.
  let farHall;
  function far(src, t, { gain = 1, lpf = 1100, dur } = {}) {
    const hp = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter(), g = ctx.createGain(), send = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 110; lp.type = 'lowpass'; lp.frequency.value = lpf;
    g.gain.value = .28 * gain; send.gain.value = 2.4;
    if (dur) { g.gain.setValueAtTime(.28 * gain, t + dur - 1); g.gain.linearRampToValueAtTime(0, t + dur); }
    src.connect(hp).connect(lp).connect(g).connect(out); g.connect(send).connect(verb);
    if (!farHall) { const c = ctx.createConvolver(); c.buffer = impulse(5.5, 1.8); farHall = ctx.createGain(); farHall.gain.value = .9; farHall.connect(c).connect(out); }
    g.connect(farHall);
    for (const [time, fbk, wetv] of [[.45, .55, .5], [.82, .45, .4], [1.3, .35, .3]]) {
      const dl = ctx.createDelay(2), fb = ctx.createGain(), dark = ctx.createBiquadFilter(), wet = ctx.createGain();
      dl.delayTime.value = time; fb.gain.value = fbk; dark.type = 'lowpass'; dark.frequency.value = 900; wet.gain.value = wetv;
      g.connect(dl); dl.connect(dark).connect(fb).connect(dl); dark.connect(wet).connect(out); wet.connect(verb);
    }
  }
  function roar(t = ctx && ctx.currentTime, level = 1) {
    if (!ctx || muted || !roarBuf) return;
    const r = ctx.createBufferSource(); r.buffer = roarBuf; far(r, t, { gain: level }); r.start(t);
  }
  // the impact, heard from across the bay: a dull thud that rolls off the towers
  function boom(t) {
    const o = bus(.9, 1), n = noise(t, 2.2), lp = ctx.createBiquadFilter(), g = ctx.createGain(), s = ctx.createOscillator(), sg = ctx.createGain();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(90, t + 1.8);
    env(g, [[t, 0], [t + .02, .35], [t + 1.8, 0]]); n.connect(lp).connect(g).connect(o);
    s.frequency.setValueAtTime(95, t); s.frequency.exponentialRampToValueAtTime(28, t + 1.2);
    env(sg, [[t, 0], [t + .02, .3], [t + 1.3, 0]]); s.connect(sg).connect(o); s.start(t); s.stop(t + 1.4);
  }
  return { init, charge, fire, roar: () => roar(), toggle() { muted = !muted; return muted; }, select(k, i) { sel[k] = i; applyTiming(); },
    info: () => ({ charge: bufs.charge.map((b) => b && active(b).toFixed(1)), breath: bufs.breath.map((b) => b && Math.min(active(b), MAX_FIRE).toFixed(1)), sel }) };
})();
