# Feeling: the scene grammar

Task 1.1 of `PLAN-scene-grammar.md`. Finalised 2026-09-19 against Feeling 57 (`f0271f6`).
Every number below was measured from `index.html` or from a live render at 390 × 844 in sit mode
(`body.dock`, `?place=P&sky=day`, Playwright, `deviceScaleFactor` 1). Where the draft in section 3 of
the plan had a different number, the change and the reason are called out.

Figma: section "v9 — Scene grammar", node id `<filled in by task 1.2>`.

## How to read the numbers

Two frames of reference, used consistently:

- **band %** — a fraction of the height of the `.waves` element, measured up from its bottom edge.
  `.waves` is `28vh` on Today and `44vh` in sit mode (`index.html:359`, `:847`), so band % is the
  unit the CSS itself is written in (`bottom: 62%`) and it holds in both modes. At 390 × 844 in sit
  mode `.waves` is **366.2 px** tall, which is the px conversion used throughout.
- **px** — CSS pixels at 390 × 844. Use this for anything measured off a screenshot.

Frames: `design/v4/shots/{place}-{sky}[-sit|-late].png` and the contact sheet
`design/v4/shots/contact-2026-09-19.png` (task 0.1). The sheet shows all five G-rule failures at a
glance: Key West's wavy sky/water edge against Hawaiʻi's straight one, campo's and Tokyo's low
horizons, and the dock's crowd of fish.

The reference places are **Hawaiʻi** (`design/v4/shots/hawaii-day-sit.png`) for shape, band
and tone, and **Key West's 240 s shore clock** for timing. Where they disagree with each other, the
rule says which one wins and why.

---

## G1 — Four depth bands

Sky · far (the horizon landform: key, pali, range, skyline) · mid (the water or ground plane) ·
near (shore, figure, resident animals). Each band is one flat tone. Nothing spans two bands except
the figure's tree, which is allowed to cross mid and near because it is rooted in near.

**Measured.** The near band's top edge — the wet line where sand meets water — sits at the same
height in the two places that were drawn to a brief: Key West `.sand .lap` top at **32.1 %**
(`index.html:1021`, `svg.sand` viewBox `0 0 390 240`, `lap` path y≈161) and Hawaiʻi `.sand .lap`
top at **31.8 %** (`index.html:1537`). The far band's base is G3. Campo is the outlier: its near
band (`.steppe-front`, `index.html:901`) tops out at **38.7 %** and its mid band
(`.steppe-mid`) at **51.4 %**, so campo's mid band is only 13 points deep against Key West's 30.

**Test.** In sit mode, run a horizontal scanline down the scene crop and count distinct flat
fills between 0 % and 100 % band height: there must be exactly four, with edges at ≈32 % and ≈62 %.

---

## G2 — Atmospheric perspective

Far band renders at **30 %** of the full sky-to-silhouette contrast, mid at **55 %**, near at
**100 %**. Nothing far is darker than anything near.

**Measured.** Compositing each band's fill over that place's `--sky-horizon` and expressing the
result as a fraction of the way to that place's `--silhouette`, in OKLCH L:

| element | file | fill / alpha | tone |
|---|---|---|---|
| dock far mangrove | `index.html:1272` | `--mangrove` @ .32 | **31 %** |
| Hawaiʻi far ridge | `index.html:1447` | `--pali-far` `#A3BDAC` | **32 %** |
| campo range | `index.html:900` | `--scene-back` `#B4B6C4` | **31 %** |
| Key West key | `index.html:987` | `--silhouette` @ .18 | **17 %** |
| Hawaiʻi near ridge | `index.html:1447` | `--pali` `#6F9771` | **55 %** |
| campo near coirón | `index.html:915` | `--silhouette` @ .58 | **55 %** |
| dock near mangrove | `index.html:1271` | `--mangrove` @ .78 | **77 %** |
| dock figure | `index.html:1728` markup | `--silhouette` @ 1 | **100 %** |
| Key West figure + palm | `index.html:1043` | `--silhouette` @ .55 | **53 %** |
| Hawaiʻi figure + palms | `index.html:1564` | `--silhouette` @ .60 | **57 %** |
| campo figure + fence | `index.html:931` | `--silhouette` @ .55 | **52 %** |

