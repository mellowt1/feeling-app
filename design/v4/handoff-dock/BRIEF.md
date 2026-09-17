# Feeling, Florida dock: design brief

You are iterating on one scene of a live app. Everything you need is in this folder. Start by opening `dock-scene.html`.

## What this is

Feeling is a private mood journal (one HTML file, a PWA, used on a phone at 390 × 844). The Today screen has a living scene in its bottom 42 %. There are three places; **this brief is only about the Florida dock**, which belongs to Paul: a man fishing off a dock on still Gulf-coast water, with his ragdoll cat beside him.

The brief for the whole app, in Paul's words: "maximum calming presence, beautiful, calm, pretty". For the water: it should "feel live", and the fish should "feel alive in their own ecosystem". His last note, after the current version: "it looks better", and he wants to keep iterating. The earlier complaint was that the fish "all kind of glide" in one direction like a conveyor belt.

## Files here

| File | What it is |
|---|---|
| `dock-scene.html` | The live dock scene, extracted from the app (Feeling 37). Self-contained, no scripts needed, all CSS and SVG inline. Buttons at the top switch morning / day / evening / night, sit mode, and late mode. |
| `dock-day.png`, `dock-evening.png`, `dock-night.png`, `dock-night-sit.png` | What it looks like now at 390 × 844. |
| `BRIEF.md` | This file. |

## How the scene is built

Everything is inside `<div class="waves">` within `#tab-today`. Back to front:

1. Sky: `.sky-breathe`, `.clouds`, `.nightsky`, `.orb` (sun or moon), `.wind`.
2. Three wave bands, each an SVG path that drifts sideways: `svg.w1` (back, its crest moves between 61 % and 79 % of the scene height), `svg.w2` (mid), `svg.w3` (front, crest near 32 %).
3. Between the waves: dolphins, manatee, heron, dragonfly, distant boat, sun glitter, the dock with the figure and cat, then the fish.
4. UI glass floats above: greeting, entry card, mic, six faces, Save, and a floating tab bar that **covers the bottom ~90 px of the water** on the Today screen.

**Sit mode** (`body.dock`, entered by long-pressing the scene): the UI fades out, the water rises to 44 vh, and a breathing circle appears. This is where the whole water column is visible, so it is the best place to judge the fish.

Colours come from CSS variables that change with `html[data-sky]` and `html.night`: `--accent` (fish), `--silhouette` (dock, figure, cat, heron), and the wave fills. Do not hard-code colours; use the variables.

### How a fish is built

```html
<div class="fish-wrap fw2">            <!-- path: translate() scaleX() rotate(), origin on the fish -->
  <svg class="fish fish2" viewBox="…"> <!-- bob, size, depth (bottom: N%), opacity -->
    <use href="#f-snook"/>             <!-- tail sway, pivots behind the head -->
  </svg>
</div>
```

- The wrap's keyframes are the choreography. `scaleX(-1)` is a turn; animating it over ~2 % of the cycle reads as the fish foreshortening and facing the other way.
- Pitch: nose up is `rotate(+)` for left-facing art, `rotate(-)` for right-facing art. It stays correct through a `scaleX` flip.
- **Which way the art faces:** tarpon, snook, jack, barracuda, grouper, blacktip, bonnethead, mullet, second snapper face **left**. Pinfish, mackerel, snapper face **right**. The nose must always lead. (The mackerel swam tail first until yesterday.)

### Who lives here now

