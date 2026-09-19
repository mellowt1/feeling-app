# Feeling: scene grammar and place re-cut. Execution plan for agents

Owner: Paul. Written 2026-09-19 against Feeling 57 (`f0271f6`).
Goal: every place (dock, campo, keywest, hawaii, tokyo) looks drawn by one hand, animates with one hierarchy, and still pops. Key West is the worst offender (Nick's brother called it "not coherent") and goes first.

Read this whole file before starting a task. Each task names its agent, inputs, steps, outputs and acceptance test. Do only your task. End your run with the five-line report in section 8.

---

## 1. Facts about the app you must not rediscover

- The app is one file, `index.html` (3460 lines). `<style>` runs lines 15 to 1638, markup follows, scripts start at 1641. Scenes live inside `#tab-today`, one `<div class="waves …">` per place: dock 1728, campo 1808, keywest 1866, hawaii 1914, tokyo 1947 (line numbers drift; grep for `class="waves`).
- Place is `html[data-place="dock|campo|keywest|hawaii|tokyo"]`. Time of day is `html[data-sky="morning|day|evening|night"]` plus `html.night` after 22:00 or dark phone. Preview any combination with `index.html?place=keywest&sky=evening`.
- Sit mode is `body.dock` for every place (long-press the scene). UI fades, scene rises to 44 vh, breathing ring appears. Judge scenes in sit mode.
- Late mode is `body.late` after 21:00: everything slows, sky animals sleep.
- Every creature is a `<use href="#f-…">` of a PhyloPic silhouette from the `<symbol>` sprite at the top of the file (36 symbols). No shapes built from primitives. CC BY credits live in `design/v4/figures/fauna-credits.txt`; keep them when you keep the animal.
- Palette per place and sky is CSS variables on `html[data-place]` (lines 19 to 27 and the appended blocks at 1230 dock, 1353 campo, 1381 keywest, 1444 hawaii, tokyo after that). Scene rules read `--scene-back`, `--scene-mid`, `--scene-front`, `--scene-land`, `--silhouette`, `--accent`, `--orb`. Never hard-code a colour inside a scene rule; add or override a variable.
- Scope every scene rule under `.waves` or `html[data-place]`. A bare `.gust` once matched `body.gust` and sheared the whole screen (Feeling 44). Test with `body.gust` set.
- Reduce Motion: keep testing with `reducedMotion: 'reduce'` in Playwright. Water and fish keep moving under it; waves, clouds and UI motion stop. The breathing dock is fully exempt.
- Fixed bottom layers must subtract `--vgap` (Feeling 55 to 57, iOS short-launch viewport). Do not put `overflow` on `html`.
- Release: bump the Export footer text `Feeling N` (grep `class="closing"`) and `CACHE = 'feeling-vN+1'` in `sw.js`. One commit per task, message `Feeling N: …`. Do not push; Paul pushes.
- Figma first: Paul's rule is that every visual change is drawn or specified in Figma before code. File `PmiVN54XQdAeSBvypBthM3`. Sections: v4 `164:33`, catch-up v7 `276:2544`, Hawaiʻi v8 `278:3569`. Load the `figma:figma-use` skill before any `use_figma` call.
- Tooling: Node only, no Python. Playwright browsers are already installed under `%LOCALAPPDATA%\ms-playwright`; the package is not in this repo (see task 0.1).
- Only one agent edits `index.html` at a time. Tasks marked SERIAL wait for the previous SERIAL task's commit.
- Reference quality bar: the dock (Boca, `design/v4/handoff-dock/HANDOFF.md` and `NOTES-v2.md`) and Hawaiʻi (`design/v4/handoff-hawaii/`). These two are closest to the grammar. Key West brief for background: `design/v4/handoff-keywest/BRIEF.md`.

## 2. The diagnosis (why Key West reads as stitched together)

1. Three drawing hands in one picture: PhyloPic silhouettes, a blob island with a stick lighthouse, a thick-stroke palm, a smeared sun.
2. Water is three stacked sine bands with hard edges and equal amplitude. It reads as stripes. Hawaiʻi shows the target: one lagoon plane, one foam line, a real horizon.
3. Scale contradictions: hen ≈ egret ≈ iguana; frigatebird larger than the island; the man larger than the key he looks at.
4. Saturation inverted: the water is the most saturated surface in the app while every other place is dusty. Pop comes from one saturated hero on a calm ground, not a saturated ground.
5. No motion hierarchy: 152 place rules, about 30 keyframes, every animal on its own clock.

Root cause: each place was a separate handoff with its own brief. Tokens exist for UI colour only. Nothing governs shape, scale or motion. The fix is a grammar, then a re-cut of each place against it.

## 3. The grammar, draft (task 1.1 finalises it)

Numbered so audits and lint can cite them.

- **G1 Four depth bands.** Sky · far (horizon landform: key, pali, range, skyline) · mid (water or ground plane) · near (shore, figure, resident animals). Each band one tone.
- **G2 Atmospheric perspective.** Far band renders at about 25 % of `--silhouette` strength, mid at 55 %, near at 100 %. Nothing far is darker than anything near.
- **G3 Horizon line.** The far band's base sits at the same height in every place: 61 % of scene height (the dock's back crest band, 61 to 79 %). Switching places feels like the same window.
- **G4 Silhouettes only.** Filled paths, no stroke outlines, no gradients inside a shape. Soft edges (blur or feathered opacity) only on sky, mist, glare and water surface. Crisp edges on land, figure, fauna.
- **G5 Water.** At most two water surfaces. Crest amplitude ≤ 1.5 % of scene height. Wavelength ≥ 60 % of scene width. Surface motion is translate ≤ 4 px on a ≥ 20 s loop.
- **G6 Scale ruler.** Figure height = 1. Palm or tree 1.6 to 2.2. Birds in flight ≤ 0.35. Ground animals 0.15 to 0.4. Far-band objects are drawn at their true relative size and then shrunk by distance, so a lighthouse on a key 2 km away is smaller than the figure.
- **G7 One hue family per place.** Sky, water and land are tints and shades of one family plus one warm accent (`--orb`, `--sand`). Chroma cap on any surface: OKLCH C ≤ 0.10. Silhouette colour is darkened sky, not neutral grey.
- **G8 One hero per place.** The single element allowed above the chroma cap or with a light effect: dock the fish under the boards, campo the road into the range, Key West the lagoon light and the lighthouse beam, Hawaiʻi the pali ridge, Tokyo Godzilla.
- **G9 Three motion tiers.** Ambient: always on, loop ≥ 20 s, displacement ≤ 4 px (swell, sway, clouds, glitter). Resident: one animal per band, cycle ≤ 3 min, one visible event per cycle (a peck, a step, a roll). Visitor: crosses the scene, one at a time, ≥ 2 min apart, on the shared place clock.
- **G10 Movers cap.** At most 3 things visibly moving at once (ambient tier excluded). Paul confirmed 3 on 2026-09-19.
- **G11 Shared clock.** Residents and visitors read one `animation-duration` base per place (the dock's shared clocks, Key West's 240 s shore clock) so events can answer each other. No animal on a private loop.
- **G12 Cast.** Six to eight species per place. Fewer than the current Key West (eleven plus cats).

