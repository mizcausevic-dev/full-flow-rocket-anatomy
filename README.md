# Full-Flow Rocket Engine, Explained in 34 Seconds

Code-driven, anatomy-style motion explainer of a full-flow staged combustion rocket engine. 1,020 frames (0–1019) at 30 fps. Deterministic timeline: `render(frame)` is a pure function of frame.

**Live preview (GitHub Pages):** Enable in repo Settings > Pages. Source: GitHub Actions (workflow in `.github/workflows/pages.yml`) or `gh-pages` branch. URL pattern: `https://<owner>.github.io/<repo>/`

## What it is
Five acts: feed lines + pumps (0–149), both propellants in both preburners at different qualitative ratios (150–299), turbine gases to chamber (300–509), chamber burn + regenerative cooling (510–749), nozzle expansion + full-system hold (750–1019). Cyan = primary pathway, gold = actuation/energy, violet = sensing/state. Raptor-inspired conceptual model.

## Accuracy guardrails
No invented pressures, RPM, gimbal angle, or coaxial pump arrangement. Pumps drawn on separate shafts. Combustion is a sustained burn, not detonation. Mixture bars, plume, Mach diamonds, and wall channels are labeled qualitative schematics, not CFD or dimensioned geometry. Not a certified engineering reference.

## Run locally
```bash
npm install
npm run dev   # http://127.0.0.1:43217
npm run build # dist/ for GitHub Pages
```

## Files
- `index.html`, `src/main.js`, `src/style.css` — explainer app
- `public/hero-Cursor.svg` / `hero-Cursor.svg` — Medium hero (1600x900)
- `MEDIUM-ARTICLE-Cursor.md` — full Medium article (SEO title, meta, tags, hero alt text)
- `.github/workflows/pages.yml` — GitHub Pages deploy via Actions

## GitHub repo setup (About + Topics)
- **About:** Code-driven 34s anatomy explainer of a full-flow staged combustion rocket engine. 1,020 deterministic frames.
- **Topics:** `rocket-engine` `aerospace-engineering` `full-flow-staged-combustion` `raptor` `propulsion` `regenerative-cooling` `engineering-visualization` `science-communication` `vite` `svg-animation`
Set these in repo Settings (About gear) under owner `mizcausevic-dev`.

## Medium publishing
Paste `MEDIUM-ARTICLE-Cursor.md` into Medium, set the SEO title/meta in article settings, upload `hero-Cursor.svg` (or exported PNG) as hero, link the GitHub Pages URL as canonical interactive version.

## Deploy to GitHub Pages
1. Push `main`. 2. Repo Settings > Pages > Source: GitHub Actions. 3. Actions tab: "Deploy to GitHub Pages" runs on push to main and publishes `dist/`. Alternative branch mode: Settings > Pages > Deploy from branch > `gh-pages` / root (this repo also pushes a prebuilt `gh-pages` branch).
