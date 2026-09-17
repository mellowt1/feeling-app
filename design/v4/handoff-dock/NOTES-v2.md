# Dock, round 1: does the water read as an ecosystem?

Changes are only in the `/* living water: …` CSS block of `dock-scene-v2.html`. Markup inside `.waves` is unchanged; class names and the `fish-wrap > svg.fish > use` structure are kept, so the block pastes over the same one in `index.html`. No new species, no new files, no colours touched.

## The idea

Fish that never notice each other cannot read as an ecosystem, and CSS animations can only notice each other if they share a clock. Two clocks now exist:

- **130 s clock, delay −18 s:** snook, pinfish school, barracuda.
- **150 s clock, delay −100 s:** blacktip and snappers (unchanged).
- The **jack (120 s)** is phased to the **mullet (40 s = 120/3)** so a mullet jumps clear of its nose.

Everything else (tarpon, grouper, mackerel, bonnethead) is untouched.

## Per species

**Snook (`fw2`, 130 s).** Still the resident by the piling, facing the current. At 31 % it tenses (a small nose-up), at 31.6–33.2 % it strikes 18 vw to the left, arriving exactly where the school is, coasts out of the strike, turns at 43 %, and drifts home along the bottom of its band. The strike is the only fast thing it does; 130 s gives it one strike and a long quiet patrol, which is what a snook on a dock actually does.

**Pinfish (`fw6` + `p1–p5`, 130 s).** The wrap keeps its wander and the two feeding holds, but at 33 % (the snook's arrival) the school flees right and up as a group while each fish bursts on its own vector (p1 down-left, p2 up-right, p3 up-left, p4 right-down, p5 straight down) and regroups by 37 %. At 39 % the school reaches 56 vw, directly above the hanging barracuda, rises 14 px and turns back: a school turning in front of a barracuda is the "notice" beat. At 60 % the barracuda flashes beneath them and the whole school flinches once. The old `pinFeed`/`pinFlinch` (9–13 s, unsynced) are folded into five 130 s tracks so the feeds still happen in the holds and the bursts land on the beat. The tail sway on `use` is unchanged.

**Barracuda (`fw5`, 130 s).** Same behaviour (arrive, hang dead still, vanish left), moved from 150 s to the 130 s clock so its hang (24–58 %) covers the school's turn and its exit (58–61 %) passes under the school.

**Jack crevalle (`fw4`, 120 s).** Same path; only the delay changed (−82 s). On the left-going pass the jack reaches ~50 vw at the moment mu2 (left 44 %) jumps, so the mullet jumps just ahead of the nose. Mullet jump to escape jacks, so the existing splash now has a reason.

## v3: calm pass (`dock-scene-v3.html`)

Same choreography, slower rhythm. Mullet jump every 20 s instead of 13 s (60 s cycle; jump and ring keep their real durations). Mackerel's two passes are a minute apart instead of back to back, turns off screen. Jack re-phased to the 60 s mullet (−59.7 s), same beat. The school's third group event (the 60 % flinch) is dropped: strike and turn are enough per cycle. Net: fast crossings go from four per two minutes to three, surface pops from 9 to 6 per two minutes.

## v4: colour and texture (`dock-scene-v4.html`)

Depth in three tiers, one fill each. Far (tarpon, barracuda, blacktip) get class `far`: fill is `color-mix` of the accent toward `--scene-mid`, 10 % smaller, opacity .17–.2, slower bob. Near (grouper, bonnethead, snappers) get `near`: full accent, a little larger, opacity .26–.34, deeper bob. Mid fish unchanged except snook and pinfish nudged up a step. Plus a new `.light` div before the fish: two soft shafts of surface light (gradients, masked to fade with depth) that drift 46 s and breathe 19 s over the fish layer, dimmer at dusk, dimmest at night, slower after 21:00. It stops under Reduce Motion (existing rule) with a visible base state.

## v5: night under the lamp (`dock-scene-v5.html`, question 4)

At night (`html.night`) the daytime light shafts are off and the lamp's glade is the only light on the water, warmed to the lamp colour and a little wider. The pinfish school gathers in the glade (`swimSchoolNight`, held at 74–76 vw) and the snook holds just below and right of it, nose to the current (`swimSnookNight`, 80 vw; positions are tuned to the 390 px phone, where the glade sits at 289–367 px). Same 130 s clock and −18 s delay: at 33 % the snook strikes up into the glade and the school bursts away left, regroups, and drifts back into the light by 54 %; the snook coasts out, turns, and comes home by 77 %. Fish in the glade are brighter (snook .36, pinfish .34) than the rest of the night water. Day and dusk are unchanged.

## v6: the tab bar (`dock-scene-v6.html`, question 5)

The bar is 270 px wide and covers the bottom ~90 px (38 % of the 28 vh water) in the centre of the screen. Decision: the sand is sit mode's. The **bonnethead** keeps its 5 % pass; on the Today screen it shows only in the 60 px clear of the bar each side, a tease that pays off in sit mode. The **grouper** is too good to hide: outside sit mode it rests at `bottom: 33 %`, so its back shows above the bar as the biggest, slowest shadow in the water, and the bottom of the body tucks behind the glass. The change is a `bottom` transition (2.5 s, matching the water's rise), not a transform, so the patrol keyframes are untouched and it settles back to the sand when sit mode opens.