## 4. Tasks

Agent column: **Opus** for judgement-heavy work (grammar, Key West re-cut, final review). **Sonnet** for tooling, audits, and trims that follow a written fix list.

### Phase 0. Tooling (Sonnet, parallel with 1.1, does not touch index.html)

**0.1 Screenshot rig.** Create `design/v4/tools/` with `package.json` (`playwright` dev dependency), add `design/v4/tools/node_modules/` to the root `.gitignore`, and write `shoot.mjs`:
- Opens `file://…/index.html?place=P&sky=S` at 390 × 844, deviceScaleFactor 2, for every P in dock, campo, keywest, hawaii, tokyo and S in morning, day, evening, night.
- Two variants per pair: Today screen, and sit mode (add `body.dock` via `page.evaluate`, wait 1.5 s). Plus one late variant (`body.late`) at night.
- Waits 4 s after load so ambient loops settle, then saves `design/v4/shots/{place}-{sky}[-sit|-late].png` and a scene crop (bottom 42 % on Today, bottom 44 vh in sit mode).
- Flags: `--place`, `--sky`, `--reduce` (reducedMotion), `--gust` (add `body.gust`).
- `contact.mjs` tiles all sit-mode shots into `design/v4/shots/contact-{date}.png`, 5 columns (places) × 4 rows (skies), 195 px per cell. Use `sharp` or plain Playwright canvas; do not add a third dependency.
Acceptance: `node shoot.mjs && node contact.mjs` produces 45 PNGs and one contact sheet from a clean checkout in under 3 minutes. About 1.5 h.

