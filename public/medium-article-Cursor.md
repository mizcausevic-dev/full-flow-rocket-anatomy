# Every Drop of Propellant Burns Twice: The Full-Flow Rocket Engine, Explained in 1,020 Frames

**A code-driven, anatomy-style motion explainer of a full-flow staged-combustion rocket engine. Feed lines, turbopumps, two preburners burning opposite mixtures, regenerative cooling, and nozzle expansion, in 34 seconds at 30 frames per second.**

*By Miz Causevic, Kinetic Gain LLC. Raptor-inspired conceptual model. Schematic, not to scale. This is a consolidated working brief, not a certified engineering reference. Verify subject-specific details before publication.*

**Live explainer:** https://mizcausevic-dev.github.io/full-flow-rocket-engine-explainer/
**Source code:** https://github.com/mizcausevic-dev/full-flow-rocket-engine-explainer
**Hero image:** `hero.svg` in the repository (1,200 x 630, Open Graph ready)

---

## BLUF: the one idea to keep

In a full-flow staged-combustion engine, nothing that can burn is thrown away before it has done two jobs.

Every stream of propellant passes through a preburner first. There it burns partially, gives up energy to spin a turbine, and then travels onward to the main combustion chamber, where it burns to completion. The pumps are powered by propellant that was going to burn anyway. The chamber is fed with gas that is already hot and already moving.

That single design decision, route everything through the fire twice, is the subject of a 34-second animation built entirely in code. One thousand and twenty frames. Thirty frames per second. Five causal phases. No video file, no rendered footage, and no specification invented to make the story sound more impressive than the mechanism already is.

If you only watch ten seconds, watch frames 150 to 299. That is where the cycle earns its name.

## Why this engine needed an anatomy lesson, not another launch video

Rocket engines are usually explained in one of two unhelpful ways.

The first is spectacle. Slow motion exhaust, a wall of fire, a thrust figure in a headline. Spectacle tells you the machine is powerful. It tells you nothing about why it works.

The second is the specification sheet. Chamber pressure, pump speed, mixture ratio, thrust, efficiency. Those numbers matter enormously to the people who design and certify engines. To a reader trying to build a mental model, they are conclusions without the reasoning that produced them.

An anatomy explainer takes the third path. It cuts the machine open in section, keeps every connection visible, and moves at the speed of causation rather than the speed of combustion. You see where each stream comes from, what it does on the way, and what it makes possible next. When the camera zooms into the pumps, the feed inlets stay in frame. When it follows hot gas toward the chamber, the turbine and the shaft it drives stay connected on screen. Nothing appears from nowhere, and nothing vanishes without a destination.

That discipline is also why the animation carries its limits on its face. Every frame is stamped with the same plain statement: not to scale, sectional schematic, time compressed, rotation slowed, no invented specifications. The turbine you see turning is turning far more slowly than any real turbine. The flame is a sustained combustion zone, explicitly not detonation. The colours are labels, not physics. Cyan means primary pathway. Gold means actuation or energy. Violet means sensing or a change of state. Real metal, real exhaust, and real flame do not look like the diagram, and the diagram refuses to pretend otherwise.

## The mechanism, phase by phase

### Phase 1, frames 0 to 149 (0 to 5 seconds): feed lines and pumps

Two inlets. Liquid methane on one side, liquid oxygen on the other. Each stream meets its own pump, and each pump sits on its own shaft.

That last point is drawn deliberately. It would be tidier to show one shared shaft driving both pumps, and some engines do package turbomachinery compactly. This explainer makes no such claim about the machine it is inspired by, so it draws no coaxial arrangement. Separate pumps, separate shafts, separate turbines to come. Accuracy in a schematic often lives in what you refuse to draw.

Nothing burns in this phase. Its job is pressure and flow, the precondition for everything downstream. Causally, it answers the first question a reader should ask: where does the energy to move all this liquid come from? Hold that question. Phase 3 answers it.

### Phase 2, frames 150 to 299 (5 to 10 seconds): both propellants, both preburners, different ratios

This is the defining move of the full-flow cycle, and the phase most summaries flatten into a sentence.

