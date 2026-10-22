# Full-flow staged combustion, explained in 34 seconds

Frame-accurate anatomy of a Raptor-inspired full-flow methalox engine. 30 fps, frames 0 through 1019. The player is a deterministic function of the frame index. No invented pressures, speeds, mixture ratios, or gimbal angles.

**GitHub About:** Frame-accurate 34-second anatomy of a Raptor-inspired full-flow staged combustion engine.

**Topics:** `aerospace` `rocket-engine` `staged-combustion` `propulsion` `animation` `explainer` `engineering-education` `methalox` `github-pages` `raptor`

## Run locally

```bash
npm install
npm test
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

`npm test` checks the frame contract: segment boundaries, the held ending, camera continuity, and a throat that is the narrowest station.

## What the model claims

- Two propellants, methane and oxygen, in steady operation.
- Two turbopumps on two shafts. A coaxial arrangement is not shown.
- An oxidizer-rich preburner and a fuel-rich preburner. Inlet thickness is qualitative.
- Turbine exhaust continues to the main injector.
- Fuel cools the chamber and upper bell before the fuel-rich preburner. That series jacket is a labeled schematic, not a measured manifold map.
- Chamber combustion is continuous. It is not a detonation.
- The nozzle inset is a pedagogical de Laval diagram, not a performance prediction.

The cover image, `public/hero-Cursor.jpg`, is an illustration. Where it disagrees with the player, the player is the model.

The Medium draft is `content/medium-article-Cursor.md`.

## Pages build

```bash
npm run build:pages
```

That sets `NEXT_PUBLIC_BASE_PATH=/full-flow-rocket-anatomy` and writes a static export to `out/`. GitHub Pages should serve the `gh-pages` branch, with `public/.nojekyll` included so `_next` is not dropped.

Live URL, once the branch is published: https://mizcausevic-dev.github.io/full-flow-rocket-anatomy/

## Product frame

1. **What it is.** A 34-second anatomy of full-flow staged combustion.
2. **Who it is for.** Students, writers, and technical managers who need the cycle without a fake spec sheet.
3. **Why it wins.** The path, the power loop, and the heat path stay traceable because unsupported numbers are omitted.
4. **Structure.** Five camera moves, a minimap, labeled scale and time changes, and a held full section.
5. **Discovery.** This page, the repository, and the Medium article.
6. **Use.** Play, scrub, step a frame, read the transcript for that shot.
7. **Completion.** The viewer can trace both propellants, both shafts, and the chamber burn. There is no form.
8. **Money.** Public technical asset. Nothing is sold on the page. The reusable part is the frame contract.
9. **Launch.** Static GitHub Pages. No tracker and no stored viewer data.
10. **After launch.** Add a number only with a cited source on the label. A start sequence would be a separate schematic.

The frame contract (segment, camera, scale label, time label, hold) can be repurposed for a turbofan, a combined-cycle plant, or a reactor without turning the player into a different product.

## Design constraints

The stage is `#0B1019`, structure is `#344257`, pathway is `#00E5FF`, energy is `#FFD166`, and state is `#9D4EDD`. Those accents are overlays. The brief's single palette replaces a multi-theme dashboard for this piece. The timeline is frame-driven canvas, because the requirement is a deterministic index from 0 to 1019.

## Security and privacy

Static site. No accounts, no forms, no cookies, no analytics tag. Do not commit secrets. The export contains the player, the page, and the hero image.