**Changed from the draft.** Far was 25 %; three places independently landed on 31–32 %, so the
rule is **30 %**. Mid stays 55 % — it was already right, twice over.

**Open failure this exposes.** Only the dock reaches a 100 % near tier. Key West, Hawaiʻi and campo
draw their nearest objects — the figure, the palm, the resident birds — at 52–57 %, i.e. at the
*mid* tone. That is why those three read flat: they have a far, a middle and another middle.
Raising the near tier to full `--silhouette` is the cheapest depth win in the app.

**Test.** Sample the scene crop at three points (far landform, mid plane, the figure), convert to
OKLCH L, and check `(L_sky − L_sample) / (L_sky − L_silhouette)` reads 0.30 / 0.55 / 1.00 ± 0.05.

---

## G3 — Horizon line

The far band's base sits at **62 % band height** in every place. Switching places feels like the
same window.

**Measured.** Three places already agree, to a tenth of a percent:

- dock `.waves svg.mangrove.far { bottom: 62%; }` — `index.html:1272`, rendered base **62.1 %**
- Key West `.keywest svg.key { bottom: 62%; }` — `index.html:986`, rendered base **62.1 %**
- Hawaiʻi `.hawaii svg.pali { bottom: 62%; }` — `index.html:1477`; `.far`, `.near`, `.point` and
  `.moku` all render with base **62.0 %**, and `.caps` and `.shower` are pinned to the same 62 %

Campo and Tokyo do not:

- campo's sky/land line is `.steppe-mid` at **51.4 %** and the range foot at ≈50 % (`index.html:1808`
  markup, `translate(0,-58)` on a `0 0 390 240` viewBox) — **11 points low**
- Tokyo's `.tk-farSkyline` baseline is y=234 in a fixed 420 px scene anchored to the bottom
  (`index.html:1586`, `:1947`), i.e. **186 px** above the band floor. Because it is px and not %,
  it lands at **50.8 %** in sit mode and **78.8 %** on Today — the only place whose horizon moves
  when you long-press.

At 390 × 844, 62 % of the band puts the horizon **72.7 %** down the screen in sit mode and
**82.6 %** down on Today.

**Changed from the draft.** 61 % → **62 %**. 61 % came from the old "back crest drifts 61–79 %"
note; the current dock `w1` crest actually sweeps 66.5–73.1 % (see G5), and 62 % is what three
places write in CSS today.

**Test.** Shoot the five sit-mode day frames, overlay a horizontal rule at 72.7 % of screen height,
and check the sky/land edge touches it in all five.

---

## G4 — Silhouettes only

Filled paths. No stroke outlines, no gradients inside a shape. Soft edges (blur, feathered opacity)
only on sky, mist, glare, cloud caps and the water surface. Crisp edges on land, figure and fauna.

**Measured.** Every animal in the app is one `<use href="#f-…">` of a PhyloPic path with one fill —
24 in the dock, 14 campo, 15 Key West, 7 Hawaiʻi. Stroke use is already down to five CSS rules per
place, and each is a deliberate line rather than an outline: campo the coirón blades and the
figure's arm (`index.html:912`, `:934`), Key West and Hawaiʻi the cats' tails and the arm
(`index.html:1036`, `:1044`, `:1571`), Hawaiʻi additionally `.pali .flutes` and `.pali .spurs`
(`index.html:1480`, `:1481`) at opacity .16 and .2 — surface texture on a filled ridge, which is
allowed. Tokyo is the exception with **16 `stroke-width` attributes and 6 gradients** in its markup
(`index.html:1947`), because it is a drawn city rather than a silhouette landscape.

**Test.** `grep` the place's markup block for `stroke=` and `Gradient`; anything above the Hawaiʻi
count of 4 / 0 needs a written reason. Visually: crop the far landform at 4× and look for a
lighter or darker rim — there must not be one.