**0.2 Scene lint.** `design/v4/tools/lint.mjs` parses `index.html` as text (no browser) and for each place reports, as a markdown table to stdout and to `design/v4/LINT.md`:
- number of `<use>` creatures inside that place's `.waves` (G12);
- keyframes reachable from rules scoped to the place, and how many have a `translate` beyond 4 px with a duration under 20 s (G9 ambient tier);
- distinct `animation-duration` values used by non-ambient rules (G11: should collapse to a few multiples of one base);
- hard-coded `#hex` or `rgb(` inside scene rules under `html[data-place]` (G7 violation);
- distinct `--scene-*` variables referenced.
Also warn on any selector inside the scene sections that is not prefixed by `.waves`, `html[data-place]`, or `body.dock .waves`. Acceptance: runs in under 2 s, prints a row per place, exits 1 on a G7 hard-code or an unscoped selector. About 1.5 h.

### Phase 1. Grammar (Opus)

**1.1 Finalise the grammar.** Inputs: section 3, the dock and Hawaiʻi handoff folders, `design/v4/shots/contact-*.png` from 0.1 (if not ready, shoot the dock and Hawaiʻi sit-mode frames yourself with the Playwright in `C:\Users\Admin\Desktop\Odysseus\node_modules\playwright`). Measure the dock and Hawaiʻi to confirm or correct each number in G1 to G12 (horizon %, amplitude, far-band opacity, chroma). Write `design/v4/SCENE-GRAMMAR.md`: the twelve rules, each with the measurement that backs it and one sentence on how to test it. Add a "per-place hero and cast" table for all five places. About 2 h.

**1.2 Grammar in Figma.** Load `figma:figma-use`. In file `PmiVN54XQdAeSBvypBthM3` add a section "v9 — Scene grammar" to the right of v8 (`278:3569`) with:
- one frame per rule (G1 to G12), rule text plus a small diagram where it helps (band diagram for G1 to G3, scale ruler for G6);
- a variables collection "Scene grammar" with numbers: horizon 0.61, far-opacity 0.25, mid-opacity 0.55, amplitude 0.015, ambient-min-duration 20, movers-cap 3, chroma-cap 0.10;
- the five sit-mode day screenshots from 0.1 in a row, 390 × 844, labelled, so the audit can be read against them (upload with `upload_assets`).
Acceptance: `get_screenshot` of the section shows all of the above; the section node id is written into `SCENE-GRAMMAR.md`. About 1.5 h.

### Phase 2. Audit (Sonnet, needs 0.1, 0.2, 1.1)

**2.1 Score every place.** For each place, look at its four sit-mode shots and the lint row and score G1 to G12 as pass / partial / fail with one line of evidence each. Write `design/v4/AUDIT.md`: a 5 × 12 table, then a per-place ordered fix list (biggest visual gain first, each item one sentence naming the element and the rule). Key West gets the fullest list; expect it to fail G1, G2, G4, G5, G6, G7, G10, G12. About 1.5 h.

### Phase 3. Key West re-cut (Opus, SERIAL on index.html)

