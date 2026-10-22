# Full-Flow Rocket Engine, Explained in 1,020 Frames

**About:** Code-driven, anatomy-style motion explainer of a full-flow staged-combustion rocket engine. 34 seconds, 30 fps, 1,020 deterministic frames.

**Topics:** `rocket-engine` `full-flow-staged-combustion` `aerospace-engineering` `motion-design` `svg-animation` `technical-communication` `raptor-engine` `turbopump` `regenerative-cooling` `data-visualization`

**Live preview (GitHub Pages):** https://mizcausevic-dev.github.io/full-flow-rocket-engine-explainer/
**Medium article:** [`medium-article-Cursor.md`](./medium-article-Cursor.md)
**Hero image:** [`public/hero.svg`](./public/hero.svg) (1,200 x 630, used as the Open Graph image)

## What this is

A Raptor-inspired conceptual model drawn entirely in code (SVG + TypeScript). No video file. `render(frame)` is a pure function of the integer frame index from 0 to 1019, so any frame can be scrubbed to, stepped through, exported as PNG, and reproduced exactly after a reload.

| Frames | Time | Phase |
|---|---|---|
| 0-149 | 0-5 s | Feed lines and pumps |
| 150-299 | 5-10 s | Both propellants entering each preburner in different ratios |
| 300-509 | 10-17 s | Turbine gases onward to the chamber |
| 510-749 | 17-25 s | Chamber burn and regenerative cooling (sectional wall) |
| 750-1019 | 25-34 s | Nozzle expansion, then a held complete-system view |

Colour system: cyan `#00E5FF` primary pathway, gold `#FFD166` actuation and energy, violet `#9D4EDD` sensing and state, muted `#344257` structure, on a `#0B1019` stage. Colours are explanatory labels, not literal emission.

## Accuracy guardrails

No pressures, RPM, mixture-ratio numbers, gimbal angles, thrust figures, or coaxial pump arrangement are shown, because none are claimed. Ratio bars are illustrative proportions. Combustion is labelled as a sustained burn, not detonation. Scale change, time compression, and slowed rotation are labelled on every frame. This is a consolidated working brief, not a certified engineering reference. Verify subject-specific details before publication.

## Run locally

```bash
npm install
npm run dev     # http://127.0.0.1:43217
npm run build   # typecheck + production build to dist/
npm run preview
```

Controls: play and pause (space), restart, step one frame (arrow keys, shift for ten), scrub slider, phase chapter buttons, 0.25x to 2x speed, label and flow-tracer toggles, export frame PNG, copy frame JSON.

## Deploy (GitHub Pages)

The production build is published to the `gh-pages` branch:

```bash
npm run build
# publish dist/ to gh-pages (see repository history for the exact commands used)
```

## Reuse

The transport, timeline, camera-keyframe, caption, and state-panel shell is subject-agnostic. Swap the SVG anatomy and the `PHASES` table in `src/main.ts` to explain a gas turbine, fuel cell, or any other connected machine without touching the player.

## The 10 questions this product answers (summary dashboard)

1. **What:** deterministic, code-driven anatomy explainer of the full-flow cycle.
2. **For whom:** engineers, educators, and technical readers who need the mechanism, not spectacle.
3. **Why it wins:** causal camera work and sectional views with guardrails enforced by omission in code.
4. **Structure:** one SVG scene, five phases, pure `render(frame)`, HTML transport and state panel.
5. **Discovery:** SEO article (Medium draft included), Open Graph hero, live GitHub Pages demo.
6. **Engagement:** scrubbing, frame stepping, chapter jumps, PNG and JSON frame export.
7. **Conversion:** repository star and fork, Medium follow, Kinetic Gain contact via the live page footer links.
8. **Money:** reusable explainer format for client technical-communication work; the rocket is the reference build.
9. **Launch:** GitHub repo plus GitHub Pages, article ready to paste into Medium.
10. **Improve after launch:** add subjects (gas turbine, fuel cell) on the same shell, add narration-free chapter stills, collect frame-export usage before adding any new feature.
