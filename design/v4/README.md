# Feeling v4, three places (design only)

This is the in-progress v4 redesign. The app does not load anything from this folder, and nothing here is in `index.html` yet.

## Where the design lives

- **Figma, the source of truth:** the section "v4 — Three places" in the [Feeling app file](https://www.figma.com/design/PmiVN54XQdAeSBvypBthM3/Feeling-app?node-id=164-33). It holds the tokens (the "Places v4" collection, six modes), the scene components, fifteen screens, the notes and ambience frames, and the final figures.
- **Living canvas:** [Feeling, three places alive](https://claude.ai/artifact/5yKcAMwYUdo6jJn6RZeiki), a Claude Design canvas with animated scenes. The files in `scenes/` are its artboards.

## Files

- `figures/calm-presence.svg` is the final figure artwork, confirmed on 2026-09-16. The paths are final: do not redraw them. The signed metadata block from the delivered file is left out; the artwork is identical.
- `figures/fig-fish.svg`, `fig-mug.svg` and `fig-lean.svg` are the three figures as separate files (viewBox 0 0 200 210, sitting edge at y=140). Paul fishes on the dock, Elias holds the mug on the steppe, and Nick leans back on the sand.
- `scenes/Main.dc.html` (Florida dock), `ElCampo.dc.html` and `KeyWest.dc.html` are the animated scene backgrounds. Each has a day, dusk and night switch; El campo also has dawn.
- `scenes/CalmPresence.dc.html` is the figure sheet as delivered.
- `scenes/canvas.json` is the canvas layout, with the per-place ambience lists in its notes.

## Still open

1. Choose which ambient animals stay in each place.
2. Confirm the dusk and night skies.
3. Move to code: tokens, scene SVGs, figures and animations into `index.html`, then bump `sw.js`.