## Not done here (needs a new PhyloPic silhouette, so a decision from Paul first)

Something on the pilings (a crab or barnacle line), and a stingray on the sand. Both would be a new species under rule 2. Night snook under the lamp is question 4.

## Checked

Day and sit mode at the strike (t ≈ 25 s), the barracuda turn (t ≈ 34 s), and the jack/mullet pass (t ≈ 45 s). Reduce Motion: nothing new has a hidden state that lives only in a keyframe; all new animations are on `.fish-wrap` or its children, which the reduced-motion rule already exempts.


---

# Boca inlet: the reimagined dock (`dock-boca.html`, separate from v1–v6)

Brief from Paul: Boca Raton inlet / the Intracoastal parks between the mangroves; choppy inshore water with whitecaps and wind on the surface; midday glare; fish as clean silhouettes with more colour and light; wind in the air and sky; and Paul **standing, leaning against a post**, because that is what he does. Only "Paul, the rod and the cat" were kept sacred; everything else is new.

**Palette.** One oklch family: water far → deep is a teal run (#A7D4D3 → #2E7E88), fish share the water's chroma and move hue: cool teal-navy for the default shadow, olive for the green-brown fish (snook, grouper, snappers), one warm gold for the jack, and the tarpon flashes silver for two seconds on the roll (`tarponFlash`, still one fill, animated on fill and opacity). Mangroves are one dark green. Whites for glare and caps.

**Water.** Eight short crests per screen instead of four; the three bands drift at 13 / 10 / 8 s with the middle one reversed, so the surface reads as chop, not a conveyor. Whitecaps are small white flicks (`.caps span`) riding each crest, drifting with their band and coming and going on their own 3–5 s timers. Cat's-paws (`.gust`) are skewed dark gradients that slide downwind across the surface every 17–25 s. A white glare wash whites out the far water under the overhead sun with 26 glints across the whole surface. A deep gradient at the bottom.

**Wind in the air.** Mangrove canopy skews from its roots (6 s). The post's rope swings (2.6 s). The cat's tail blows (3.2 s, pivot at its base; the cat's paths are untouched, only translated 30 units right to clear the post). The rod sways more and the line bows in the wind (skew on the line group). Three flat, stretched low clouds cross in 44–60 s. A frigatebird hangs high up almost still (PhyloPic, Antonio Medina, CC0), and a gull holds into the wind, then gives up and slides downwind (PhyloPic, Sharon Wegner-Larsen, CC0).

**The figure (proposal, needs Paul's yes).** Standing, leaning back 7° against a post that rises above the deck, rod low over the water, other hand on his hip. Head, neck, arm weight (11), hand (r 6.5), rod (2.4) and line (1) are the same vocabulary as fig-fish; torso and legs are new. If rejected, the sitting figure drops straight back in.

**Fish.** The v6 choreography, colours and depth tiers carried over unchanged (ecosystem clocks, grouper above the tab bar on the Today screen).

**Reduce Motion.** Water, caps, gusts, clouds, birds, rope, tail, rod and line stop; fish and mullet keep moving. Caps and glints have a visible base state.

**Slowed (round 2).** Paul: "a bit too fast for a calming app". Everything not a fish is now roughly half speed: bands 26 / 21 / 17 s, bob 5 s, caps flick 7–12 s and softer, glints 5–10 s, gusts every 34–50 s, clouds 90–130 s, frigate 16 s hang, gull 150 s, canopy 11 s, tail 5.5 s, rope 4.5 s, rod 6.5 s, line 5 s. Sway angles trimmed too. The fish clocks are untouched.

**Whitecaps removed (round 3).** The chop now reads from the crests, the gusts and the glints alone.

**Back to sitting (round 4).** The standing proposal is withdrawn; the approved sitting figure, cat and dock paths are back verbatim (post and rope removed). Rod sway and line bow kept.


---

# Boca in the app frame (`dock-boca-app.html`)

Built from v6 (the real Today screen: glass UI, tab bar, sit mode, late mode, all four skies) with the Boca scene swapped in. Everything Boca is scoped to `html[data-place="dock"]` and appended after the app's CSS, so it pastes into `index.html` as one block plus the small markup changes inside `.waves`. The preview bar has a "boat + swell now" button because the real one is hourly.

**Slow waves.** 48 / 40 / 34 s with the middle band running against the others; bob 8 s. After 21:00: 70 / 60 / 50 s.

**1. Sit-mode integration.** Same `.waves` block, same `fish-wrap > svg.fish > use` structure; the grouper still rides above the tab bar on the Today screen and settles when the water rises. Fish colours now go through `--fish` (not `--accent`) so the UI accent is untouched.

**2. Golden hour and night.** Evening: glare turns to #F6C89A, water warms (#D9B99A back), mangroves go black-green, the cat's-paws fade out (wind drops), fish tint warmer, gull gone. Night: water to deep teal, mangroves nearly black, glare off, lamp glade from v5 kept, and two channel markers on the horizon line, red at 18 % and green at 88 %, each on its own slow blink (6 s / 4 s, never together). Sky birds asleep.

**3. Shared wind clock.** One 90 s cycle. Calm, a gust arrives at 32 %, builds to 40 %, eases off by 52 %. Answering it: canopy skew (`canopyWind`), rod-wind rotate, line bow (`lineWind`, on a new `.fishline` group around the line path), cat's tail (`tailWind`, pivot at its base, path untouched) and the first cat's-paw crossing the water during the gust. Two more cat's-paws wander on their own so the surface isn't metronomic.

**4. The bobber.** The existing `.cast-bobber` (already at the line's end) is now always visible, rides the swell on the 130 s fish clock with the same −18 s delay as the snook, dips twice at 74 %, then nothing. **5.** The existing `.cast-splash` ring opens at the same moment, where the line enters the water.

**6. Crab on the roots.** One PhyloPic silhouette already in the app: ghost crab, Loran Honório da Silva, CC BY 4.0 (credit kept in fauna-credits.txt). Sits still at the mangrove's waterline; every 50 s takes three stepped moves sideways and stops. Hidden at night. If Paul wants a true mangrove tree crab or a night heron, that's a new PhyloPic pull.

**7. Boat wake.** The hourly boat keeps its crossing; a `.swell` wrapper inside `.wave-wrap` lifts the whole water 4–6 px and back over ten seconds, a minute after the boat passes (3600 s clock, delay −3480 s).

**Reduce Motion.** Birds, canopy, glints, gusts, rod, line, tail, markers, crab, swell, bobber and ring stop; markers hold at .6 at night; fish and mullet keep moving.

**Evening and the bank (round 2).** Evening water is cooler now (#7FA5A8 / #4E7F86 / #2F5158) so it stops going muddy against the dark bank; the warmth lives in the sky, the far band (#E3C4A6) and the glare, and the dusk overlay on the water is halved. The mangrove bank is now two paths of one fill: the canopy mass, and a fringe of curved prop roots (strokes) standing in the water at the waterline, irregular spacing. Same in `dock-boca.html`.

**Round 3.** Mangrove bank and the crab removed from both Boca files (Paul's call). Breathing circle v2 in the app file: 190 px ring (was 150), scales .6 → 1.25 on the in-breath so it visibly grows, the inner glow brightens with it (.55 → 1), a fainter second ring trails a beat behind, the cue moves down to clear it. Same 4 · 1 · 7 timing and the 15 s slow variant.

**Round 4.** Mangrove bank back as the original single canopy mass (no roots); crab stays out.

**Round 5.** Floating marker and osprey perch tried and reverted (no PhyloPic osprey path could be fetched).