Each preburner receives both propellants. One receives most of the fuel and a small share of the oxidiser, so its partial burn stays fuel-rich. The other receives most of the oxidiser and a small share of the fuel, so its partial burn stays oxidiser-rich. Main lines and smaller cross-feed branches make that split visible, and a pair of ratio bars grows in beneath each preburner to make the proportion legible at a glance.

The bars carry no numbers. That is a deliberate editorial decision, not missing data. A mixture ratio printed without a primary source would be an invented specification, and an invented specification in an educational diagram is worse than no number at all, because diagrams get screenshotted and numbers travel. What the reader needs here is the shape of the idea: same two ingredients, opposite proportions, each tuned to the turbine it is about to drive.

### Phase 3, frames 300 to 509 (10 to 17 seconds): turbine gases travel onward to the chamber

Hot gas from each preburner expands through its turbine. The turbine extracts work. A shaft carries that work to a pump. The pump pressurises the incoming liquid from Phase 1. The loop closes.

Then comes the step that separates this cycle from simpler staged designs: the gas that just spun the turbine is not exhausted overboard. Both streams, fuel-rich and oxidiser-rich, continue through hot-gas ducts to the injector face of the main chamber. The camera follows those ducts downward and keeps the turbine, shaft, and pump in frame as long as it can, because the connection is the content.

Full-flow means exactly this. All of the flow. Through the preburners, through the turbines, and into the chamber.

### Phase 4, frames 510 to 749 (17 to 25 seconds): chamber burn and regenerative cooling

The two hot streams meet in the main chamber and burn to completion. The animation labels this carefully: sustained combustion. A rocket chamber is a controlled, continuous burn sustained for the duration of the firing. It is not a detonation, and conflating the two is one of the most common errors in popular engine writing. The diagram names the distinction on screen rather than leaving it to a footnote.

At the same time, the chamber wall opens in section. Inside the wall, cooling passages carry propellant around the chamber before that propellant is injected. The stream absorbs heat from a wall that would otherwise have to survive the full thermal load unaided, and it arrives at the injector already warmed. Cooling and feed are the same stream doing two jobs, which rhymes with the engine-level idea from Phase 3: in a well-integrated cycle, streams multitask.

One honest limitation belongs here. The precise routing of coolant through a real chamber, which stream, in which direction, through which passage geometry, is engine-specific design detail. The explainer shows the heat-pickup principle in section and says so. A schematic that labelled a specific routing as fact would be claiming knowledge it does not have.

### Phase 5, frames 750 to 1019 (25 to 34 seconds): nozzle expansion, then the whole machine

Chamber gas enters the bell nozzle, expands, and accelerates rearward. Thrust is the reaction to that accelerated mass. The diagram draws gimbal actuators beside the nozzle and pointedly states no gimbal angle, because an angle would be another invented number. Violet sensor markers, which have pulsed quietly at inlets, preburners, and chamber wall throughout, keep doing the only job assigned to them: showing where state is sensed, never what value was measured.

Then the camera does the most important thing in the piece. It pulls back. Over the final frames the pumps, preburners, turbines, chamber, and nozzle return to one wide composition, the same framing the viewer saw at frame 0, except that now every component has been visited and every connection explained. The last frames hold still. An explainer should end on the whole system, stable, because the whole system was the point.

## Built as code, not rendered as video

The explainer is not a video file. It is a small web application in which every frame is computed by a pure function of an integer.

Scrub to frame 225 and you are mid Phase 2, ratio bars at full width, cross-feeds traced. Step one frame forward, then back. The picture returns exactly. Reload the page, scrub to 225 again, export the frame as a PNG, and it matches the export from before. Camera position comes from keyframes interpolated with a smooth easing curve. Flow markers sit on named paths at positions derived from the frame index. Turbines rotate by an angle that is a direct multiple of the frame count. Change the frame, and only the frame, and the entire scene follows deterministically.

That architecture buys three things a video cannot.

First, inspection. A reader who does not believe the preburner split can pause on the exact frame, step through the branch lines, and check the topology for themselves.

