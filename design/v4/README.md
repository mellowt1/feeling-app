# Feeling v4, three places (design only)

This is the v4 redesign. It shipped in the app as Feeling 31 on 2026-09-16. The app does not load anything from this folder; these are the source files.

## Where the design lives

- **Figma, the source of truth:** the section "v4 — Three places" in the [Feeling app file](https://www.figma.com/design/PmiVN54XQdAeSBvypBthM3/Feeling-app?node-id=164-33). It holds the tokens (the "Places v4" collection, six modes), the scene components, fifteen screens, the notes and ambience frames, and the final figures.
- **Living canvas:** [Feeling, three places alive](https://claude.ai/artifact/5yKcAMwYUdo6jJn6RZeiki), a Claude Design canvas with animated scenes. The files in `scenes/` are its artboards.

## Files

- `figures/calm-presence.svg` is the final figure artwork, confirmed on 2026-09-16. The paths are final: do not redraw them. The signed metadata block from the delivered file is left out; the artwork is identical.
- `figures/fig-fish.svg`, `fig-mug.svg` and `fig-lean.svg` are the three figures as separate files (viewBox 0 0 200 210, sitting edge at y=140). Paul fishes on the dock, Elias holds the mug on the steppe, and Nick leans back on the sand.
- `scenes/Main.dc.html` (Florida dock), `ElCampo.dc.html` and `KeyWest.dc.html` are the animated scene backgrounds. Each has a day, dusk and night switch; El campo also has dawn.
- `scenes/CalmPresence.dc.html` is the figure sheet as delivered.
- `scenes/canvas.json` is the canvas layout, with the per-place ambience lists in its notes.

## Previewing

Open the app with `?place=dock|campo|keywest` and `?sky=morning|day|evening|night` to see any place at any time of day, for example `index.html?place=keywest&sky=evening`.

## Fauna (Feeling 32, 2026-09-16)

Every animal is a real species silhouette from [PhyloPic](https://www.phylopic.org), used as one path with one fill: no shapes assembled from circles and triangles. In Figma they are the components `v4 / Fauna / …` (four rows under the screens, fill bound to `silhouette`); in the app the same paths sit in one `<symbol>` sprite at the top of `index.html` and every creature is a `<use>`. Licences: most are CC0 or public domain; these four are CC BY 4.0 and need the credit kept: southern lapwing and Magellanic horned owl by Edwin Price, mangrove snapper by Graham Montgomery, ghost crab by Loran Honório da Silva. The full list with authors is in each component's description and in `figures/fauna-credits.txt`.

- **Still water:** tarpon (cruises, rolls at the surface once a pass), snook, jack, barracuda, pinfish school, goliath grouper, Spanish mackerel, mullet jumps, a group of four mangrove snappers hanging under the dock that startle once a minute, a blacktip every two and a half minutes, a bonnethead low over the sand every four, dolphins, manatee at dusk, great blue heron in the shallows.
- **El campo:** guanaco, three sheep far off, ñandú with two chicks, European hare (the mara was replaced: it does not reach the Andes side of Santa Cruz), condor, southern lapwing (tero) by the road, chimango caracara on the fence post by day, Magellanic horned owl on it at night, piche (dwarf armadillo) at dusk, grey fox at dusk and night.
- **Key West:** brown pelican, magnificent frigatebird, green turtle, green iguana on the log, hen and rooster, ghost crab, laughing gull by day, great egret on the wet line, dolphins rolling in the back water at dusk.

After 21:00 the sky animals (condor, frigatebird, gull, lapwing) go to sleep, as before.

## Still open

1. Fine-tune the dusk and night skies on a real phone.
2. Say which animals feel like too much; each is one `<use>` line and one CSS block, easy to drop.