---

## G5 — Water

1. **The crest that meets the sky is a line, not a wave: ≤ 3 px peak-to-peak.**
2. Inner water edges may wave, ≤ 27 px peak-to-peak, and no two edges within 12 % band height.
3. Wavelength ≥ 195 px — half the screen width.
4. Surface scroll (`drift`) period ≥ 34 s; rise and fall (`bob`, `kwSwell`) ≤ 4 px on a ≥ 7 s loop.

**Measured.** Sampling the actual bezier paths in the markup (not the control points):

| band | peak-to-peak | wavelength | scroll |
|---|---|---|---|
| Hawaiʻi `w1` (`index.html:1918`) | **2.1 px** (0.58 % band) | 195 px | 70 s (`:1468`) |
| Key West `w1` (`index.html:1871`) | **26.7 px** (7.28 %) | 195 px | 60 s (`:1392`) |
| dock `w1` (`index.html:1732`) | **24.1 px** (6.57 %) | **71 px** | 48 s (`:1245`) |
| Key West / Hawaiʻi `w2` (shared path) | 26.2 px | 195 px | 46 s / 52 s |
| Key West / Hawaiʻi `w3` (shared path) | 9.6 px | 195 px | 38 s / 40 s |

Key West and Hawaiʻi use the **identical** `w2` and `w3` path data. The only thing that makes one
read as a lagoon and the other as stripes is `w1`: Hawaiʻi's is a 2 px line, Key West's is a 27 px
sine, so Key West has no horizon at all. That is the single highest-value fix in the plan.
`bob` displacement is 4 px everywhere (`index.html:377`); its period is 7 s in Hawaiʻi
(`index.html:1465`), 8 s on the dock (`index.html:1248`) and 9 s in Key West (`index.html:1394`).
The 14 / 11 / 9 s `drift` at `index.html:363`–`:365` is only the base; every place overrides it,
so nothing in the app actually scrolls water that fast.

**Changed from the draft.** "Amplitude ≤ 1.5 % of scene height" (≈5.5 px) was both too loose for the
horizon crest and too tight for the inner edges, so it splits into rules 1 and 2. "Wavelength ≥ 60 %
of scene width" → **50 %**: 195 px is what Hawaiʻi and Key West already draw, and asking for more
flattens the water to nothing. "Translate ≤ 4 px on a ≥ 20 s loop" was describing two different
motions: `drift` is a seamless −50 % scroll of a repeating path, not a 4 px translate, so it gets its
own floor of **34 s** — the fastest band shipped anywhere is the dock's `w3` at 34 s — and the 4 px
cap stays on `bob`, whose shortest shipped period is Hawaiʻi's 7 s.

**Test.** In the standalone place file, freeze `drift` and measure the sky/water edge's highest and
lowest y across one full wavelength; it must be within 3 px. Or: screenshot, crop the top 40 px of
the water, and check the edge is straight to the eye.

---

## G6 — Scale ruler

