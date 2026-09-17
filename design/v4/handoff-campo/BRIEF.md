# Feeling, El campo: design brief

You are iterating on one scene of a live app. Everything you need is in this folder. Start by opening `campo-scene.html`.

## What this is

Feeling is a private mood journal (one HTML file, a PWA, used on a phone at 390 × 844). The Today screen has a living scene in its bottom 42 %. There are three places; **this brief is only about El campo**, which belongs to Elias: a man sitting on the ground in front of a wire fence with a mate in his hands, on the Patagonian steppe in Santa Cruz, Argentina. Behind him a gravel road runs straight to the vanishing point under the Fitz Roy range.

The brief for the whole app, in Paul's words: "maximum calming presence, beautiful, calm, pretty". Every scene should "look natural".

**Where this place stands.** The Florida dock has just been through this same process and came back as a real place (Boca inlet): its own palette per time of day, slow swell, wind on the water, glare, animals on shared clocks that notice each other, three depth tiers. El campo has had none of that yet. It is still the first-pass scene: three static bands of flat colour with animals placed on them. The water places move all the time because water moves. **Here the ground is completely still**, and that is the main gap. On the steppe the thing that is alive is the wind: it never stops in Santa Cruz. The job is to make this land breathe the way the dock's water does, without turning it into a busy scene.

## Files here

| File | What it is |
|---|---|
| `campo-scene.html` | The live El campo scene, extracted from the app (Feeling 49). Self-contained, no scripts needed, all CSS and SVG inline. Buttons at the top switch morning / day / evening / night, sit mode, late mode, and fire one wind gust. |
| `campo-morning.png`, `campo-day.png`, `campo-evening.png`, `campo-night.png` | What the Today screen looks like now at 390 × 844. |
| `campo-day-sit.png`, `campo-night-sit.png` | Sit mode, where the whole scene is visible. |
| `BRIEF.md` | This file. |

## How the scene is built

Everything is inside `<div class="waves campo">` within `#tab-today` (the container keeps the class `waves` because all three places share one engine). Inside it, `.campo-wrap` holds everything. Back to front:

1. Sky (shared by all places): `.sky-breathe`, `.clouds`, `.nightsky` (El campo also gets a faint Milky Way), `.orb` (sun or moon), `.wind`.
2. `svg.band` 1: the range (`.range`), a pink `.alpenglow` copy of the same path that fades out over the first five minutes of a morning, and `.snow` on the peaks.
3. Lenticular cloud, windpump with turning blades, condor.
4. `svg.band` 2: `.steppe-mid`, top edge near 50 % of the scene height. On it: three sheep, the ñandú family, the hare, the guanaco.
5. `svg.band` 3: `.steppe-front` (top edge near 36 %), the `.road` and its centre `.dash` marks. On it: lapwing, piche, the hourly truck, fox.
6. `svg.fence` on the right, which holds the fence, a lamp on the post that glows at night, and the figure. Then the caracara (day) or owl (night) on the fence post, and four coirón grass tufts that sway and lean in a gust.
7. UI glass floats above: greeting, entry card, mic, six faces, Save, and a floating tab bar that **covers the bottom ~90 px of the scene** on the Today screen. Look at `campo-day.png`: most of the road and the near tufts are behind it.
8. Bottles: when a friend sends a word, a small glass bottle lies in the grass on the left (`.bottle` at left 9 %, 24 %, 38 %, about 100 px from the bottom). They live outside the scene and are not part of this brief, but keep that patch of ground calm enough for them to read.

All three bands use `preserveAspectRatio="none"` on a 390 × 240 viewBox, so they stretch; nothing in them scrolls or drifts.

**Sit mode** (`body.dock`, entered by long-pressing the scene; the class is called `dock` for every place): the UI fades out, the scene rises to 44 vh, and a breathing ring appears with the line "Breathe with the wind". This is the best place to judge the scene.

Colours come from CSS variables that change with `html[data-sky]` and `html.night`: `--scene-back` (range), `--scene-mid`, `--scene-front` (steppe), `--scene-land` (road), `--silhouette` (fence, figure, animals, grass). Do not hard-code colours in rules; define or override variables. You may give El campo its own per-sky palette block the way the dock got one, scoped to `html[data-place="campo"]`.

### How an animal is built

```html
<div class="guanaco-wrap">                        <!-- path across the scene -->
  <svg class="guanaco" viewBox="0 0 1446 1536">   <!-- size, fill, opacity -->
    <use href="#f-guanaco"/>                      <!-- the silhouette, from the sprite at the top of the file -->
  </svg>
</div>
```

Simple animals are one `<svg class="amb …"><use/></svg>` with everything on it. Show and hide by time of day with the classes `day-only`, `dusk-only`, `dusk-night`, `night-only`, and `not-dusk`. To make a left-facing silhouette face right, wrap the `<use>` in `<g transform="matrix(-1 0 0 1 W 0)">` where W is the viewBox width; the nose must always lead.

### Who lives here now

