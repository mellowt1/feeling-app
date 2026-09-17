# Feeling, Key West: design brief

You are iterating on one scene of a live app. Everything you need is in this folder. Start by opening `keywest-scene.html`.

## What this is

Feeling is a private mood journal (one HTML file, a PWA, used on a phone at 390 × 844). The Today screen has a living scene in its bottom 42 %. There are three places; **this brief is only about Key West**, which belongs to Nick: a man leaning back against a palm on a sand spit, looking out over shallow turquoise water to a distant key with a lighthouse.

The brief for the whole app, in Paul's words: "maximum calming presence, beautiful, calm, pretty". Every scene should "look natural".

**Where this place stands.** The Florida dock has just been through this same process and came back as a real place (Boca inlet): its own palette per time of day, slow irregular swell, wind on the water, glare, fish on shared clocks that notice each other, three depth tiers. Key West has had none of that yet. It is still the first-pass scene: three identical sine waves, a flat beach, and a set of animals that each run their own loop and never meet. The job is to bring Key West up to the dock's level without making it a second dock. The dock is about what lives under the water. Key West is about the shore: light, tide, sand, and the things that walk on it.

## Files here

| File | What it is |
|---|---|
| `keywest-scene.html` | The live Key West scene, extracted from the app (Feeling 49). Self-contained, no scripts needed, all CSS and SVG inline. Buttons at the top switch morning / day / evening / night, sit mode, late mode, and fire one wind gust. |
| `keywest-day.png`, `keywest-evening.png`, `keywest-night.png` | What the Today screen looks like now at 390 × 844. |
| `keywest-day-sit.png`, `keywest-night-sit.png` | Sit mode, where the whole scene is visible. |
| `BRIEF.md` | This file. |

## How the scene is built

Everything is inside `<div class="waves keywest">` within `#tab-today`. Back to front:

1. Sky (shared by all places): `.sky-breathe`, `.clouds`, `.nightsky`, `.orb` (sun or moon), `.wind`.
2. Inside `.wave-wrap` (this bobs with the water): the setting sun at dusk, sun glitter, `svg.w1` (back wave, its crest moves between 61 % and 79 % of the scene height), the distant key, lighthouse and its night beam, a sailboat, `svg.w2`, green flash, gull, dolphins, pelican and its splash, frigatebird, turtle, `svg.w3` (front wave, crest near 32 %).
3. Outside `.wave-wrap` (land does not bob): `svg.sand` with three paths (`.beach`, `.wet` line, `.foam` that slides up and down every 7 s), then the log, iguana, hen, crab, egret, rooster, and last `svg.palm`, which holds the palm, its swaying crown, and the figure.
4. UI glass floats above: greeting, entry card, mic, six faces, Save, and a floating tab bar that **covers the bottom ~90 px of the scene** on the Today screen. Look at `keywest-day.png`: the rooster, hen and crab are behind it.
5. Bottles: when a friend sends a word, a small glass bottle drifts in on the water (`.bottle`, keyframes `bottleDriftKW`) and beaches near the middle of the shore. They live outside `.waves` and are not part of this brief, but leave the water's edge between 40 % and 60 % from the left clear enough for them to read.

**Sit mode** (`body.dock`, entered by long-pressing the scene; the class is called `dock` for every place): the UI fades out, the scene rises to 44 vh, and a breathing ring appears with the line "Breathe with the tide". This is the best place to judge the scene.

Colours come from CSS variables that change with `html[data-sky]` and `html.night`: `--scene-back`, `--scene-mid`, `--scene-front` (the three waves), `--scene-land` (sand), `--silhouette` (palm, figure, birds, land animals), `--accent` (things in the water, such as the turtle). Do not hard-code colours in rules; define or override variables. You may give Key West its own per-sky palette block the way the dock got one, scoped to `html[data-place="keywest"]`.

### How an animal is built

```html
<div class="turtle-wrap">                         <!-- path across the scene -->
  <svg class="turtle" viewBox="0 0 1536 1410">    <!-- size, fill, opacity, surfacing -->
    <use href="#f-turtle"/>                       <!-- the silhouette, from the sprite at the top of the file -->
  </svg>
</div>
```

Simple animals are one `<svg class="amb …"><use/></svg>` with everything on it. Show and hide by time of day with the classes `day-only`, `dusk-only`, `dusk-night`, `night-only`, and `not-dusk`.

### Who lives here now

| Species | Class | Where | Behaviour, cycle |
|---|---|---|---|
| Magnificent frigatebird | `.frigate-wrap` | high, top 3 % | One wide slow loop, tilting. 110 s. Sleeps after 21:00 |
| Laughing gull | `.gull`, day | top 9 % | Crosses right to left, then a gap. 100 s. Sleeps after 21:00 |
| Brown pelican | `.pelican`, day | 74 % | Glides in from the right, dives at 33 % of the cycle with a splash ring, comes up, leaves left. 150 s |
| Green turtle | `.turtle-wrap` | between mid and front wave, 36 % | Drifts right over 260 s; surfaces for about 8 s every 100 s |
| Bottlenose dolphins × 2 | `.dolphins`, dusk | back water, 62 % | Three rolls in a row, moving left. 96 s |
| Great egret | `.egret`, day | wet line, left 58 % | Stands; one slow step now and then. 40 s |
| Green iguana | `.iguana` | on the log, far left | Still. A small tail flick every 40 s |
| Hen | `.hen` | sand, left 36 % | Pecks every 5 s |
| Rooster | `.rooster-wrap` | sand, left 20 % | Walks 40 px, stops, pecks twice, walks back. 120 s |
| Ghost crab | `.crab` | sand, 28.5 % | Scuttles the whole width left to right with two pauses. 220 s |
| Also | | | Distant key and lighthouse (beam sweeps at night), a sailboat on the horizon every 40 min, a setting sun with a green flash at dusk, foam on the wet line, the palm crown swaying and leaning in a gust |