| Species | Class | Depth (`bottom`) | Behaviour, cycle |
|---|---|---|---|
| Tarpon | `fw1` | 34 % | Crosses left, climbs to roll at the surface, sinks; returns right, deeper. 96 s |
| Snook | `fw2` | 40 % | Resident. Holds by the piling facing the current, darts at the pinfish, coasts, turns, drifts home. 52 s |
| Jack crevalle | `fw4` | 36 % | One fast dipping pass, long gap, back the other way. 120 s |
| Barracuda | `fw5` | 22 % | Arrives, hangs dead still for ~50 s, gone in a flash. 150 s |
| Pinfish × 5 | `fw6` | 40–47 % | School wanders, stops to feed nose-down, flinches, turns as a group. 130 s |
| Goliath grouper | `fw7` | 7 % | Resident. Patrols the bottom, long hovers. 180 s (mostly hidden behind the tab bar outside sit mode) |
| Spanish mackerel | `fw8` | 28 % | Two quick passes back to back, long gap. 120 s |
| Mangrove snapper × 4 | `fw9` | under the dock | Hang in the dock's shadow; one turns now and then; all bolt when the blacktip passes beneath. 150 s, synced to the shark |
| Blacktip | `fw10` | 26 % | Slow S-curve pass every 2.5 min |
| Bonnethead | `fw11` | 5 % | Low over the sand, left to right, every ~4 min |
| Mullet × 3 | `mu1–3` | surface | Jump with a splash ring, one every ~13 s |
| Also | | | Dolphin pair in the back water, manatee at dusk and night, great blue heron in the left shallows, dragonfly by day, a boat on the horizon once an hour |

## Hard rules (each one comes from something Paul rejected)

1. **The figure and the cat are final.** Do not redraw, restyle, or "improve" the man, the rod, the cat, or the dock. Paul approved those exact paths after three rejected attempts.
2. **Animals are real species silhouettes from PhyloPic, one path, one fill.** Never build a creature from circles, triangles, or stacked parts, and never use per-part opacity. He rejected that look twice. A new species means a new PhyloPic silhouette (CC0 or CC BY with the credit kept).
3. **No pelican and no osprey on the dock.** He removed both ("too much").
4. **Calm first.** The rule for every place: fast things are tiny and constant (a tail, the water), big things are rare and slow. Nothing large arrives more often than once a minute, and nothing crosses the screen in under ten seconds, except a small fast fish on a short burst.
5. **Place things by wave band, never by the sky.** The back crest drifts 61–79 %, so anything pinned in that range floats or sinks half the time. Horizon things sit at `bottom: 62 %` drawn right after `w1`; waders stand below the front crest.
6. **The fish layer keeps moving under Reduce Motion.** Paul's phone has Reduce Motion on, so that is the version he actually sees. Waves, clouds and UI stop; `.fish-wrap`, its children and the mullet do not. Anything whose hidden state lives only in a keyframe must also have a hidden base state, or it will sit on screen permanently (this caused frozen fish with rings around them).
7. **CSS and inline SVG only.** No canvas, no JS animation loop, no libraries, no images. The app is one file that works offline. Animate `transform` and `opacity` only, for battery.
8. **After 21:00** (`body.late`) everything slows down and the day animals sleep.

## What to work on

Open questions Paul has not settled, in order of value:

1. **Does the water read as an ecosystem?** Predator and prey that notice each other, residents with a home, visitors with a purpose, more variety in depth and pace. Ideas welcome: a school that parts around the barracuda, the snook's strike actually scattering the pinfish, fish that use the dock's shadow, something small living on the pilings, a stingray on the sand.
2. **Too much or too little?** Eleven species share a 390 px strip. Say which to cut or make rarer so each one reads.
3. **Depth.** Every fish is the same flat tint at opacity 0.2–0.32. Could far fish be smaller, paler and slower, and near fish larger, without breaking the one-fill silhouette rule?
4. **Dusk and night.** Not yet tuned on a real phone. Night has a dock lamp and a moon glade. What does the water do at night (snook under the light is real Florida dock behaviour)?
5. **The tab bar hides the bottom 90 px** outside sit mode, so the grouper and bonnethead are nearly invisible there. Rearrange depths, or accept that they belong to sit mode.

## How to hand work back

- Keep the class names and the `fish-wrap > svg.fish > use` structure so the result can be pasted over the same block in the app's `index.html`.
- Return the changed CSS (the block that starts at the comment `/* living water: …`) and any changed markup inside `<div class="waves">`, plus one paragraph per species saying what it now does and why.
- If you add a species, include its PhyloPic source, author and licence.
- Check every change at 390 × 844 in day, evening, night, and sit mode.
