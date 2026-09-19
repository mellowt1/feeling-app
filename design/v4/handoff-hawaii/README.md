# Feeling, Hawaiʻi: Nick's second place

Feeling 51 adds a fourth place. Key West stays; Hawaiʻi sits next to it in the place pill (the jagged-ridge mark).

## Source

Paul's reference photo: Kaʻaʻawa / Kualoa on windward Oʻahu. Koʻolau pali behind turquoise water, tall coconut palms leaning out over white sand, ironwood and naupaka behind, black lava rock at the water's edge.

## Where the design lives

- **Figma:** section "v8 — Hawaiʻi: Nick's second place" (278:3569) on page "Feeling — iPhone", at y = 11400 below v7. It holds a drawn scene frame, eight app screenshots (Today and sit mode × morning, day, evening, night), the components `Hawaiʻi / Pali`, `Hawaiʻi / Palms, ironwood, Nick + cats` and `v8 / Fauna / Tropicbird | Humpback | Ruddy turnstone`, and a notes text.
- **Claude Design canvas:** [Feeling, Kaʻaʻawa (Hawaii)](https://claude.ai/artifact/VKNgUiRqhirRBqRx4JCKEM), four living artboards (morning with whales, day, evening, night).
- `hawaii-scene.html`: the four living scenes in one self-contained file. The PNGs are the app at 390 × 844.

## How it is built

`build/build.mjs` generates the cliffs, palms and sprite symbols, and `build/apply.mjs` patches them into `index.html`. Every insert is fenced by `<!-- hawaii:… -->` or `/* hawaii:css */` markers, so running the script again replaces the earlier insert. The cliffs and fronds come from seeded generators, so change them by editing the numbers (ridge bumps, the palm list, the frond fan), not the output paths. Nick and the cats are copied from the Key West markup unchanged.

## What it does

- **Light.** The shore faces ENE. Mornings are warm and front-lit, with the sun over the sea. At dusk the sun goes down behind the cliffs, so the ridges turn dark and backlit under a peach sky and the sea turns lavender. At night there are the moon, stars and pale palms.
- **Wind.** The trade wind blows inland all the time: the fronds stream toward the mountains, the crowns sway, and a gust leans them. Cloud caps rest on the crests and drift slowly.
- **Weather.** Every 15 minutes a light shower crosses the ridges. In the morning and by day a faint rainbow stands in it.
- **Life** (PhyloPic silhouettes, one path each):
  - koaʻe kea, the white-tailed tropicbird, glides past the cliffs every 2.5 min. It nests on Mokoliʻi.
  - ʻiwa, the frigatebird, hangs high over the bay.
  - A honu grazes the shallows.
  - Humpbacks show only December–April: a blow and a rolling back far out, every 4 min.
  - Two ʻakekeke (ruddy turnstones) work the wet line August–April, left of the tab bar.
  - An ʻōhiki (ghost crab) comes out after dark.
- **Left out on purpose.** Spinner dolphins (they stay mostly on the leeward side), the monk seal (no regular haul-out here), and kōlea (no silhouette with a clean licence).
- **Sound.** The same singing-bowl engine in its own key, C. The breathing hint is "Breathe with the trade wind".

## Preview

`index.html?place=hawaii&sky=morning|day|evening|night`. Add `&season=winter` to see the whales and `&season=summer` to hide the migrant birds. The head script sets `html.whales` (Dec–Apr) and `html.migrants` (Aug–Apr) from the date.