The unit is **the seated figure = 1.0 = 31 px** at 390 × 844 in sit mode. (`.person` bbox measures
30.7 px in both Key West and Hawaiʻi — Paul's Calm Presence figures at their shipped scale.)

| kind | allowed | measured |
|---|---|---|
| palm, ironwood — the only things taller than the figure | 3.0 – 5.0 | Hawaiʻi ironwood 100 px = **3.3**, tallest Hawaiʻi palm 150.7 px = **4.9**, Key West palm 152 px = **4.95** |
| near-band resident on the sand or grass | 0.25 – 0.65 | Hawaiʻi ʻakekeke 9 px = **0.29**, honu 22 px = **0.65**, Key West rooster 18 px = **0.59**, cats 18–29 px = 0.59–0.94 |
| flyer above the horizon | wingspan ≤ 1.0, and smaller the higher it flies | Hawaiʻi koaʻe 30 px wide at 82 % band, ʻiwa 16 px at 92 % band |
| anything on the far band | **never taller than the landform it stands on** | Hawaiʻi Mokoliʻi 26.9 px against a 129 px pali ✔; **Key West lighthouse 22 px on a key 15.7 px tall ✘** |

**Changed from the draft.** "Palm or tree 1.6 to 2.2" was measured against a standing figure that
does not exist in this app — every figure is seated. Against the seated figure the two shipped palms
are 4.9 and 4.95, so the range is **3.0 – 5.0**. "Birds in flight ≤ 0.35" is unmeasurable for a
wings-spread silhouette whose height and width differ by 2×, so it becomes a wingspan cap plus a
monotonicity rule. "Ground animals 0.15 to 0.4" was below everything that actually ships; the
reference place sits at 0.29–0.65.

**Failures this exposes.** Key West's egret is **34 px = 1.11**, taller than the seated man beside
it, and its frigatebird is 28.3 px = 0.92 while flying at 74 % band. Its lighthouse is 1.4× its own
island. These are the scale contradictions the brief called out, now with numbers.

**Test.** In the render, get the bbox of `.person` and of the element in question and divide.
For the far band, compare the object's bbox height with the bbox height of the path under it.

---

## G7 — One hue family per place

Sky, water and land are tints and shades of one family plus one warm accent (`--orb`, `--sand`).
**Chroma cap: OKLCH C ≤ 0.090 on any surface that is not the hero; the hero may reach 0.105.**
Silhouette colour is a darkened sky, not a neutral grey. Never hard-code a colour inside a scene
rule — add or override a variable.

**Measured.** Max chroma across `--scene-back/-mid/-front/-land` and the place's extra surfaces,
in the runtime day palette:

| place | max surface C | where |
|---|---|---|
| Tokyo | 0.058 | `--scene-back` |
| Key West | **0.082** | `--scene-mid` `#78CCCB` (`index.html:1383`) |
| dock | 0.086 | `--scene-front` `#3F9AA1` |
| campo | 0.090 | `--scene-front` `#BFA765` |
| Hawaiʻi | **0.102** | `--scene-mid` `#62D1C9` (`index.html:1446`) — the lagoon, its hero |

Silhouettes are all dark, low-chroma versions of their sky: dock L 0.398 C 0.024, campo L 0.395
C 0.017, Key West L 0.384 C 0.026, Hawaiʻi L 0.372 C 0.032. That part of the draft was already true.

**Changed from the draft, and a correction to the plan's diagnosis.** The cap was 0.10 flat, which
the reference place itself fails at 0.102. More importantly, section 2 item 4 of the plan says Key
West's water is "the most saturated surface in the app". Measured, it is not — Key West's most
saturated surface is C 0.082 and Hawaiʻi's is C 0.102. Key West's water problem is **value banding
with a broken horizon (G5), not chroma**: its three bands sit at L 0.711 / 0.792 / 0.880, steps of
0.08, each with a hard 27 px wavy edge. Hawaiʻi's steps are *larger* (L 0.655 / 0.794 / 0.880) and
still read as one lagoon, because its top edge is a 2 px line. Fix G5 before touching Key West's
chroma; then bring `--scene-mid` down to ≤ 0.090 and spend the saved saturation on the hero.

**Test.** Convert every `--scene-*` in the place's palette block to OKLCH and check C. A single
line of Node; `lint.mjs` already reads these blocks for hard-coded hex.

---

## G8 — One hero per place

Exactly one element per place may exceed the chroma cap or carry a light effect (glow, glint, beam,
drop-shadow). Everything else is flat fill.

**Measured.** Hawaiʻi is the only place that currently spends its whole chroma budget in one place:
`--scene-mid` at C 0.102 is the lagoon, and nothing else in the place is near it (`--pali` 0.071,
`--pali-far` 0.037, `--scene-land` 0.025). Tokyo does the same with light instead of chroma — every
`filter: drop-shadow` and blur in the place is on Godzilla's breath or the fires it lit
(`index.html:1595`, `:1624`–`:1628`), while the city and bay are flat at C ≤ 0.058. Key West spreads
its light across five things: `.glitter` (`index.html:733`), the lighthouse `.beam`
(`index.html:1163`), `.setting-sun` and `.sunpath` (`:1150`, `:1152`), `.green-flash` (`:1154`) and
`.crux` twinkle (`:1027`) — five heroes is no hero.

Heroes are listed per place in the table at the bottom.

**Test.** Count elements in the place's rules carrying `filter:`, `drop-shadow`, a `glint`/`glare`/
`beam` keyframe, or a surface above C 0.090. The answer must be one.

---

## G9 — Three motion tiers

- **Ambient** — always on, never an event. Water scroll period ≥ 34 s; any rise, sway or flutter
  ≤ 4 px displacement on a ≥ 4 s loop. No more than ~20 ambient targets in a place.
- **Resident** — one animal per band, cycle ≤ 240 s, exactly one visible event per cycle (a peck,
  a step, a roll, a breath).
- **Visitor** — crosses the scene, one at a time, ≥ 120 s apart, on the place's shared clock.

**Measured, ambient.** Hawaiʻi's ambient tier is 12 targets and its slowest-to-fastest water is
70 / 52 / 40 s (`index.html:1468`–`:1470`), with `bob` 4 px on 7 s and cloud caps on 90–120 s
(`index.html:1488`). Key West is 18 targets, 60 / 46 / 38 s (`index.html:1391`–`:1393`). The dock
runs 57 ambient targets at 14 / 11 / 9 s (`index.html:363`–`:365`) with a 3 s `bob` — three to five
times faster than the reference for the same kind of surface. Campo is the worst offender in the
app: **173 ambient targets**, of which 135 are individual coirón blades on `bladeFlutter` at
1.7 s / 2.3 s / 1.4 s (`index.html:924`–`:926`). Nothing at 1.4 s belongs in an ambient tier.

**Measured, resident and visitor.** Key West is the model: `egretDay`, `roosterWalk`, `peck`,
`henSpit`, `cudaPatrol` (`index.html:1002`), `schoolPass` (`:1006`), `bonnetPass` (`:1012`),
`roosterWalk` + `peck` (`:1053`, `:1055`), `egretDay` (`:1188`) and `dolphinKW` (`:1191`) all run 240 s, each with a
single event inside the cycle (the egret's one flight at 41–43 %, the rooster's walk at 38 % and
return at 56 %). Hawaiʻi's residents are slower still: honu 320 s, ʻakekeke 60 s, ʻōhiki 200 s,
koholā 240 s, the trade shower 900 s.

**Changed from the draft.** The ambient floor was "loop ≥ 20 s, displacement ≤ 4 px", which lumped
the seamless water scroll together with the 4 px bob. Split: scroll ≥ 40 s (Hawaiʻi's slowest three
are 70/52/40 s), everything else ≤ 4 px on ≥ 5 s (Hawaiʻi `bob` 7 s, `crownSway` 5 s). Resident
cycle "≤ 3 min" becomes **≤ 240 s** so it is the same number as G11's clock. Visitor spacing
"≥ 2 min apart" becomes ≥ 120 s, i.e. half the shore clock, for the same reason.

**Test.** `lint.mjs` row: count ambient targets, and flag any rule reachable from the place whose
duration is under 5 s or whose `drift` is under 40 s.

---

## G10 — Movers cap: three

At most **three** non-ambient things visibly moving at once. Paul confirmed 3 on 2026-09-19; the
measurement below confirms it is also where the best-looking place already sits.

**Measured.** Pausing every animation in the scene, stepping a virtual clock across 15 minutes in
5 s samples, and at each sample counting top-level actors whose bbox moves ≥ 1.5 px or whose
opacity changes ≥ 0.15 over a 2 s window (water, sway, glitter, caps, blades and other ambient
targets excluded):

| place | median movers | over the cap of 3 | worst window |
|---|---|---|---|
| **Hawaiʻi** | **3** | **17 % of windows** | 5 (koaʻe, ʻiwa, honu, two ʻakekeke) |
| Key West | 5 | 96 % | 8 |
| campo | 6 | 99 % | 9 |
| Tokyo | 6 | 99 % | 7 (but Godzilla, boat and reflections are one actor drawn in parts — really ≈3) |
| dock | **17** | 99 % | 21 |

Hawaiʻi sits at a median of exactly 3 and is the place nobody complains about. The dock's 17 is
almost all fish: eleven `fish-wrap` swim cycles plus four snappers, all visible at once.

**Test.** Re-run the census above per place; the median must be ≤ 3 and the worst window ≤ 4. A pair
of the same species moving together (two turnstones, three mullet) counts as one actor.

---

## G11 — Shared clock

Residents and visitors read one `animation-duration` base per place, plus its halves, quarters and
simple multiples, so events can answer each other. No animal on a private loop.

**Measured.** Key West is the reference here, not Hawaiʻi. Of Key West's non-ambient animations,
**six run at exactly 240 s** and the rest are multiples of it: 300 s (1.25×, the wet line and wrack)
and 360 s (1.5×, the pelican) — `index.html:1002`, `:1006`, `:1012`, `:1018`, `:1025`, `:1053`,
`:1055`, `:1166`, `:1188`, `:1191`. Hawaiʻi has 12 non-ambient animations on **11 different periods** — 900, 320, 300,
240, 200, 150, 120, 105, 90, 70, 60 s — so nothing there can ever answer anything else. The dock uses
38 distinct durations across 102 animations.

Recommended base per place: **240 s** for Key West (already), and 240 s for Hawaiʻi, campo and the
dock so one number governs the app. Tokyo keeps its script-driven breath cycle.

**Test.** `lint.mjs` prints the distinct non-ambient durations per place; every value must be
240 × n or 240 / n for small integer n.

---

## G12 — Cast

**Six to eight named actors per place.** An actor is a species, or a vehicle, or a machine — anything
a person would point at and name. A pair or a small group of one species is one actor.

**Measured.** Distinct PhyloPic species inside each `.waves` block:

| place | species | plus | total actors |
|---|---|---|---|
| **Hawaiʻi** | **6** — koaʻe kea, koholā, ʻiwa, honu, ʻakekeke, ʻōhiki | 2 cats | **8** ✔ |
| Tokyo | 0 | Godzilla, 2 helicopters, rowboat, city fires, searchlights | **5** ✔ |
| campo | 10 — condor, sheep, ñandú, hare, guanaco, tero, piche, fox, chimango, owl | truck, poplars | **12** ✘ |
| Key West | 12 — gull, dolphin, pelican, frigatebird, barracuda, mullet, bonnethead, turtle, hen, ghost crab, egret, rooster | 2 cats, schooner | **15** ✘ |
| dock | 14 — tarpon, snook, jack, barracuda, pinfish, grouper, mackerel, mangrove snapper, blacktip, bonnethead, mullet, dolphin, egret, manatee | cat, dragonfly, boat | **17** ✘ |

Hawaiʻi at 8 is the proof the rule works: it is the place that reads as drawn by one hand, and it
holds a third of Key West's cast.

**Changed from the draft.** "Six to eight species" → "six to eight **named actors**", so Tokyo, whose
cast is a kaiju and two helicopters and contains no `<use>` at all, can be scored on the same rule.

**Test.** Count distinct `href="#f-…"` values in the place's markup block and add the non-fauna
actors by hand. `lint.mjs` prints the first half.

---

## Per-place hero and cast

Hero = the one element allowed above the chroma cap or carrying a light effect (G8).
Cast = the target after the re-cut; ✘ marks an actor to drop.

| place | hero | far band | cast (target) | drop |
|---|---|---|---|---|
| **dock** (Boca) | the fish under the boards — the tarpon's silver roll, `tarponFlash` | mangrove bank, 62 % | tarpon (visitor), snook (resident, piling), mangrove snapper group (resident, under the dock), pinfish school (resident), grouper (resident, bottom), great blue heron (resident, shallows), dolphins (visitor), Paul's cat (near) — **8** | jack, barracuda, mackerel, blacktip, bonnethead, mullet, manatee, dragonfly ✘ |
| **campo** (Santa Cruz) | the road running into the range | the Andes range — lift its base from 50 % to 62 % | guanaco (resident, mid), ñandú + chicks (visitor), condor (ambient-high, resident), tero (resident, road edge), chimango by day / owl by night on the fence post (resident, near), grey fox (visitor, dusk), sheep line (resident, far), the truck (visitor, hourly) — **8** | hare, piche, poplars ✘ |
| **keywest** | the lagoon light — glitter on the flats by day, the lighthouse beam at night | the key + lighthouse, 62 %, at 30 % tone, lighthouse **shorter than its key** | frigatebird (visitor, high), pelican (visitor, one dive), green turtle (resident, mid), great egret (resident, wet line — **shrink below 1.0**), hen (resident, near), rooster (visitor, along the sand), dolphins (visitor, dusk), ghost crab (resident, night) — **8** | gull, iguana, mullet, barracuda, bonnethead, school, cats (unless Paul asks for them back) ✘ |
| **hawaii** (Kaʻaʻawa) | the lagoon, `--scene-mid` C 0.102 — the one surface over the cap | Koʻolau pali + Mokoliʻi, 62 %, far ridge at 32 % | koaʻe kea (visitor, glide), ʻiwa (ambient-high, resident), koholā (visitor, seasonal), honu (resident, shallows), ʻakekeke pair (resident, wet line), ʻōhiki (resident, night), Nick's two cats (near) — **7** | nothing; trim movers instead (G10 worst window 5) |
| **tokyo** | Godzilla — the atomic breath, the only light in the place | city skyline, fixed 186 px — **re-pin to 62 % band** | Godzilla (hero, resident breath cycle), rowboat with Paul (near, ambient rock), two helicopters (visitor pair), the burning city (ambient), searchlights (ambient) — **5** | nothing; G2 tone tiering and G3 horizon are its work |

---

## Summary of changes to the draft in `PLAN-scene-grammar.md` section 3

| rule | draft | final | why |
|---|---|---|---|
| G2 | far 25 % | far **30 %** | dock 31 %, Hawaiʻi 32 %, campo 31 % |
| G3 | 61 % | **62 %** | three places write `bottom: 62%` today |
| G5 | amplitude ≤ 1.5 % | horizon crest **≤ 3 px**, inner edges ≤ 27 px | Hawaiʻi `w1` is 2.1 px, Key West `w1` is 26.7 px with identical `w2`/`w3` |
| G5 | wavelength ≥ 60 % width | **≥ 50 %** (195 px) | what both shipped places already draw |
| G5 / G9 | translate ≤ 4 px on ≥ 20 s | scroll ≥ 40 s, rise/fall ≤ 4 px on ≥ 5 s | `drift` is a seamless −50 % scroll, not a 4 px translate |
| G6 | tree 1.6–2.2× figure | **3.0–5.0×** | measured against the seated figure, the only one that exists |
| G6 | birds ≤ 0.35 | wingspan ≤ 1.0, shrinking with height | height is meaningless for a wings-spread silhouette |
| G6 | ground animals 0.15–0.4 | **0.25–0.65** | Hawaiʻi ships 0.29–0.65 and looks right |
| G7 | C ≤ 0.10 everywhere | **≤ 0.090 non-hero, ≤ 0.105 hero** | Hawaiʻi, the reference, is at 0.102 |
| G9 | resident ≤ 3 min, visitor ≥ 2 min | **≤ 240 s / ≥ 120 s** | same number as the shore clock in G11 |
| G10 | 3 | **3**, unchanged | Paul confirmed, and Hawaiʻi's median is exactly 3 |
| G12 | 6–8 species | 6–8 **named actors** | Tokyo has no species at all |

And one correction to the diagnosis in section 2: **item 4 is wrong.** Key West's water is not the
most saturated surface in the app (C 0.082 against Hawaiʻi's 0.102). Its problem is a 27 px wavy
horizon crest — G5, not G7.
