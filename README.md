# Full-flow staged combustion

Sectional, frame-locked explainer of a Raptor-inspired full-flow staged combustion cycle. 1,020 frames at 30 fps. The machine is a still section. The camera, the path marks, and the labels move. Pressures, speeds, mixture ratios, and gimbal angles are not asserted.

Live plate: https://mizcausevic-dev.github.io/full-flow-rocket-engine-explainer/

## Run

```bash
npm install
npm test
npm run dev
```

Dev server: http://127.0.0.1:4317

GitHub Pages build, written to `out/`:

```bash
npm run build:pages
```

The `pages` branch is the static export. `main` is the source.

## What the five shots do

| Frames | Clock | What changes |
| --- | --- | --- |
| 0-149 | 0:00-0:05 | Feed lines and two separate turbopumps |
| 150-299 | 0:05-0:10 | Both propellants into each preburner, opposite ratios |
| 300-509 | 0:10-0:17 | Turbine gas ducted to the chamber, shaft work in gold |
| 510-749 | 0:17-0:25 | Steady chamber burn and regenerative methane cooling |
| 750-1019 | 0:25-0:34 | Nozzle expansion, then a held full-engine view |

Cyan is the pathway. Gold is energy or actuation. Violet is sensing or state. Those colors are overlays. Hardware stays in the metal.

## Limits

Raptor-inspired conceptual model. Combustion is deflagration, not detonation. Scale changes, slow motion, and time compression are labeled. Schematic panels are marked schematic. The editorial image in `public/hero-editorial.jpg` is a rendered engine on a stand, not a photograph of flight hardware.

## Repurpose

The same player can explain any closed-cycle machine: gas turbines, refrigeration loops, fuel cells. Keep the grammar. Cyan path, gold energy, violet state, a still section, and a schematic wherever the mechanism cannot be drawn without inventing a number.

## About

One-line: Frame-locked sectional explainer of full-flow staged combustion, with the operating numbers left off on purpose.

Topics: `aerospace`, `rocket-engine`, `staged-combustion`, `full-flow`, `raptor`, `methalox`, `explainer`, `visualization`, `turbopump`, `education`

## Conflict notes

The brief fixes one dark technical stage. A seven-theme dashboard switcher is not applied. The timeline is a canvas clock, not a Motion-library scene, because every frame has to be a pure function of its index.
