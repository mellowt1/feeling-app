# Feeling, Florida dock → Boca inlet: hand-back for Claude Code

Source of truth for this hand-back: `design/v4/handoff-dock/dock-boca-app.html` (open it; the bar at the top switches morning / day / evening / night, sit mode, late, and "boat + swell now"). It is Feeling 37's `index.html` Today screen with the dock place rebuilt. Everything below is what changes in `index.html`. The figure, the rod, the cat and the dock planks are Paul's approved paths and are untouched.

## 1. Sprite: add three PhyloPic symbols to the `<defs>` at the top of index.html

Frigatebird (Fregata magnificens, Antonio Medina, CC0) and gull (Larus, Sharon Wegner-Larsen, CC0) already exist in index.html for Key West; make sure they are in the shared sprite. Ghost crab is present but no longer used on the dock (reverted).

## 2. Markup: replace `<div class="waves">…</div>` inside `#tab-today` with

```html
    <div class="waves" aria-hidden="true">
      <div class="wave-wrap"><div class="swell">
        <svg class="mangrove far" viewBox="0 0 600 80" preserveAspectRatio="none"><path d="M0,80 L0,56 C40,50 70,38 110,42 C150,46 170,30 220,34 C260,37 290,24 340,30 C390,36 420,26 470,32 C520,38 560,30 600,40 L600,80 Z"></path></svg>
        <div class="glitter" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <svg class="w1" viewBox="0 0 1200 200" preserveAspectRatio="none"><path class="w1" d="M0,60 C40,48 60,72 100,64 C140,56 160,74 200,62 C240,50 260,70 300,66 C340,62 360,48 400,58 C440,68 460,52 500,60 C540,68 560,50 600,60 C640,70 660,52 700,62 C740,72 760,54 800,58 C840,62 860,72 900,64 C940,56 960,48 1000,60 C1040,72 1060,54 1100,62 C1140,70 1170,50 1200,60 L1200,200 L0,200 Z"></path></svg>
        <span class="marker red"></span><span class="marker green"></span>
        <svg class="boat" viewBox="0 0 30 12" aria-hidden="true"><path d="M2 8 L28 8 L25 11.5 L5 11.5 Z"></path><path d="M11 8 L11 4.5 L19 4.5 L19 8 Z"></path><path d="M14 4.5 L14 1.5 L15.2 1.5 L15.2 4.5 Z"></path></svg>
        <div class="amb dolphins"><svg class="d1" viewBox="0 0 1536 497"><use href="#f-dolphin"></use></svg><svg class="d2" viewBox="0 0 1536 497"><use href="#f-dolphin"></use></svg></div>
        <svg class="mangrove" viewBox="0 0 600 160" preserveAspectRatio="none"><path d="M0,160 L0,70 C30,66 50,40 90,44 C120,47 130,28 170,30 C210,32 230,52 270,50 C300,48 320,30 360,38 C400,46 430,60 470,62 C500,64 530,90 552,118 C566,136 582,152 600,160 Z"></path></svg>
        <div class="gust g1"></div>
        <svg class="w2" viewBox="0 0 1200 200" preserveAspectRatio="none"><path class="w2" d="M0,64 C40,52 60,76 100,66 C140,56 160,76 200,64 C240,52 260,72 300,68 C340,64 360,50 400,60 C440,70 460,54 500,62 C540,70 560,52 600,62 C640,72 660,54 700,64 C740,74 760,56 800,60 C840,64 860,74 900,66 C940,58 960,50 1000,62 C1040,74 1060,56 1100,64 C1140,72 1170,52 1200,62 L1200,200 L0,200 Z"></path></svg>
        <div class="amb glade night-only"></div>
        <svg class="amb heron" viewBox="0 0 658 1536"><use href="#f-egret"></use></svg>
        <svg class="amb manatee dusk-night" viewBox="0 0 1536 999"><use href="#f-manatee"></use></svg>
        <svg class="amb dragonfly day-only not-dusk" viewBox="-5 -6 16 12"><path d="M0,0 L10,0 M2,-1 L-4,-4 M2,1 L-4,4 M7,-1 L2,-5 M7,1 L2,5"></path></svg>
        <svg class="dock" viewBox="0 0 210 120" aria-hidden="true">
          <g class="dock-figure">
            <path d="M116.5 62H91.5C90.6716 62 90 62.6716 90 63.5V67.5C90 68.3284 90.6716 69 91.5 69H116.5C117.328 69 118 68.3284 118 67.5V63.5C118 62.6716 117.328 62 116.5 62Z"></path>
            <path d="M146.5 62H121.5C120.672 62 120 62.6716 120 63.5V67.5C120 68.3284 120.672 69 121.5 69H146.5C147.328 69 148 68.3284 148 67.5V63.5C148 62.6716 147.328 62 146.5 62Z"></path>
            <path d="M176.5 62H151.5C150.672 62 150 62.6716 150 63.5V67.5C150 68.3284 150.672 69 151.5 69H176.5C177.328 69 178 68.3284 178 67.5V63.5C178 62.6716 177.328 62 176.5 62Z"></path>
            <path d="M208.5 62H181.5C180.672 62 180 62.6716 180 63.5V67.5C180 68.3284 180.672 69 181.5 69H208.5C209.328 69 210 68.3284 210 67.5V63.5C210 62.6716 209.328 62 208.5 62Z"></path>
            <path d="M116.5 69H114C112.895 69 112 69.8954 112 71V111C112 112.105 112.895 113 114 113H116.5C117.605 113 118.5 112.105 118.5 111V71C118.5 69.8954 117.605 69 116.5 69Z"></path>
            <path d="M190.5 69H188C186.895 69 186 69.8954 186 71V115C186 116.105 186.895 117 188 117H190.5C191.605 117 192.5 116.105 192.5 115V71C192.5 69.8954 191.605 69 190.5 69Z"></path>
            <path d="M190.5 84H114.5C113.672 84 113 84.6716 113 85.5C113 86.3284 113.672 87 114.5 87H190.5C191.328 87 192 86.3284 192 85.5C192 84.6716 191.328 84 190.5 84Z"></path>
            <rect x="183" y="40" width="2.4" height="22" rx="1"></rect>
            <g class="cat">
              <path class="cat-tail" d="M139 60.5 C143.5 60 146.5 63.5 145 68.5"></path>
              <path d="M124 52.5 C123 56 122.8 59 123.6 62 L139.6 62 C140.6 58 139.6 53 135 51 C133 50.2 131 51 130.4 52.4 Z"></path>
              <circle cx="127.5" cy="49" r="4.1"></circle>
              <path class="ear ear-l" d="M124 46.6 L123.6 41.8 L127 45.7 Z"></path>
              <path class="ear ear-r" d="M128.2 45.6 L131.4 42 L131.2 46.7 Z"></path>
            </g>
</g><g class="person-wrap"><g class="person" transform="translate(60.3,11.6) scale(.36)"><g class="breathe-fig"><path stroke="none" d="M128 66 C140 70,148 80,148 96 C148 112,150 128,150 140 L90 140 C88 156,84 174,84 188 C84 195,80 199,73 199 L58 202 C52 202,50 196,55 193 L68 190 C66 172,64 156,66 143 C67 128,72 118,84 116 L100 116 C105 112,104 100,108 88 C112 76,116 70,120 67 Z"></path><path stroke="none" d="M118 69 L136 66 L131 54 L115 60 Z"></path><ellipse cx="121" cy="50" rx="15" ry="17" transform="rotate(-8 121 50)" stroke="none"></ellipse><path fill="none" stroke-width="11" d="M138 86 C132 98,124 108,116 113 C108 118,98 121,90 121"></path><circle cx="88" cy="122" r="6.5" stroke="none"></circle><g class="rod-wind"><g class="rod-cast"><g class="rod"><path fill="none" stroke-width="2.4" d="M94 118 L10 86"></path><g class="fishline"><path fill="none" stroke-width="1" stroke-opacity=".7" d="M10 86 C8 120,6 160,6 200"></path></g></g></g></g></g></g></g>
            <g>          </g>
          <g class="cast">
            <circle class="lamp-glow" cx="184.2" cy="40" r="1.9"></circle>
            <circle class="cast-splash" cx="62.5" cy="84" r="3.5"></circle>
            <circle class="cast-bobber" cx="62.5" cy="84" r="1.8"></circle>
          </g>
        </svg>
        <div class="glare"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="gust g2"></div>
          </g>
        </svg>
        <div class="fish-wrap fw1"><svg class="fish fish1 far" viewBox="0 0 1536 626"><use href="#f-tarpon"></use></svg></div>
        <div class="fish-wrap fw2"><svg class="fish fish2" viewBox="0 0 1536 554"><use href="#f-snook"></use></svg></div>
        <div class="fish-wrap fw4"><svg class="fish fish4" viewBox="0 0 1536 511"><use href="#f-jack"></use></svg></div>
        <div class="fish-wrap fw5"><svg class="fish fish5 far" viewBox="0 0 1536 902"><use href="#f-cuda"></use></svg></div>
        <div class="fish-wrap fw6">
          <svg class="fish pin p1" viewBox="0 0 1536 531"><use href="#f-pinfish"></use></svg>
          <svg class="fish pin p2" viewBox="0 0 1536 531"><use href="#f-pinfish"></use></svg>
          <svg class="fish pin p3" viewBox="0 0 1536 531"><use href="#f-pinfish"></use></svg>
          <svg class="fish pin p4" viewBox="0 0 1536 531"><use href="#f-pinfish"></use></svg>
          <svg class="fish pin p5" viewBox="0 0 1536 531"><use href="#f-pinfish"></use></svg>
        </div>
        <div class="fish-wrap fw7"><svg class="fish fish7 near" viewBox="0 0 1536 708"><use href="#f-grouper"></use></svg></div>
        <div class="fish-wrap fw8"><svg class="fish fish8" viewBox="0 0 1536 503"><use href="#f-mackerel"></use></svg></div>
        <div class="fish-wrap fw9">
          <svg class="fish snap s1 near" viewBox="0 0 1536 474"><use href="#f-snapper"></use></svg>
          <svg class="fish snap s2 near" viewBox="0 0 690 335"><use href="#f-snapper2"></use></svg>
          <svg class="fish snap s3 near" viewBox="0 0 1536 474"><use href="#f-snapper"></use></svg>
          <svg class="fish snap s4 near" viewBox="0 0 1536 474"><g transform="matrix(-1 0 0 1 1536 0)"><use href="#f-snapper"></use></g></svg>
        </div>
        <div class="fish-wrap fw10"><svg class="fish blacktip far" viewBox="0 0 1536 749"><use href="#f-blacktip"></use></svg></div>
        <div class="fish-wrap fw11"><svg class="fish bonnet near" viewBox="0 0 3953 1584"><g transform="matrix(-1 0 0 1 3953 0)"><use href="#f-bonnethead"></use></g></svg></div>
        <div class="mullet-wrap mu1" aria-hidden="true">
          <svg class="mullet" viewBox="0 0 1536 592"><use href="#f-mullet"></use></svg>
          <svg class="splash" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13"></circle></svg>
        </div>
        <div class="mullet-wrap mu2" aria-hidden="true">
          <svg class="mullet" viewBox="0 0 1536 592"><use href="#f-mullet"></use></svg>
          <svg class="splash" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13"></circle></svg>
        </div>
        <div class="mullet-wrap mu3" aria-hidden="true">
          <svg class="mullet" viewBox="0 0 1536 592"><use href="#f-mullet"></use></svg>
          <svg class="splash" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13"></circle></svg>
        </div>
        <svg class="w3" viewBox="0 0 1200 200" preserveAspectRatio="none"><path class="w3" d="M0,66 C40,54 60,78 100,68 C140,58 160,78 200,66 C240,54 260,74 300,70 C340,66 360,52 400,62 C440,72 460,56 500,64 C540,72 560,54 600,64 C640,74 660,56 700,66 C740,76 760,58 800,62 C840,66 860,76 900,68 C940,60 960,52 1000,64 C1040,76 1060,58 1100,66 C1140,74 1170,54 1200,64 L1200,200 L0,200 Z"></path></svg>
        <div class="gust g3"></div>
        <div class="deep"></div>
      </div>
      </div>
    </div>
```

