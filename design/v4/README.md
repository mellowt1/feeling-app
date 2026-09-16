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

## Still open

1. Trim the ambient animals per place, if any feel like too much.
2. Fine-tune the dusk and night skies on a real phone.