Second, reuse. The transport, timeline, phase captions, state panel, and camera system know nothing about rockets. Replace the drawn anatomy and the phase table, and the same shell explains a gas turbine, a fuel cell, or a hospital dialysis circuit. The reusable asset is the explainer pattern. The rocket is its first subject, not its only one.

Third, honesty enforcement. Because every visual element is code, every claim on screen is a line a reviewer can read. There is no narration track quietly asserting a number the picture never showed. The guardrails, no pressures, no speeds, no ratios, no performance figures, are not a style guide the author tried to remember. They are properties of what was never written into the scene.

Playback runs in the browser at 30 frames per second with pause, single-frame stepping, chapter buttons for each phase, playback speed control, toggleable labels and flow markers, a frame-accurate timecode, PNG export of any frame, and a copyable JSON description of the current frame state. Keyboard controls mirror the transport: space to play or pause, arrow keys to step, shift plus arrows to jump ten frames.

## What this explainer deliberately does not do

It does not quote thrust, chamber pressure, pump rotational speed, mixture ratio, specific impulse, or efficiency. It does not state a gimbal range. It does not draw a coaxial pump arrangement. It does not present flame colour, plume shape, or part proportions as physical data. It does not decorate the scene with particles that imply instrumentation or phenomena it cannot support. Its sensor markers show that sensing exists at a location, and nothing more.

Those omissions are the editorial product. Anyone can add numbers to a rocket diagram. The work is building one that stays useful, and stays honest, with the numbers left out.

## Who this is for, and what to do with it

For engineering communicators, it is a template: pick a machine whose value lives in its connections, cut it in section, colour by function rather than by material, and let causation set the camera path.

For educators, it is a classroom-safe artefact. It can be paused mid-phase, projected, scrubbed backwards, and interrogated, and its on-screen disclaimers model the habit students most need: state your scale, state your compression, state what you are not claiming.

For teams building technical content systems, it is a proof that a single deterministic scene file can serve as the animation, the poster frame, the frame-export tool, and the source for stills, without a render pipeline. The hero image for this article is drawn from the same visual system as the animation itself.

For everyone else, it is 34 seconds after which the phrase full-flow staged combustion stops being jargon and becomes a picture you own: everything burns twice, nothing is wasted on the way, and the engine is the plumbing that makes those two facts the same fact.

## Try it, then check my work

Open the live explainer. Scrub to frame 0, then to frame 1019, and confirm the camera has come home. Pause at frame 600 and read the chamber section. Export any frame twice and compare. Then open the repository, read the timeline table, and look for a specification. You will not find one, and finding none is the verification.

That is the standard this format should be held to. Not how impressive the fire looks, but whether every claim on screen can survive a reader with a pause button.

---

**About the author.** Miz Causevic is the founder of Kinetic Gain LLC, where he works on web engineering, technical communication, and governance-first product systems. This explainer was built as a reusable, code-driven anatomy format for complex machines.

**Canonical links.**
Live explainer: https://mizcausevic-dev.github.io/full-flow-rocket-engine-explainer/
Repository: https://github.com/mizcausevic-dev/full-flow-rocket-engine-explainer
Hero image: https://mizcausevic-dev.github.io/full-flow-rocket-engine-explainer/hero.svg

**Suggested Medium tags.** Aerospace Engineering, Rocket Science, Spacex, Engineering, Data Visualization, Technical Communication, Web Development, Science Communication

**SEO title options.**
1. Full-Flow Rocket Engine Explained: Why Every Drop of Propellant Burns Twice
2. How a Full-Flow Staged Combustion Engine Works, in 1,020 Frames
3. Preburners, Turbopumps and Regenerative Cooling: A 34-Second Anatomy of the Full-Flow Cycle

**Meta description.** How does a full-flow staged-combustion rocket engine work? A code-driven anatomy explainer in 1,020 frames: feed lines, dual preburners, turbines, regenerative cooling and nozzle expansion. Schematic, no invented specs.

*Review status: consolidated working brief, not a certified engineering reference. Verify subject-specific details before publication.*