And add the two birds just before `<div class="wind">` in `#tab-today`:

```html
    <svg class="bird frigate" viewBox="0 0 873 1536" aria-hidden="true"><use href="#f-frigate"></use></svg>
    <svg class="bird gull" viewBox="0 0 1536 1347" aria-hidden="true"><use href="#f-gull"></use></svg>
```

Rod: wrap the line path in `<g class="fishline">…</g>` inside `<g class="rod">` (done in the markup above's dock block).

## 3. CSS: replace the living-water block (from `.waves .mullet-wrap {` to just before `/* distant boat on the horizon`) with

```css
  .waves .mullet-wrap { position: absolute; bottom: 40%; pointer-events: none; }
  .waves .mullet-wrap.mu1 { left: 30%; }
  .waves .mullet-wrap.mu2 { left: 44%; }
  .waves .mullet-wrap.mu3 { left: 58%; }
  .mullet-wrap .mullet { display: block; width: 22px; height: auto; overflow: visible; animation: mulletJump 60s linear infinite; }
  .mullet-wrap.mu1 .mullet { animation-delay: 0s; }
  .mullet-wrap.mu2 .mullet { animation-delay: -20s; }
  .mullet-wrap.mu3 .mullet { animation-delay: -40s; }
  .mullet use { fill: var(--accent); opacity: .5; }
  @keyframes mulletJump {
    0%, 44%   { transform: translateY(0) rotate(-20deg); opacity: 0; }
    45%       { opacity: .5; }
    45.75%    { transform: translateY(-22px) rotate(0deg); }
    46.5%     { transform: translateY(0) rotate(20deg); opacity: .5; }
    46.55%, 100% { opacity: 0; }
  }
  .mullet-wrap .splash { position: absolute; left: -5px; bottom: -2px; width: 28px; height: 28px; animation: splash 60s linear infinite; }
  .mullet-wrap.mu1 .splash { animation-delay: 0s; }
  .mullet-wrap.mu2 .splash { animation-delay: -20s; }
  .mullet-wrap.mu3 .splash { animation-delay: -40s; }
  .splash circle { fill: none; stroke: var(--accent); stroke-width: 1; }
  @keyframes splash {
    0%, 46.3% { transform: scale(.3); opacity: 0; }
    46.6%     { opacity: .4; }
    50.6%     { transform: scale(1); opacity: 0; }
    100%      { opacity: 0; }
  }

  .waves .fish-wrap { position: absolute; inset: 0; pointer-events: none; }
  /* living water: every wrap carries one fish (or school) along its own path: translate, then a turn (scaleX), then pitch.
     The origin sits on the fish so turns and pitch happen in place. Nose always leads: pinfish, mackerel and snapper are drawn facing right.
     Two shared clocks make the animals notice each other: snook, pinfish and barracuda run on one 130 s cycle (delay -18 s),
     blacktip and snappers on one 150 s cycle (delay -100 s); the jack (120 s) is phased to the mullet (40 s) so one jumps clear of its nose. */
  .waves .fish-wrap { animation-timing-function: cubic-bezier(.35,.15,.65,.85); animation-iteration-count: infinite; }
  /* every fish is one silhouette: the body sways from a point behind the head, the whole fish bobs */
  .waves svg.fish { position: absolute; left: 0; height: auto; overflow: visible; pointer-events: none; fill: var(--accent); animation: fishBob 8s ease-in-out infinite alternate; }
  /* depth: three tiers, still one fill each. Far fish are hazed toward the water (color-mix), smaller, paler and bob less; near fish are fuller and bob more */
  .waves svg.fish.far  { fill: color-mix(in srgb, var(--accent) 62%, var(--scene-mid)); animation-duration: 11s; }
  .waves svg.fish.near { fill: color-mix(in srgb, var(--accent) 100%, var(--scene-front)); animation-name: fishBobNear; }
  @keyframes fishBobNear { from { transform: translateY(-5px); } to { transform: translateY(5px); } }
  .waves svg.fish use { transform-box: fill-box; transform-origin: 30% 50%; animation: sway 2.4s ease-in-out infinite alternate; }
  .pin use, .fish8 use, .snap.s1 use, .snap.s3 use, .snap.s4 use { transform-origin: 70% 50%; }
  @keyframes sway { from { transform: rotate(-1.4deg); } to { transform: rotate(1.4deg); } }
  @keyframes fishBob { from { transform: translateY(-4px); } to { transform: translateY(4px); } }
  /* tarpon: crosses, climbs to roll at the surface, sinks again; later comes back the other way, deeper */
  .waves .fish-wrap.fw1 { transform-origin: 33px calc(66% - 13px); animation-name: swimTarpon; animation-duration: 96s; animation-delay: -12s; }
  @keyframes swimTarpon {
    0%   { transform: translate(112vw, 0) scaleX(1) rotate(0deg); }
    18%  { transform: translate(62vw, 4px) scaleX(1) rotate(-2deg); }
    24%  { transform: translate(50vw, -34px) scaleX(1) rotate(14deg); }
    26%  { transform: translate(46vw, -40px) scaleX(1) rotate(0deg); }
    29%  { transform: translate(40vw, -20px) scaleX(1) rotate(-12deg); }
    34%  { transform: translate(30vw, 6px) scaleX(1) rotate(0deg); }
    48%  { transform: translate(-25vw, 0) scaleX(1) rotate(0deg); }
    50%  { transform: translate(-25vw, 30px) scaleX(-1) rotate(0deg); }
    62%  { transform: translate(-25vw, 30px) scaleX(-1) rotate(0deg); }
    74%  { transform: translate(40vw, 20px) scaleX(-1) rotate(3deg); }
    86%  { transform: translate(112vw, 26px) scaleX(-1) rotate(0deg); }
    100% { transform: translate(112vw, 0) scaleX(1) rotate(0deg); }
  }
  .waves svg.fish.fish1 { width: 58px; bottom: 34%; opacity: .2; animation: tarponRoll 96s ease-in-out infinite; animation-delay: -12s; }
  .fish1 use { animation-duration: 3.2s; }
  @keyframes tarponRoll { 0%, 24% { transform: scaleY(1); } 26% { transform: scaleY(.68); } 28.5%, 100% { transform: scaleY(1); } }
  /* snook: a resident on the 130 s clock. Holds by the piling facing the current, tenses, strikes the pinfish at 33 % (the school scatters at the same
     moment), coasts out of the strike, turns, and drifts home along the bottom of its band */
  .waves .fish-wrap.fw2 { transform-origin: 28px calc(60% - 10px); animation-name: swimSnook; animation-duration: 130s; animation-delay: -18s; }
  @keyframes swimSnook {
    0%    { transform: translate(64vw, 0) scaleX(1) rotate(0deg); }
    12%   { transform: translate(62vw, 3px) scaleX(1) rotate(0deg); }
    24%   { transform: translate(64vw, 1px) scaleX(1) rotate(0deg); }
    31%   { transform: translate(63vw, 0) scaleX(1) rotate(2deg); }
    31.6% { transform: translate(60vw, -2px) scaleX(1) rotate(4deg); }
    33.2% { transform: translate(45vw, -8px) scaleX(1) rotate(3deg); }
    36%   { transform: translate(39vw, -4px) scaleX(1) rotate(0deg); }
    41%   { transform: translate(37vw, 0) scaleX(1) rotate(0deg); }
    43%   { transform: translate(36vw, 1px) scaleX(-1) rotate(0deg); }
    58%   { transform: translate(52vw, 6px) scaleX(-1) rotate(-3deg); }
    72%   { transform: translate(66vw, 2px) scaleX(-1) rotate(0deg); }
    75%   { transform: translate(67vw, 1px) scaleX(1) rotate(0deg); }
    100%  { transform: translate(64vw, 0) scaleX(1) rotate(0deg); }
  }
  .waves svg.fish.fish2 { width: 56px; bottom: 40%; opacity: .25; animation-duration: 10s; }
  /* jack crevalle: one fast dipping pass, a long nothing, then back the other way higher up.
     120 s is two mullet cycles: with this delay the middle mullet (mu2, left 44 %) jumps clear just ahead of the jack's nose on the left-going pass */
  .waves .fish-wrap.fw4 { transform-origin: 25px calc(64% - 8px); animation-name: swimJack; animation-duration: 120s; animation-delay: -59.7s; }
  @keyframes swimJack {
    0%   { transform: translate(112vw, 0) scaleX(1) rotate(0deg); }
    3%   { transform: translate(80vw, 14px) scaleX(1) rotate(-8deg); }
    6%   { transform: translate(45vw, -6px) scaleX(1) rotate(7deg); }
    9%   { transform: translate(10vw, 8px) scaleX(1) rotate(-4deg); }
    11%  { transform: translate(-25vw, 0) scaleX(1) rotate(0deg); }
    50%  { transform: translate(-25vw, -20px) scaleX(-1) rotate(0deg); }
    53%  { transform: translate(10vw, -10px) scaleX(-1) rotate(-6deg); }
    57%  { transform: translate(55vw, -24px) scaleX(-1) rotate(5deg); }
    61%  { transform: translate(112vw, -14px) scaleX(-1) rotate(0deg); }
    100% { transform: translate(112vw, 0) scaleX(1) rotate(0deg); }
  }
  .waves svg.fish.fish4 { width: 50px; bottom: 36%; opacity: .24; animation-duration: 5s; }
  .fish4 use { animation-duration: .9s; transform-origin: 35% 50%; }
  /* barracuda: on the 130 s clock. Arrives at 20 %, hangs dead still under the school's turning point from 24 % to 58 %, then is gone in a flash beneath them */
  .waves .fish-wrap.fw5 { animation-name: swimCuda; animation-duration: 130s; animation-delay: -18s; animation-timing-function: linear; }
  @keyframes swimCuda {
    0%   { transform: translateX(110vw); }
    20%  { transform: translateX(62vw); animation-timing-function: ease-out; }
    24%  { transform: translateX(59vw); }
    58%  { transform: translateX(57vw); animation-timing-function: cubic-bezier(.7,0,.9,.4); }
    61%  { transform: translateX(-140px); }
    100% { transform: translateX(-140px); }
  }
  .waves svg.fish.fish5 { width: 56px; bottom: 22%; opacity: .17; animation-duration: 13s; }
  .fish5 use { animation-duration: 1.6s; }
  /* pinfish: the school on the 130 s clock. Wanders in, stops to feed, is hit by the snook at 33 % (wrap flees right and up, each fish bursts its own way,
     regroups by 37 %), rises and turns when it meets the hanging barracuda at 39 %, hurries off, feeds again, and leaves */
  .waves .fish-wrap.fw6 { transform-origin: 32px 57%; animation-name: swimSchool; animation-duration: 130s; animation-delay: -18s; }
  @keyframes swimSchool {
    0%    { transform: translate(-25vw, 0) scaleX(1); }
    14%   { transform: translate(22vw, 4px) scaleX(1); }
    22%   { transform: translate(24vw, 10px) scaleX(1); }
    29%   { transform: translate(38vw, 2px) scaleX(1); }
    33%   { transform: translate(44vw, 0) scaleX(1); }
    33.8% { transform: translate(52vw, -10px) scaleX(1); }
    37%   { transform: translate(54vw, -6px) scaleX(1); }
    39%   { transform: translate(56vw, -14px) scaleX(1); }
    40%   { transform: translate(56vw, -14px) scaleX(-1); }
    45%   { transform: translate(42vw, -6px) scaleX(-1); }
    54%   { transform: translate(18vw, 6px) scaleX(-1); }
    56%   { transform: translate(17vw, 6px) scaleX(1); }
    66%   { transform: translate(30vw, 12px) scaleX(1); }
    74%   { transform: translate(34vw, 10px) scaleX(1); }
    100%  { transform: translate(115vw, -4px) scaleX(1); }
  }
  /* each pinfish: its own small orbit, a nose-down feed in the two holds (right-facing art, so nose down is rotate(+)), a burst away from the snook
     at 33 %. Same 130 s clock and delay as the wrap so the beats line up */
  .waves svg.fish.pin { width: 16px; opacity: .26; animation: pinP1 130s ease-in-out infinite; animation-delay: -18s; }
  .waves svg.fish.pin.p1 { bottom: 44%; left: 0; }
  .waves svg.fish.pin.p2 { bottom: 47%; left: 22px; animation-name: pinP2; }
  .waves svg.fish.pin.p3 { bottom: 42%; left: 26px; animation-name: pinP3; }
  .waves svg.fish.pin.p4 { bottom: 45%; left: 48px; animation-name: pinP4; }
  .waves svg.fish.pin.p5 { bottom: 40%; left: 12px; animation-name: pinP5; }
  .pin use { animation-duration: .7s; }
  @keyframes pinP1 {
    0%    { transform: translate(0, 0) rotate(0deg); }
    10%   { transform: translate(3px, -2px) rotate(0deg); }
    16%   { transform: translate(1px, 0) rotate(0deg); }
    17.5% { transform: translate(1px, 4px) rotate(24deg); }
    20%   { transform: translate(0, 4px) rotate(24deg); }
    21.5% { transform: translate(0, 0) rotate(0deg); }
    33%   { transform: translate(0, 0) rotate(0deg); }
    33.8% { transform: translate(-7px, 9px) rotate(-10deg); }
    37%   { transform: translate(1px, 1px) rotate(0deg); }
    48%   { transform: translate(-2px, 1px) rotate(0deg); }
    68%   { transform: translate(-1px, 0) rotate(0deg); }
    69.5% { transform: translate(-1px, 3px) rotate(22deg); }
    72%   { transform: translate(0, 3px) rotate(22deg); }
    73.5% { transform: translate(0, 0) rotate(0deg); }
    100%  { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes pinP2 {
    0%    { transform: translate(0, 0) rotate(0deg); }
    8%    { transform: translate(-2px, 2px) rotate(0deg); }
    19%   { transform: translate(1px, 0) rotate(0deg); }
    20.5% { transform: translate(1px, 4px) rotate(26deg); }
    23%   { transform: translate(0, 4px) rotate(26deg); }
    24.5% { transform: translate(0, 0) rotate(0deg); }
    33%   { transform: translate(0, 0) rotate(0deg); }
    33.8% { transform: translate(10px, -8px) rotate(6deg); }
    37%   { transform: translate(1px, 1px) rotate(0deg); }
    50%   { transform: translate(3px, 2px) rotate(0deg); }
    66%   { transform: translate(-1px, 0) rotate(0deg); }
    67.5% { transform: translate(-1px, 3px) rotate(24deg); }
    70%   { transform: translate(0, 3px) rotate(24deg); }
    71.5% { transform: translate(0, 0) rotate(0deg); }
    100%  { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes pinP3 {
    0%    { transform: translate(0, 0) rotate(0deg); }
    12%   { transform: translate(2px, 2px) rotate(0deg); }
    23.5% { transform: translate(1px, 0) rotate(0deg); }
    25%   { transform: translate(1px, 4px) rotate(28deg); }
    27.5% { transform: translate(0, 4px) rotate(28deg); }
    29%   { transform: translate(0, 0) rotate(0deg); }
    33%   { transform: translate(0, 0) rotate(0deg); }
    33.8% { transform: translate(-9px, -6px) rotate(-8deg); }
    37%   { transform: translate(1px, 1px) rotate(0deg); }
    46%   { transform: translate(-3px, 0) rotate(0deg); }
    71%   { transform: translate(-1px, 0) rotate(0deg); }
    72.5% { transform: translate(-1px, 3px) rotate(24deg); }
    75%   { transform: translate(0, 3px) rotate(24deg); }
    76.5% { transform: translate(0, 0) rotate(0deg); }
    100%  { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes pinP4 {
    0%    { transform: translate(0, 0) rotate(0deg); }
    9%    { transform: translate(-3px, -1px) rotate(0deg); }
    15%   { transform: translate(1px, 0) rotate(0deg); }
    16.5% { transform: translate(1px, 4px) rotate(25deg); }
    19%   { transform: translate(0, 4px) rotate(25deg); }
    20.5% { transform: translate(0, 0) rotate(0deg); }
    33%   { transform: translate(0, 0) rotate(0deg); }
    33.8% { transform: translate(12px, 6px) rotate(10deg); }
    37%   { transform: translate(1px, 1px) rotate(0deg); }
    52%   { transform: translate(1px, -2px) rotate(0deg); }
    70%   { transform: translate(-1px, 0) rotate(0deg); }
    71.5% { transform: translate(-1px, 3px) rotate(22deg); }
    74%   { transform: translate(0, 3px) rotate(22deg); }
    75.5% { transform: translate(0, 0) rotate(0deg); }
    100%  { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes pinP5 {
    0%    { transform: translate(0, 0) rotate(0deg); }
    14%   { transform: translate(2px, -3px) rotate(0deg); }
    24%   { transform: translate(1px, 0) rotate(0deg); }
    25.5% { transform: translate(1px, 4px) rotate(26deg); }
    28%   { transform: translate(0, 4px) rotate(26deg); }
    29.5% { transform: translate(0, 0) rotate(0deg); }
    33%   { transform: translate(0, 0) rotate(0deg); }
    33.8% { transform: translate(-4px, 12px) rotate(-14deg); }
    37%   { transform: translate(1px, 1px) rotate(0deg); }
    44%   { transform: translate(2px, 2px) rotate(0deg); }
    72%   { transform: translate(-1px, 0) rotate(0deg); }
    73.5% { transform: translate(-1px, 3px) rotate(20deg); }
    76%   { transform: translate(0, 3px) rotate(20deg); }
    77.5% { transform: translate(0, 0) rotate(0deg); }
    100%  { transform: translate(0, 0) rotate(0deg); }
  }
  /* goliath grouper: a resident of the bottom. Patrols from the piling to mid water and back, hovering for long spells */
  .waves .fish-wrap.fw7 { transform-origin: 34px calc(93% - 16px); animation-name: swimGrouper; animation-duration: 180s; animation-delay: -30s; animation-timing-function: ease-in-out; }
  @keyframes swimGrouper {
    0%   { transform: translate(62vw, 0) scaleX(1); }
    20%  { transform: translate(60vw, -3px) scaleX(1); }
    45%  { transform: translate(24vw, 4px) scaleX(1); }
    60%  { transform: translate(22vw, 1px) scaleX(1); }
    63%  { transform: translate(22vw, 1px) scaleX(-1); }
    88%  { transform: translate(60vw, -2px) scaleX(-1); }
    96%  { transform: translate(63vw, 0) scaleX(-1); }
    100% { transform: translate(62vw, 0) scaleX(1); }
  }
  .waves svg.fish.fish7 { width: 72px; bottom: 7%; opacity: .34; animation-duration: 14s; transition: bottom 2.5s ease-in-out; }
  /* outside sit mode the tab bar covers the bottom 90 px (about 38 % of the water). The grouper rises to sit at the glass's top edge, its back showing
     above the bar as a big slow shadow; when the water rises for sit mode it settles back to the sand. The bonnethead stays on the sand and belongs to sit mode */
  body:not(.dock) .waves svg.fish.fish7 { bottom: 33%; }
  .fish7 use { animation-duration: 4s; transform-origin: 40% 50%; }
  /* spanish mackerel: one quick pass each way, a minute apart (turns happen off screen) */
  .waves .fish-wrap.fw8 { transform-origin: 22px calc(72% - 7px); animation-name: swimMack; animation-duration: 120s; animation-delay: -66s; }
  @keyframes swimMack {
    0%    { transform: translate(112vw, 0) scaleX(-1) rotate(0deg); }
    3.5%  { transform: translate(55vw, -10px) scaleX(-1) rotate(-5deg); }
    7%    { transform: translate(-25vw, 4px) scaleX(-1) rotate(4deg); }
    7.5%  { transform: translate(-25vw, 14px) scaleX(1) rotate(0deg); }
    53%   { transform: translate(-25vw, 14px) scaleX(1) rotate(0deg); }
    57.5% { transform: translate(50vw, 2px) scaleX(1) rotate(-5deg); }
    61.5% { transform: translate(112vw, 12px) scaleX(1) rotate(3deg); }
    99.5% { transform: translate(112vw, 12px) scaleX(1) rotate(0deg); }
    100%  { transform: translate(112vw, 0) scaleX(-1) rotate(0deg); }
  }
  .waves svg.fish.fish8 { width: 44px; bottom: 28%; opacity: .22; animation-duration: 4s; }
  .fish8 use { animation-duration: .6s; }
  /* mangrove snappers: a loose group in the shadow of the dock; they hang, shift, one turns now and then, and all bolt when the blacktip passes under them */
  .waves .fish-wrap.fw9 { inset: auto; right: 4%; bottom: 18%; width: 130px; height: 60px; animation-name: snapStartle; animation-duration: 150s; animation-delay: -100s; animation-timing-function: linear; }
  @keyframes snapStartle { 0%, 4% { transform: translate(0, 0); } 4.5% { transform: translate(-34px, -10px); } 10%, 55% { transform: translate(0, 0); } 55.4% { transform: translate(-22px, 4px); } 61%, 100% { transform: translate(0, 0); } }
  .waves svg.fish.snap { opacity: .3; animation: snapHover 14s ease-in-out infinite alternate; }
  .waves svg.fish.snap use { animation-duration: 2s; }
  .snap.s1 { width: 36px; left: 0;    bottom: 30px; animation-delay: -3s; }
  .waves svg.fish.snap.s2 { width: 30px; left: 44px; bottom: 44px; animation: snapTurn 23s ease-in-out infinite; animation-delay: -9s; }
  .snap.s3 { width: 34px; left: 62px; bottom: 12px; animation-delay: -6s; animation-duration: 12s; }
  .snap.s4 { width: 28px; left: 96px; bottom: 34px; animation-delay: -1s; animation-duration: 19s; }
  @keyframes snapHover { 0% { transform: translate(0, 0); } 40% { transform: translate(-6px, 3px); } 70% { transform: translate(-4px, -4px); } 100% { transform: translate(5px, 2px); } }
  @keyframes snapTurn {
    0%   { transform: translate(0, 0) scaleX(1); }
    38%  { transform: translate(-8px, 3px) scaleX(1); }
    42%  { transform: translate(-8px, 3px) scaleX(-1); }
    78%  { transform: translate(7px, -3px) scaleX(-1); }
    82%  { transform: translate(7px, -3px) scaleX(1); }
    100% { transform: translate(0, 0) scaleX(1); }
  }
  /* blacktip: a steady pass on a slow S every two and a half minutes; bonnethead: low over the sand, the other way, every four */
  .waves .fish-wrap.fw10 { transform-origin: 42px calc(74% - 20px); animation-name: swimShark; animation-duration: 150s; animation-delay: -100s; animation-timing-function: linear; }
  @keyframes swimShark {
    0%   { transform: translate(110vw, 0) rotate(0deg); }
    7%   { transform: translate(74vw, -10px) rotate(3deg); }
    14%  { transform: translate(38vw, 8px) rotate(-3deg); }
    21%  { transform: translate(5vw, -6px) rotate(2deg); }
    28%  { transform: translate(-40vw, 0) rotate(0deg); }
    100% { transform: translate(-40vw, 0) rotate(0deg); }
  }
  .waves svg.fish.blacktip { width: 76px; bottom: 26%; opacity: .18; animation-duration: 12s; }
  .blacktip use { transform-origin: 28% 50%; animation-duration: 1.7s; }
  .waves .fish-wrap.fw11 { transform-origin: 37px calc(95% - 15px); animation-name: swimBonnet; animation-duration: 250s; animation-delay: -60s; animation-timing-function: linear; }
  @keyframes swimBonnet {
    0%   { transform: translate(-35vw, 0) rotate(0deg); }
    9%   { transform: translate(15vw, -8px) rotate(-3deg); }
    18%  { transform: translate(65vw, 4px) rotate(2deg); }
    26%  { transform: translate(112vw, 0) rotate(0deg); }
    100% { transform: translate(112vw, 0) rotate(0deg); }
  }
  .waves svg.fish.bonnet { width: 78px; bottom: 5%; opacity: .26; animation-duration: 12s; }
  .bonnet use { transform-origin: 78% 50%; animation-duration: 1.3s; }

  /* light in the water: two soft shafts of surface light drift and breathe across the fish layer, so the fish sit in water rather than on it.
     Gradients only, animated on transform and opacity. Dimmer at dusk, dimmest at night; slower after 21:00 */
  .waves .light { position: absolute; left: -20%; right: -20%; top: 30%; bottom: 0; pointer-events: none; opacity: .5;
    background:
      linear-gradient(104deg, transparent 20%, rgba(255,255,255,.26) 30%, rgba(255,255,255,.08) 37%, transparent 43%),
      linear-gradient(98deg, transparent 54%, rgba(255,255,255,.2) 62%, rgba(255,255,255,.06) 68%, transparent 73%);
    -webkit-mask-image: linear-gradient(rgba(0,0,0,.9), rgba(0,0,0,.35) 60%, transparent); mask-image: linear-gradient(rgba(0,0,0,.9), rgba(0,0,0,.35) 60%, transparent);
    animation: lightDrift 46s ease-in-out infinite alternate, lightBreathe 19s ease-in-out infinite alternate; }
  html[data-sky="evening"]:not(.night) .waves .light { opacity: .4; }
  html.night .waves .light { opacity: .16; }
  body.late .waves .light { animation-duration: 70s, 28s; }
  @keyframes lightDrift { from { transform: translateX(-4%); } to { transform: translateX(4%); } }
  @keyframes lightBreathe { from { opacity: .4; } to { opacity: .7; } }
  html.night .waves .light { animation-name: lightDrift, lightBreatheNight; }
  @keyframes lightBreatheNight { from { opacity: .08; } to { opacity: .18; } }

  /* night under the lamp. Real dock behaviour: bait gathers in the lamp's glade and the snook holds just below it, nose to the current, and takes one
     fish a cycle. Same 130 s clock and delays, so the strike and the school's burst still land together at 33 %. The glade is the only light on the
     water at night, so the daytime light shafts go; fish inside the glade are brighter than the rest of the night water */
  html.night .waves .light { display: none; }
  html.night .waves .glade { background: rgba(242,201,138,.13); width: 78px; right: 6%; }
  html.night .waves .fish-wrap.fw2 { animation-name: swimSnookNight; }
  html.night .waves svg.fish.fish2 { opacity: .36; }
  @keyframes swimSnookNight {
    0%    { transform: translate(80vw, 10px) scaleX(1) rotate(0deg); }
    14%   { transform: translate(79vw, 12px) scaleX(1) rotate(0deg); }
    26%   { transform: translate(80vw, 9px) scaleX(1) rotate(0deg); }
    31%   { transform: translate(80vw, 8px) scaleX(1) rotate(2deg); }
    31.6% { transform: translate(78vw, 6px) scaleX(1) rotate(5deg); }
    33.2% { transform: translate(69vw, -2px) scaleX(1) rotate(3deg); }
    36%   { transform: translate(66vw, 1px) scaleX(1) rotate(0deg); }
    43%   { transform: translate(65vw, 4px) scaleX(1) rotate(0deg); }
    45%   { transform: translate(65vw, 5px) scaleX(-1) rotate(0deg); }
    60%   { transform: translate(75vw, 11px) scaleX(-1) rotate(-2deg); }
    74%   { transform: translate(82vw, 10px) scaleX(-1) rotate(0deg); }
    77%   { transform: translate(82vw, 10px) scaleX(1) rotate(0deg); }
    100%  { transform: translate(80vw, 10px) scaleX(1) rotate(0deg); }
  }
  html.night .waves .fish-wrap.fw6 { animation-name: swimSchoolNight; }
  html.night .waves svg.fish.pin { opacity: .34; }
  @keyframes swimSchoolNight {
    0%    { transform: translate(74vw, -10px) scaleX(1); }
    16%   { transform: translate(76vw, -7px) scaleX(1); }
    24%   { transform: translate(75vw, -11px) scaleX(1); }
    33%   { transform: translate(75vw, -10px) scaleX(1); }
    33.8% { transform: translate(63vw, -16px) scaleX(1); }
    37%   { transform: translate(65vw, -12px) scaleX(1); }
    40%   { transform: translate(65vw, -12px) scaleX(-1); }
    52%   { transform: translate(73vw, -10px) scaleX(-1); }
    54%   { transform: translate(73vw, -10px) scaleX(1); }
    78%   { transform: translate(76vw, -8px) scaleX(1); }
    100%  { transform: translate(74vw, -10px) scaleX(1); }
  }

```

## 4. CSS: replace the breathe block (`.breath` … up to `.breath-cue small`) with

```css
  /* ---------- breathe: a ring that breathes 4 in, 1 hold, 7 out; after ten breaths, one question ---------- */
  .breath { position: absolute; left: 50%; top: 36%; width: 190px; height: 190px; margin: -95px 0 0 -95px; border-radius: 50%; background: radial-gradient(circle, rgba(var(--orb-rgb),.42), rgba(var(--orb-rgb),.14) 58%, transparent 72%); border: 1.5px solid rgba(var(--orb-rgb),.85); box-shadow: 0 0 90px 30px rgba(var(--orb-rgb),.2); transform: scale(.6); opacity: 0; transition: opacity 2s .8s; }
  /* a second, fainter ring trails the first by a beat, so the in-breath reads as expanding rather than resizing */
  .breath::after { content: ""; position: absolute; inset: -1.5px; border-radius: 50%; border: 1px solid rgba(var(--orb-rgb),.45); transform: scale(1); }
  body.dock .breath::after { animation: breathTrail 12s infinite; }
  body.dock.slow .breath::after { animation: breathTrailSlow 15s infinite; }
  @keyframes breathTrail { 0%, 4% { transform: scale(.94); opacity: .5; } 33.33% { transform: scale(1.12); opacity: .25; } 41.67% { transform: scale(1.14); opacity: .2; } 100% { transform: scale(.94); opacity: .5; } }
  @keyframes breathTrailSlow { 0%, 4% { transform: scale(.94); opacity: .5; } 40% { transform: scale(1.12); opacity: .25; } 46.67% { transform: scale(1.14); opacity: .2; } 100% { transform: scale(.94); opacity: .5; } }
  body.dock .breath { opacity: 1; animation: breathCycle 12s infinite; }
  body.dock.slow .breath { animation: breathCycleSlow 15s infinite; }
  /* 4 in, 1 hold, 7 out. The ring doubles in area on the in-breath (.6 → 1.25) and the glow fills with it; the out-breath is the long slow half */
  @keyframes breathCycleSlow { 0% { transform: scale(.6); opacity: .55; animation-timing-function: cubic-bezier(.4,0,.6,1); } 40% { transform: scale(1.25); opacity: 1; animation-timing-function: linear; } 46.67% { transform: scale(1.25); opacity: 1; animation-timing-function: cubic-bezier(.4,0,.6,1); } 100% { transform: scale(.6); opacity: .55; } }
  @keyframes breathCycle { 0% { transform: scale(.6); opacity: .55; animation-timing-function: cubic-bezier(.4,0,.6,1); } 33.33% { transform: scale(1.25); opacity: 1; animation-timing-function: linear; } 41.67% { transform: scale(1.25); opacity: 1; animation-timing-function: cubic-bezier(.4,0,.6,1); } 100% { transform: scale(.6); opacity: .55; } }
  .breath-cue { position: absolute; left: 0; right: 0; top: calc(36% + 136px); margin: 0; text-align: center; font-size: 15px; font-weight: 500; color: var(--muted); opacity: 0; transition: opacity 1.5s 1s; }
```

## 5. CSS: append the Boca block at the end of the stylesheet (it is scoped to `html[data-place="dock"]` and overrides earlier dock rules)

```css
  /* =============== Boca inlet: the dock place reimagined. Everything below is scoped to html[data-place="dock"] and overrides the rules above =============== */
  /* palette: one oklch family. Water far → deep is a teal run; fish share the water's chroma and move hue (teal shadow, olive, one warm gold, silver flash) */
  html[data-place="dock"]:not(.night) { --sky-top:#B9D3E2; --sky-mid:#D9E7EE; --sky-horizon:#F1F4F1; --bg:#F1F4F1; --scene-back:#A7D4D3; --scene-mid:#63B2B4; --scene-front:#3F9AA1; --water:#63B2B4; --water-deep:#2E7E88; --silhouette:#35545B; --orb-rgb:255,252,240;
    --mangrove:#2E5646; --glare:#FFFFFF; --glare-a:.75; --gust-a:1; --fish:oklch(40% .05 205); --fish-olive:oklch(40% .05 145); --fish-gold:oklch(42% .06 90); --fish-silver:oklch(78% .02 205); }
  /* golden hour: the glare goes orange, the mangroves go black, the wind drops so the cat's-paws fade */
  html[data-place="dock"][data-sky="evening"]:not(.night) { --sky-top:#B9A9B4; --sky-mid:#E8C6AC; --sky-horizon:#F2E4D2; --bg:#F2E4D2; --scene-back:#E3C4A6; --scene-mid:#7FA5A8; --scene-front:#4E7F86; --water-deep:#2F5158; --mangrove:#2A3F38; --glare:#F6C89A; --glare-a:.7; --gust-a:0; --orb-rgb:243,185,138;
    --fish:oklch(38% .05 190); --fish-olive:oklch(38% .05 130); --fish-gold:oklch(42% .07 80); --fish-silver:oklch(80% .05 75); }
  /* night: the app's night palette, water to deep teal, mangroves nearly black, no glare; the lamp glade and the channel markers are the only light */
  html[data-place="dock"].night { --scene-back:#1E3A42; --scene-mid:#183036; --scene-front:#12262C; --water-deep:#0B1A1F; --silhouette:#8FA3AD; --mangrove:#0C1816; --glare:#DDE6EA; --glare-a:.06; --gust-a:.4;
    --fish:oklch(62% .04 205); --fish-olive:oklch(60% .04 150); --fish-gold:oklch(64% .05 90); --fish-silver:oklch(85% .02 205); }
  html[data-place="dock"] .waves path.w1 { fill: var(--scene-back); }
  html[data-place="dock"][data-sky="evening"]:not(.night) .waves::after { background: linear-gradient(rgba(233,169,124,.22), rgba(233,169,124,0) 55%); }
    html[data-place="dock"] .waves .deep { position: absolute; left: 0; right: 0; bottom: 0; height: 30%; background: linear-gradient(transparent, var(--water-deep)); opacity: .55; pointer-events: none; }
  html[data-place="dock"] .waves .swell { position: absolute; inset: 0; }
  /* slow water: long swells. 48 / 40 / 34 s, the middle band against the others; slower still after 21:00 */
  html[data-place="dock"] .waves svg.w1 { animation-duration: 48s; }
  html[data-place="dock"] .waves svg.w2 { animation-duration: 40s; animation-direction: reverse; }
  html[data-place="dock"] .waves svg.w3 { animation-duration: 34s; }
  html[data-place="dock"] .waves .wave-wrap { animation-duration: 8s; }
  html[data-place="dock"] body.late .waves svg.w1 { animation-duration: 70s; }
  html[data-place="dock"] body.late .waves svg.w2 { animation-duration: 60s; }
  html[data-place="dock"] body.late .waves svg.w3 { animation-duration: 50s; }
  html[data-place="dock"] body.late .waves .wave-wrap { animation-duration: 11s; }
  /* the sun straight up: a wide white orb over the middle */
  html[data-place="dock"][data-sky="day"]:not(.night) .orb, html[data-place="dock"][data-sky="morning"]:not(.night) .orb { top: -50px; right: auto; left: 50%; width: 220px; height: 220px; margin-left: -110px; filter: blur(22px); background: radial-gradient(circle, rgba(var(--orb-rgb),.95), rgba(var(--orb-rgb),.35) 45%, transparent 70%); }
  /* wind in the sky: low, flat, stretched clouds */
  html[data-place="dock"] .cloud { filter: blur(1.5px); border-radius: 14px; }
  html[data-place="dock"] .cloud.c1 { top: 12%; width: 190px; height: 14px; animation-duration: 110s; } html[data-place="dock"] .cloud.c1::before { left: 40px; top: -9px; width: 70px; height: 22px; } html[data-place="dock"] .cloud.c1::after { display: none; }
  html[data-place="dock"] .cloud.c2 { top: 21%; width: 120px; height: 10px; opacity: .8; animation-duration: 90s; } html[data-place="dock"] .cloud.c2::before { left: 30px; top: -6px; width: 44px; height: 16px; } html[data-place="dock"] .cloud.c2::after { display: none; }
  html[data-place="dock"] .cloud.c3 { top: 30%; width: 260px; height: 9px; opacity: .6; animation-duration: 130s; } html[data-place="dock"] .cloud.c3::after { left: 120px; top: -5px; width: 80px; height: 14px; } html[data-place="dock"] .cloud.c3::before { display: none; }
  /* birds hanging in the wind: a frigatebird high up, almost still; a gull that holds, then gives up and slides downwind. Both asleep after dark */
  .bird { position: fixed; fill: var(--silhouette); pointer-events: none; z-index: 0; }
  .bird.frigate { top: 9%; left: 62%; width: 22px; height: auto; opacity: .55; animation: hang 16s ease-in-out infinite alternate; }
  .bird.frigate use { transform-box: fill-box; transform-origin: 50% 50%; animation: birdTilt 11s ease-in-out infinite alternate; }
  .bird.gull { top: 36%; left: 0; width: 18px; height: auto; opacity: .45; animation: gullSlide 150s ease-in-out infinite; }
  .bird.gull use { transform-box: fill-box; transform-origin: 50% 50%; animation: birdTilt 7s ease-in-out infinite alternate; }
  @keyframes hang { from { transform: translate(0, 0); } to { transform: translate(-7px, 4px); } }
  @keyframes birdTilt { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }
  @keyframes gullSlide { 0% { transform: translate(105vw, 0); } 30% { transform: translate(70vw, -6px); } 34% { transform: translate(66vw, -8px); } 62% { transform: translate(60vw, -4px); } 100% { transform: translate(-30vw, 10px); } }
  html.night .bird, body.late .bird, html[data-sky="evening"] .bird.gull { display: none; }
  /* mangroves on the far bank, left: one soft canopy mass, no roots; the canopy leans on the shared wind clock */
  .waves svg.mangrove { position: absolute; left: -2%; bottom: 60%; width: 62%; height: 26%; fill: var(--mangrove); opacity: .78; overflow: visible; transform-origin: 50% 100%; animation: canopyWind 90s ease-in-out infinite; }
  .waves svg.mangrove.far { left: 46%; width: 60%; height: 12%; bottom: 62%; opacity: .32; animation-delay: -1.5s; }
  html[data-place="dock"][data-sky="evening"]:not(.night) .waves svg.mangrove { opacity: .9; }
  /* glare: the sun overhead whites out the far water and throws glints across the whole surface */
  .waves .glare { position: absolute; left: 0; right: 0; top: 0; height: 100%; pointer-events: none; background: linear-gradient(color-mix(in srgb, var(--glare) calc(var(--glare-a) * 100%), transparent), color-mix(in srgb, var(--glare) calc(var(--glare-a) * 37%), transparent) 22%, transparent 50%); }
  .glare span { position: absolute; width: 4px; height: 2px; border-radius: 2px; background: var(--glare); opacity: 0; animation: glareGlint 3s ease-in-out infinite; }
  @keyframes glareGlint { 0%, 100% { opacity: 0; } 50% { opacity: .75; } }
  html.night .glare span { display: none; }
  .glare span:nth-child(1) { left: 5%; top: 10%; animation-duration: 5.2s; animation-delay: -0.0s; }
  .glare span:nth-child(2) { left: 42%; top: 63%; animation-duration: 8.6s; animation-delay: -1.3s; }
  .glare span:nth-child(3) { left: 79%; top: 26%; animation-duration: 7.2s; animation-delay: -2.6s; }
  .glare span:nth-child(4) { left: 20%; top: 79%; animation-duration: 5.8s; animation-delay: -3.9s; }
  .glare span:nth-child(5) { left: 57%; top: 42%; animation-duration: 9.2s; animation-delay: -1.2s; }
  .glare span:nth-child(6) { left: 94%; top: 5%; animation-duration: 7.8s; animation-delay: -2.5s; }
  .glare span:nth-child(7) { left: 35%; top: 58%; animation-duration: 6.2s; animation-delay: -3.8s; }
  .glare span:nth-child(8) { left: 72%; top: 21%; animation-duration: 9.6s; animation-delay: -1.1s; }
  .glare span:nth-child(9) { left: 13%; top: 74%; animation-duration: 8.2s; animation-delay: -2.4s; }
  .glare span:nth-child(10) { left: 50%; top: 37%; animation-duration: 6.8s; animation-delay: -3.7s; }
  .glare span:nth-child(11) { left: 87%; top: 0%; animation-duration: 5.2s; animation-delay: -1.0s; }
  .glare span:nth-child(12) { left: 28%; top: 53%; animation-duration: 8.6s; animation-delay: -2.3s; }
  .glare span:nth-child(13) { left: 65%; top: 16%; animation-duration: 7.2s; animation-delay: -3.6s; }
  .glare span:nth-child(14) { left: 6%; top: 69%; animation-duration: 5.8s; animation-delay: -0.9s; }
  .glare span:nth-child(15) { left: 43%; top: 32%; animation-duration: 9.2s; animation-delay: -2.2s; }
  .glare span:nth-child(16) { left: 80%; top: 85%; animation-duration: 7.8s; animation-delay: -3.5s; }
  .glare span:nth-child(17) { left: 21%; top: 48%; animation-duration: 6.2s; animation-delay: -0.8s; }
  .glare span:nth-child(18) { left: 58%; top: 11%; animation-duration: 9.6s; animation-delay: -2.1s; }
  .glare span:nth-child(19) { left: 95%; top: 64%; animation-duration: 8.2s; animation-delay: -3.4s; }
  .glare span:nth-child(20) { left: 36%; top: 27%; animation-duration: 6.8s; animation-delay: -0.7s; }
  .glare span:nth-child(21) { left: 73%; top: 80%; animation-duration: 5.2s; animation-delay: -2.0s; }
  .glare span:nth-child(22) { left: 14%; top: 43%; animation-duration: 8.6s; animation-delay: -3.3s; }
  .glare span:nth-child(23) { left: 51%; top: 6%; animation-duration: 7.2s; animation-delay: -0.6s; }
  .glare span:nth-child(24) { left: 88%; top: 59%; animation-duration: 5.8s; animation-delay: -1.9s; }
  .glare span:nth-child(25) { left: 29%; top: 22%; animation-duration: 9.2s; animation-delay: -3.2s; }
  .glare span:nth-child(26) { left: 66%; top: 75%; animation-duration: 7.8s; animation-delay: -0.5s; }

  /* wind on the water: cat's-paws, dark gusts that slide downwind. g1 rides the shared wind clock and crosses during the gust; g2 and g3 wander on their own */
  .gust { position: absolute; left: 0; width: 70%; height: 10%; opacity: var(--gust-a); background: linear-gradient(90deg, transparent, rgba(30,70,80,.16) 30%, rgba(30,70,80,.16) 70%, transparent); transform: translateX(-80%) skewX(-30deg); animation: gustRun linear infinite; transition: opacity 3s; }
  .gust.g1 { top: 30%; animation: gustClock 90s linear infinite; }
  .gust.g2 { top: 52%; height: 8%; animation-duration: 42s; animation-delay: -18s; }
  .gust.g3 { top: 72%; height: 12%; animation-duration: 50s; animation-delay: -32s; opacity: calc(var(--gust-a) * .7); }
  @keyframes gustRun { from { transform: translateX(-80%) skewX(-30deg); } to { transform: translateX(170%) skewX(-30deg); } }
  @keyframes gustClock { 0%, 30% { transform: translateX(-80%) skewX(-30deg); } 48% { transform: translateX(170%) skewX(-30deg); } 100% { transform: translateX(170%) skewX(-30deg); } }
  /* the shared wind clock: 90 s. Calm, then at 32 % a gust arrives, builds to 40 %, eases off by 52 %. Canopy, rod, line, cat's tail and the cat's-paw all answer it */
  @keyframes canopyWind { 0%, 28% { transform: skewX(-.4deg); } 32% { transform: skewX(-.8deg); } 40% { transform: skewX(-2.6deg); } 46% { transform: skewX(-1.8deg); } 52% { transform: skewX(-.6deg); } 70% { transform: skewX(-.9deg); } 100% { transform: skewX(-.4deg); } }
  .dock .rod-wind { animation: rodWind 90s ease-in-out infinite; transition: none; }
  @keyframes rodWind { 0%, 28% { transform: rotate(0deg); } 34% { transform: rotate(-1.2deg); } 40% { transform: rotate(-3deg); } 46% { transform: rotate(-2.2deg); } 54% { transform: rotate(-.4deg); } 100% { transform: rotate(0deg); } }
  .dock .rod { animation-duration: 6.5s; }
  .dock .fishline { transform-box: fill-box; transform-origin: 50% 0; animation: lineWind 90s ease-in-out infinite; }
  @keyframes lineWind { 0%, 28% { transform: skewX(-2deg); } 36% { transform: skewX(-7deg); } 42% { transform: skewX(-9deg); } 50% { transform: skewX(-4deg); } 64% { transform: skewX(-1deg); } 100% { transform: skewX(-2deg); } }
  html[data-place="dock"] .dock .cat .cat-tail { animation: tailWind 90s ease-in-out infinite; }
  @keyframes tailWind { 0%, 26% { transform: rotate(0deg); } 30% { transform: rotate(-3deg); } 38% { transform: rotate(-9deg); } 44% { transform: rotate(-7deg); } 50% { transform: rotate(-2deg); } 58% { transform: rotate(1deg); } 100% { transform: rotate(0deg); } }
  /* the bobber: rides the front swell all day; on the 130 s fish clock (same delay as the snook) it dips twice at 74 %, then nothing. A ring where the line enters */
  html[data-place="dock"] .dock .cast-bobber { opacity: .7; animation: bobberLife 130s ease-in-out infinite; animation-delay: -18s; transform-box: fill-box; transform-origin: center; }
  @keyframes bobberLife { 0%, 100% { transform: translateY(0); } 10% { transform: translateY(1.2px); } 20% { transform: translateY(-.8px); } 40% { transform: translateY(1px); } 60% { transform: translateY(-1px); } 73.4% { transform: translateY(0); } 73.9% { transform: translateY(2.6px); } 74.4% { transform: translateY(.4px); } 75.1% { transform: translateY(3px); } 75.8% { transform: translateY(0); } 88% { transform: translateY(1px); } }
  html[data-place="dock"] .dock .cast-splash { animation: nibbleRing 130s ease-out infinite; animation-delay: -18s; }
  @keyframes nibbleRing { 0%, 73.8% { transform: scale(.5); opacity: 0; } 74% { opacity: .4; } 77% { transform: scale(3); opacity: 0; } 100% { transform: scale(3); opacity: 0; } }
  /* channel markers on the inlet after dark: red left, green right, on the horizon line. A slow blink each, never together */
  .waves .marker { position: absolute; bottom: 62%; width: 3px; height: 3px; border-radius: 50%; opacity: 0; filter: blur(.3px); }
  .waves .marker.red { left: 18%; background: #E0554A; box-shadow: 0 0 6px #E0554A; }
  .waves .marker.green { left: 88%; background: #4FBF7A; box-shadow: 0 0 6px #4FBF7A; }
  html.night .waves .marker.red { animation: blinkRed 6s linear infinite; }
  html.night .waves .marker.green { animation: blinkGreen 4s linear infinite; animation-delay: -1.3s; }
  @keyframes blinkRed { 0%, 82% { opacity: 0; } 86%, 92% { opacity: .9; } 96%, 100% { opacity: 0; } }
  @keyframes blinkGreen { 0%, 80% { opacity: 0; } 85%, 90% { opacity: .85; } 95%, 100% { opacity: 0; } }
  /* boat wake: the hourly boat passes far off, and a minute later a long slow swell rolls through and lifts the whole water. Also on the "boat + swell now" button */
  .waves .swell { animation: boatSwell 3600s linear infinite; animation-delay: -3480s; }
  @keyframes boatSwell { 0%, 6.5% { transform: translateY(0); } 6.6% { transform: translateY(-4px); } 6.7% { transform: translateY(6px); } 6.8% { transform: translateY(-3px); } 6.9% { transform: translateY(0); } 100% { transform: translateY(0); } }
  body.boatnow .waves .boat, body.boatnow .waves .swell { animation-delay: 0s; }
  /* colour per fish, one fill each */
  .waves svg.fish, .waves svg.fish.near { fill: var(--fish); }
  .waves svg.fish.far { fill: color-mix(in srgb, var(--fish) 62%, var(--scene-mid)); }
  .waves svg.fish.fish2, .waves svg.fish.fish7, .waves svg.fish.fish7.near, .waves svg.fish.snap, .waves svg.fish.snap.near { fill: var(--fish-olive); }
  .waves svg.fish.fish4 { fill: var(--fish-gold); }
  .waves svg.fish.fish1 { animation: tarponRoll 96s ease-in-out infinite, tarponFlash 96s linear infinite; animation-delay: -12s, -12s; }
  @keyframes tarponFlash { 0%, 23.5% { fill: color-mix(in srgb, var(--fish) 62%, var(--scene-mid)); opacity: .2; } 25% { fill: var(--fish-silver); opacity: .7; } 27% { fill: var(--fish-silver); opacity: .6; } 29%, 100% { fill: color-mix(in srgb, var(--fish) 62%, var(--scene-mid)); opacity: .2; } }
  .mullet use { fill: var(--fish); }
  .splash circle { stroke: var(--fish); }
  @media (prefers-reduced-motion: reduce) {
    .bird, .bird use, .waves svg.mangrove, .glare span, .gust, .dock .rod-wind, .dock .fishline, html[data-place="dock"] .dock .cat .cat-tail, .waves .marker, .waves .swell, html[data-place="dock"] .dock .cast-bobber, html[data-place="dock"] .dock .cast-splash { animation: none !important; }
    .glare span { opacity: .35; } .gust { opacity: 0; } html.night .waves .marker { opacity: .6; } html[data-place="dock"] .dock .cast-splash { opacity: 0; }
  }
```

## Behaviour summary (one paragraph per thing, from NOTES-v2.md)

See `NOTES-v2.md` in the same folder for the full per-round, per-species notes. Short version: two shared fish clocks (130 s snook/pinfish/barracuda, 150 s blacktip/snappers), jack phased to the mullet; three depth tiers, one fill each, fish colours via `--fish*`; slow water 48/40/34 s; a 90 s wind clock driving canopy, rod, line, cat's tail and one cat's-paw; glare and glints by day, warm glare at dusk, lamp glade + channel markers at night; bobber nibble and ring once per fish cycle; hourly boat followed by a swell; grouper rides above the tab bar outside sit mode; bigger breathing ring (.6 → 1.25). Reduce Motion: fish and mullet keep moving, everything else stops, all hidden states have a base state.