| Species | Class | Where | Behaviour, cycle |
|---|---|---|---|
| Andean condor | `.condor-wrap` | over the range, top 10 % | Circles, nearer and farther, tilting. 90 s. Sleeps after 21:00 |
| Guanaco | `.guanaco-wrap` | mid band, left 15 % | Stands and stares; walks 36 px and back. 360 s |
| Sheep × 3 | `.sheep-line` | mid band, far off, left 27 % | Still. Pale against the steppe |
| Ñandú (Darwin's rhea) with two chicks | `.rhea-wrap` | mid band, 43 % | Walks the whole width right to left, a small step bounce. 240 s |
| European hare | `.hare` | 41 % | Hidden most of the time; bolts 120 px in four bounds. 300 s |
| Southern lapwing (tero) | `.lapwing`, day | by the road, 33 % | Runs a few steps, stands. 40 s. Sleeps after 21:00 |
| Piche (dwarf armadillo) | `.piche`, dusk and night | front band, right | Scurries in three short runs. 300 s |
| Grey fox | `.fox`, dusk and night | front band | Trots 160 px right to left. 420 s |
| Chimango caracara | `.caracara`, day | on the fence post | Still |
| Magellanic horned owl | `.owl`, night | on the fence post | Still |
| Also | | | Windpump blades turning, a lenticular cloud over the peak, a truck coming down the road once an hour (headlights after 21:00), alpenglow on a morning, steam from the mate, four grass tufts swaying and leaning in a gust |

## Hard rules (each one comes from something Paul rejected)

1. **The figure is final.** Do not redraw, restyle, or "improve" Elias or his mate. Paul approved those exact paths after three rejected attempts. He sits on the ground in front of the fence; keep him there, clear of the tab bar.
2. **Animals are real species silhouettes from PhyloPic, one path, one fill.** Never build a creature from circles, triangles, or stacked parts, and never use per-part opacity. He rejected that look twice. A new species means a new PhyloPic silhouette (CC0, or CC BY with the credit kept: the lapwing and the owl are CC BY 4.0, Edwin Price).
3. **Species must really live here.** This is the Andean side of Santa Cruz. The mara was already swapped for the European hare because it does not reach this far. Check range before adding anything.
4. **Calm first.** Fast things are tiny and constant (grass, the windpump); big things are rare and slow. Nothing large arrives more often than once a minute, and nothing crosses the screen in under ten seconds, except a small animal on a short burst. On the dock Paul removed two birds as "too much".
5. **Place things on their band.** An animal's feet sit on the top edge of the band it belongs to, and the edges are curves, so compute the ground height at the animal's x. Far animals are small and pale, near ones larger and darker. Nothing floats above its ground or sinks into it.
6. **Scope every scene rule.** Write `.campo .thing`, never a bare class. `<body>` carries state classes (`dock`, `late`, `gust`, `slow`, `listening`), and a bare `.gust` rule once matched `body.gust` and sheared the whole screen. Test any wind effect with the "gust now" button.
7. **Nothing may depend on a keyframe to be hidden.** Under Reduce Motion the app sets `animation: none` on this scene, so anything whose hidden state lives only in a keyframe sits on screen permanently. Give every come-and-go element (hare, fox, piche, truck) a hidden base state. Paul's phone does not have Reduce Motion on, so the moving version is the one he sees; if you want slow motion to continue under Reduce Motion as it does on the dock, say which elements are safe.
8. **CSS and inline SVG only.** No canvas, no JS animation loop, no libraries, no images. The app is one file that works offline. Animate `transform` and `opacity` only, for battery.
9. **After 21:00** (`body.late`) everything slows down and the day birds sleep.
10. **Sound is settled** (one singing bowl per out-breath). It is not part of this brief.

## What to work on

Open questions Paul has not settled, in order of value:

1. **Make the land breathe.** What is this place's equivalent of the dock's swell, cat's-paws and glare? Ideas: wind running through the grass as a wave that travels across the steppe rather than four tufts swaying on their own, many more and smaller tufts with depth, cloud shadows sliding slowly over the mid band, a little dust lifting off the road in a gust, the wire of the fence humming, the mate steam bending with the wind. The wind direction should be one thing everywhere: clouds, grass, steam, dust and the windpump all agree (the prevailing wind here is from the west).
2. **Does the steppe read as one living place?** The animals run unrelated loops. On the dock, shared clocks made animals notice each other. Here: the sheep lift their heads when the fox passes, the hare bolts because the fox is coming, the guanaco stares at the truck, the lapwing scolds and runs when anything comes near the road, the caracara leaves its post and comes back. Residents with a home, visitors with a purpose.
3. **Depth.** Three flat bands. Could the steppe have more planes, haze toward the range, a far fence line or a line of poplars by an estancia, without losing the big empty calm that is the whole point of the place?
4. **Palette per time of day.** Only the sky and a slight tint on the range change at dusk; the ground keeps its noon colour under a pink sky. Propose dawn (El campo is the one place with a real dawn: alpenglow on Fitz Roy), day, golden hour and night palettes for range, steppe, road and silhouettes. Night here is the darkest of the three places: Milky Way, the one lamp on the fence post, the owl.
5. **Too much or too little?** Ten species on a 390 px strip. Say which to cut or make rarer so each one reads, and whether the far animals (sheep, guanaco, windpump) are legible at their size.
6. **The tab bar hides the bottom 90 px** outside sit mode, which is the road and the nearest grass. Decide what belongs to the Today view and what is a reward for sit mode.
7. **The condor at night.** `html.night` also turns on by day when the phone is in dark mode, and then the condor circles in a night sky. Decide what the day animals do in that case.

## How to hand work back

The same way the dock came back:

- One file, `campo-app.html`: this scene file with your changes applied, top bar kept, as the source of truth.
- `HANDOFF.md` with numbered sections that can be applied to the app's `index.html` in order: (1) any new `<symbol>`s for the sprite, with PhyloPic source, author and licence; (2) the full replacement markup for `<div class="waves campo">…</div>`; (3) the CSS to replace, named by the comment it starts at (`/* ---------- El campo argentino: Elias's place.` and the `/* El campo: snow and the pink of Fitz Roy at dawn` block in the ambience section); (4) one new block to append at the end of the stylesheet, scoped to `html[data-place="campo"]`, for palette and overrides.
- Keep the existing class names and the `wrap > svg > use` structure.
- One paragraph per animal saying what it now does and why.
- Check every change at 390 × 844 in morning, day, evening, night, late, and sit mode.