## Hard rules (each one comes from something Paul rejected)

1. **The figure is final.** Do not redraw, restyle, or "improve" Nick. Paul approved those exact paths after three rejected attempts. The palm may be refined, but the figure must stay seated against its trunk, on the flat top of the sand spit (the beach path is flat from x = 252 on, for this reason).
2. **Animals are real species silhouettes from PhyloPic, one path, one fill.** Never build a creature from circles, triangles, or stacked parts, and never use per-part opacity. He rejected that look twice. A new species means a new PhyloPic silhouette (CC0, or CC BY with the credit kept). Species must actually occur in the Lower Keys.
3. **Calm first.** Fast things are tiny and constant (a frond, the foam); big things are rare and slow. Nothing large arrives more often than once a minute, and nothing crosses the screen in under ten seconds. On the dock Paul removed the pelican and the osprey as "too much", so treat the pelican dive here as on probation: it is the loudest event in the scene.
4. **Place things by band, never by the sky.** The back crest drifts 61–79 %, so anything pinned in that range floats or sinks half the time. Horizon things sit at `bottom: 62 %` drawn right after `w1`. Waders stand on the wet line. Land animals stand on the beach path, and the beach is not level: it dips in the middle and rises to the spit, so compute the sand height at the animal's x before placing it. In `keywest-day-sit.png` the hen and rooster stand on the foam line rather than the sand; that is the kind of thing to fix.
5. **Scope every scene rule.** Write `.keywest .thing` or `.waves .thing`, never a bare class. `<body>` carries state classes (`dock`, `late`, `gust`, `slow`, `listening`), and a bare `.gust` rule once matched `body.gust` and sheared the whole screen. Test any wind effect with the "gust now" button.
6. **Nothing may depend on a keyframe to be hidden.** Under Reduce Motion the app sets `animation: none` on this scene, so anything whose hidden state lives only in a keyframe sits on screen permanently (this caused frozen fish with rings around them on the dock). Give every come-and-go element a hidden base state. Paul's phone does not have Reduce Motion on, so the moving version is the one he sees; if you want slow motion to continue under Reduce Motion as it does on the dock, say which elements are safe.
7. **CSS and inline SVG only.** No canvas, no JS animation loop, no libraries, no images. The app is one file that works offline. Animate `transform` and `opacity` only, for battery.
8. **After 21:00** (`body.late`) everything slows down and the sky birds sleep.
9. **Sound is settled** (one singing bowl per out-breath). It is not part of this brief.

## What to work on

Open questions Paul has not settled, in order of value:

1. **Does the shore read as one living place?** Right now eleven animals run eleven unrelated loops. On the dock, shared clocks made animals notice each other (the snook's strike scatters the pinfish at the same instant). Here: the crab could bolt for its hole when the egret steps toward it, the hen could follow the rooster, the gull could lift off the sand instead of only crossing the sky, the turtle could surface near where the pelican is not. Residents with a home, visitors with a purpose.
2. **The water.** All three waves are the same sine path in three tints. The dock got irregular crests, a slow swell, cat's-paws from the wind and a glare path under the sun. Key West water is different from the inlet: clear, shallow flats, pale sand showing through, darker patches of turtle grass, a gentle lapping edge. How does that read in three flat bands, and can the foam line feel like a tide coming in and out rather than a 7-second loop?
3. **Palette per time of day.** Only the sky changes at dusk; the water stays noon turquoise under an orange sky. Key West is the sunset place. Propose morning, day, golden hour and night palettes for water, sand and silhouettes.
4. **The sunset itself.** The setting sun is a 300 s loop, so it sets every five minutes all evening, with a green flash each time. Decide what dusk should be: a sun that sits low and still, a slow sink tied to nothing, or something else. The green flash is a lovely rare thing; rare should mean rare.
5. **Too much or too little?** Say which animals to cut or make rarer so each one reads. Four animals share the left 40 % of a 390 px strip of sand.
6. **The tab bar hides the bottom 90 px** outside sit mode, which is most of the beach. Either raise the sand animals so they clear it, or accept that they belong to sit mode, as the grouper does on the dock.
7. **Sit mode composition.** In `keywest-day-sit.png` the gull and frigatebird fly just under the breathing cue. Keep the space around the ring and its text quiet.
8. **Night.** A lighthouse beam, stars, a moon. What does the shore do at night (ghost crabs are nocturnal; the chickens roost; turtles nest on these beaches in summer)?

## How to hand work back

The same way the dock came back:

- One file, `keywest-app.html`: this scene file with your changes applied, top bar kept, as the source of truth.
- `HANDOFF.md` with numbered sections that can be applied to the app's `index.html` in order: (1) any new `<symbol>`s for the sprite, with PhyloPic source, author and licence; (2) the full replacement markup for `<div class="waves keywest">…</div>`; (3) the CSS to replace, named by the comment it starts at (`/* ---------- Key West: Nick's place.` and the `/* Key West: the sun sets in front of you` block in the ambience section); (4) one new block to append at the end of the stylesheet, scoped to `html[data-place="keywest"]`, for palette and overrides.
- Keep the existing class names and the `wrap > svg > use` structure.
- One paragraph per animal saying what it now does and why.
- Check every change at 390 × 844 in morning, day, evening, night, late, and sit mode.