**3.1 Design in Figma first.** In the v9 section, a frame "Key West v2" at 390 × 844 in sit mode, day, built to the grammar: one lagoon plane (`--scene-mid`) with one pale shallows plane near the sand (`--scene-front`), a foam line, the key and lighthouse as a far-band shape at 25 % tone and correct scale, palm and figure unchanged (Paul's Calm Presence figures are final: do not redraw), cast cut to eight: frigatebird (visitor, high), pelican (visitor, one dive), turtle (resident, mid), egret (resident, wet line), hen (resident, near), rooster (visitor along the sand), dolphins (dusk visitor), ghost crab (night resident). Drop the gull, iguana, mullet, barracuda, bonnethead, school and the cats unless Paul asks for the cats back. Evening and night variants of the same frame. Get Paul's yes on the Figma frame before code. About 2 h.

**3.2 Code it.** Work in `design/v4/handoff-keywest/keywest-scene-v2.html` (copy `keywest-scene.html`, which still has the day/evening/night/sit/late/gust buttons) until it matches the frame, then port into `index.html`: markup block at `class="waves keywest"`, the two CSS blocks (966 to 1060, and 1381 to 1443), and the keywest ambience rules in 1149 to 1202. Rules:
- water: two SVG planes, kwSwell stays (23 s, 3 px), kwLap stays, delete the third band and `kwRuffle` if it exceeds G5;
- motion tiers per G9, all residents and visitors on the 240 s shore clock or its halves and quarters;
- movers cap 3 (G10): stagger cycle offsets so no more than three non-ambient things move in any 10 s window; verify by stepping the shore clock in the standalone file;
- palette: chroma-cap the day water; move the pop into the hero (lagoon light glitter and the night lighthouse beam) per G8;
- keep the bottle landing zone (water's edge 40 to 60 % from left) clear;
- run `lint.mjs` (must pass), `shoot.mjs --place keywest` (all skies, sit, late, reduce, gust) and look at every shot;
- bump `Feeling N` in the footer and `sw.js` CACHE; commit `Feeling N: Key West re-cut to the scene grammar`.
About 4 h. Ask Paul for a phone check before Phase 4 starts.

### Phase 4. Bring the other places to the grammar (Sonnet, SERIAL, one place per task, in this order)

Each task: read `AUDIT.md` for the place, make a Figma frame in v9 only if a shape changes (trims of motion or palette need no frame), apply the fix list, run lint and shoot for that place, look at every shot, bump the release number, one commit `Feeling N: <place> to the scene grammar`.

- **4.1 Tokyo** (44 rules, thinnest; mostly G2 and G9 tiering, Godzilla stays the hero). 1.5 h.
- **4.2 Hawaiʻi** (closest already; expect G10 and G12 trims). 1 h.
- **4.3 Dock** (expect G12 cast trim from thirteen species, keep the shared clocks). 1.5 h.
- **4.4 Campo** (expect G2 far-band tone on the range, G9 tiering of guanaco, condor, truck). 1.5 h.

### Phase 5. Close (Opus)

**5.1 Final review.** Re-shoot everything, new contact sheet, re-run lint, re-score `AUDIT.md`. Any remaining fail becomes a line in "Still open" of `design/v4/README.md`. Update the README's place list and point it at `SCENE-GRAMMAR.md`. Add a `lint` and `shoot` line to the README's Previewing section. Commit. 1 h.

## 5. Dependency graph

```
0.1 ─┐
0.2 ─┼─► 2.1 ─► 3.1 ─► 3.2 ─► 4.1 ─► 4.2 ─► 4.3 ─► 4.4 ─► 5.1
1.1 ─┘        (Paul yes)   (Paul phone check)
1.2 (after 1.1, parallel with 2.1)
```

Total: about 22 agent hours. Wall clock about a week with Paul's two check-ins.

## 6. Definition of done, whole plan

- `node design/v4/tools/lint.mjs` exits 0.
- Contact sheet shows five places whose horizon, band tones, silhouette weight and water amplitude read as one hand.
- No place has more than eight species or more than three non-ambient movers at once.
- Key West passes G1 to G12 in `AUDIT.md`, and Nick's brother is shown the phone.
- Figma v9 section holds the grammar, the variables, and one frame per changed scene.

## 7. Things that are not in scope

Sounds, the breathing ring, the UI glass, the bottles engine, History and Export screens, the Cloudflare worker. If a fix needs one of these, write it under "Still open" and stop.

## 8. Report format (end every task with exactly this)

```
Task: <id>  Agent: <opus|sonnet>  Commit: <hash or none>
Did: <one sentence>
Shots: <path of the shots or contact sheet you looked at>
Lint: <pass|fail: rule>
Open: <one sentence, or "none">
```
