# Full-Flow Rocket Engine, Explained in 34 Seconds

**Subtitle:** How a full-flow staged combustion engine feeds every drop of propellant through a preburner and a turbine before it burns, traced in 1,020 code-driven frames with no invented numbers.

**SEO title (for Medium settings):** Full-Flow Rocket Engine Explained: Preburners, Turbines, Regenerative Cooling, and Nozzle Expansion in 34 Seconds

**Meta description:** A code-driven anatomy explainer of full-flow staged combustion. Trace methane and oxygen from feed lines through fuel-rich and oxidizer-rich preburners, turbines, regenerative cooling, and nozzle expansion. Raptor-inspired conceptual model with no invented pressures, RPM, or thrust figures.

**Tags:** Rocket Science, Aerospace Engineering, Propulsion, Engineering Visualization, Science Communication, Spaceflight

**Hero image:** `hero-Cursor.svg` (1600 x 900). Alt text: "Sectional diagram of a full-flow rocket engine showing methane and oxygen feeds, separate fuel and oxidizer pumps, fuel-rich and oxidizer-rich preburners, main chamber, and bell nozzle, with cyan for propellant flow, gold for turbine energy, and violet for sensing."

*By Kinetic Gain LLC. Raptor-inspired conceptual model. Not a certified engineering reference. Verify subject-specific details before publication or engineering use. This article is explanatory only. It is not flight, test, ground-handling, or propellant-handling instruction for any real engine.*

---

## The one-sentence version

In a full-flow staged combustion engine, **all** of the fuel and **all** of the oxidizer pass through a preburner and a turbine before they reach the main combustion chamber, so the work of driving the pumps is done by propellant that still gets burned for thrust afterward.

Follow the cyan line and you follow mass. Follow the gold line and you follow energy. When they are the same line, you have understood the cycle.

That single design decision is the whole subject. Everything else in this article is plumbing, fire, and cooling arranged to make that sentence physically possible.

## Why this needed an anatomy explainer, not another cutaway poster

A cutaway poster shows where parts sit. It cannot show why a small stream of oxygen crosses into a fuel-rich preburner, or why turbine exhaust in this cycle has somewhere important to go instead of an overboard pipe. Those are causal claims, and causal claims need time.

So this piece runs 34 seconds at 30 frames per second: exactly 1,020 frames, indexed 0 to 1019. Five acts. A timeline you can scrub backward. That last property is the test of honesty. If scrubbing backward does not reverse the impeller, the animation is decoration driven by a clock. Here every visual state is a pure function of one integer, the frame number. Camera position, flow offset in the pipes, impeller angle, turbine angle, flame intensity, sensor pulse, and plume opacity are arithmetic on that integer. Pause it and the engine pauses. Reverse it and the engine reverses. There is no hidden simulation state to disagree with the frame counter printed in the corner.

The color system is a reading system, not an emission system. Cyan (#00E5FF) marks the primary propellant pathway. Gold (#FFD166) marks actuation and energy: valves, shafts, turbine work, hot-gas drive. Violet (#9D4EDD) marks sensing and state change: sensor points and the moment a cold liquid becomes a hot gas. Hardware stays a muted structural blue-grey (#344257) on a near-black technical stage (#0B1019), so diagram, hardware, and math never compete for the same pixel language.

## Act 1, frames 0 to 149 (0 to 5 seconds): the engine starts as plumbing

Methane and liquid oxygen arrive from the vehicle feed system. Gold valves meter the start sequence. Two turbopumps begin to turn.

Notice what the drawing insists on: the fuel pump and the oxidizer pump sit on **separate shafts**. Not coaxial. Popular diagrams compress pump arrangements for symmetry, and a careless viewer walks away believing a shared shaft is a fact about this class of engine. It is not claimed here because it is not part of the concept being taught.

Nothing has burned yet. That is the point of spending five seconds on plumbing. Everything later spends the pressure built in this act. Skip Act 1 and the preburners look self-powered. They are not. A pump is how a liquid propellant is given enough pressure to flow into places that are actively trying to push it back out, including a combustion chamber at full burn.

By frame 149 the impellers are spinning (their angle is frame times a constant, which is why your scrub bar controls them), the feed lines are fully traced in cyan, and the split tees ahead of the preburners are visible. The next act only makes sense because this one happened.

## Act 2, frames 150 to 299 (5 to 10 seconds): two preburners, two opposite leans

Each propellant stream now splits, and this split is the most commonly rushed step in popular explanations.

Most of the methane goes to one preburner. A smaller stream of oxygen joins it. With fuel in excess, that preburner partially burns into a hot, **fuel-rich** gas: mostly unburned fuel carrying combustion heat.

Most of the oxygen goes to a second preburner. A smaller stream of methane joins it. With oxidizer in excess, it partially burns into a hot, **oxidizer-rich** gas.

A preburner needs both propellants to burn at all. "Rich" names which one is left over. That left-over identity matters downstream, because the fuel-rich gas and the oxidizer-rich gas are kept apart until the main chamber. Mix them early in the plumbing and you would have built a very short, very committed rocket in the wrong place.

The explainer's mixture bars are qualitative by design. A long cyan segment and a short pale segment show emphasis. They do not show a ratio you may quote, because no ratio is claimed. This restraint is not a gap in the research. It is the research ethic of the piece. A conceptual model that invents a precise-looking number teaches a false memory that a reader will repeat with confidence. A labeled qualitative bar teaches the true relationship, which is the only thing a conceptual model is entitled to teach.

Violet earns its place here. It marks the state change: cryogenic liquid in, hot gas out. Same molecules, new job.

## Act 3, frames 300 to 509 (10 to 17 seconds): the turbine is a toll booth, not an exit

Now trace one gold path with your eye and do not let go of it.

Hot fuel-rich gas leaves its preburner and expands through the fuel turbine. The turbine extracts work. A gold dashed shaft line carries that work up to the fuel pump from Act 1, which is the causal loop closing in plain sight: the pump made the preburner possible, and the preburner now makes the pump faster.

Then the same gas, having paid its toll of work, **continues onward to the main combustion chamber**.

Do the same trace on the oxidizer side. Same structure, mirrored.

This is the full-flow idea, and it is worth stating against its alternative. In engine cycles that dump turbine drive gas overboard after the turbine, a fraction of propellant pays for pumping and never contributes to chamber thrust. Other cycles route around the problem differently, each with its own trade. Full-flow staged combustion refuses the overboard trade entirely: both turbine streams remain propellant for the main burn.

The cost is real, and a conceptual article should name categories of cost even when it refuses numbers. Two preburners instead of one. Hot oxidizer-rich gas, which is an aggressive environment for materials, moving through a turbine. A start and control sequence with more coupled elements, because now fuel and oxidizer sides each depend on the other's preburner behaving. Complexity is the price. Keeping every drop in the thrust story is the purchase.

The camera in this act follows the gold lines toward the chamber and begins to tighten. The wide system view is gone. That is deliberate: for seven seconds, the only question that matters is "where does the turbine gas go," and the framing refuses to let you answer a different one.

## Act 4, frames 510 to 749 (17 to 25 seconds): a burn, protected by its own fuel

Both hot-gas streams now inject into the main combustion chamber, meet, and sustain the main burn.

One vocabulary point, because it is a common and consequential confusion: **this combustion is not a detonation.** Detonation is a supersonic, shock-coupled combustion event. A rocket combustion chamber sustains a continuous, anchored burn fed by continuous injection, closer in kind to an extraordinarily violent burner than to a repeating explosion. Conflating the two produces bad intuitions about stability, control, and failure in every direction.

Around that burn runs the second story of this act, and it shares a wall with the first.

Cold fuel travels through small channels machined or formed in the chamber and nozzle wall before it goes to burn. Moving through those channels it absorbs heat from a wall that the burn is trying to destroy. The warmed fuel then continues into the combustion process, carrying the rescued heat with it. Nothing is discarded. The coolant becomes propellant, on schedule, a fraction of a second later.

That is regenerative cooling, and it is why Act 1's fuel line appears to take a detour in the diagram. The detour is the survival strategy of the wall and a modest recycling of energy in a single path.

The explainer drops a magnified wall cross-section into an inset here: hot wall on one side, coolant channels as cyan cells, heat moving into the stream. It is labeled as what it is: **scale changed, labeled schematic.** Honest scale changes must announce themselves. A channel you can see at this zoom is a teaching channel, not a dimensioned one, and the label is part of the engineering content, not a disclaimer stapled to it.

Violet sensors watch this act at the chamber and throat. Their pulse is a reading convention, not a claim about sampling rates. Another small honesty rule: never let an animation's rhythm impersonate data.

## Act 5, frames 750 to 1019 (25 to 34 seconds): spend pressure, buy velocity

Chamber gas reaches the nozzle throat, the narrowest point of the passage, and then expands down the widening bell. As the gas expands, its pressure falls and its velocity rises. The vehicle receives the equal and opposite bookkeeping entry: thrust.

The plume in the explainer is a labeled schematic. Its shock-diamond rhythm is drawn to teach "structured supersonic exhaust," not to report a computed flow field. Computational fluid dynamics this is not, and it does not dress as it.

Then the camera does the most important thing in the entire 34 seconds. It pulls back, widens past the preburners and pumps to the full system, and **holds**. From roughly frame 950 to frame 1019 nothing dramatic happens, on purpose. Flows run steady. The flame holds. The complete loop sits in one frame: feed, pumps, split, two preburners, two turbines, chamber, cooling jacket, throat, bell.

End on the system, not on the exhaust. The exhaust is an effect. The system is the subject.

## What this explainer deliberately refuses to tell you

It gives no chamber pressure. No turbopump RPM. No gimbal angle. No thrust figure. No specific impulse. No efficiency percentage. No claim that this cycle beats another cycle by a margin.

Those numbers exist for specific real engines, in specific variants, on specific dates, in primary documentation. Attaching a real engine's number to a conceptual drawing is how plausible misinformation gets manufactured: a true figure, a generic picture, a false marriage between them. The refusal list is printed on the hero image itself, because a reader who only ever sees the hero image should still leave with the boundary conditions.

If you need engineering values, the path is primary sources for a named engine and variant, not explainers, including this one. This piece sits upstream of that need. It exists so that when you do read the primary source, the words "fuel-rich preburner turbine discharge" land on a picture you already own.

## How it was built, for the code-curious reader

One deterministic function: frame in, picture out.

- **Timeline:** 1,020 frames at 30 fps. Acts at frames 0, 150, 300, 510, and 750, matching 0, 5, 10, 17, and 25 seconds.
- **Camera:** eased interpolation between labeled keyframes (wide, pumps, preburners, hot-gas path, wall section, full-system hold). Easing is a smoothstep, so the camera accelerates and settles rather than sliding at constant speed.
- **Flow:** stroke dash offset as a function of frame. Scrub and the flow scrubs. It has no memory.
- **Rotation:** impeller and turbine angles are arithmetic on frame number. Deterministic in both directions.
- **State changes:** opacity ramps windowed to act boundaries. Nothing appears without a frame range that owns it.
- **Guardrails:** no decorative particles, no physics solver impersonating CFD, no unlabeled scale change, and a `prefers-reduced-motion` path in the page CSS.

Build the same way for any system where a resource does two jobs in sequence: a turbocharger, a heat pump, a regenerative brake, a desalination loop. One accent for mass flow, one for energy and actuation, one for sensing and state change. Five acts. A scrub bar. Labels that confess every time scale or time is manipulated ("slow motion," "time compression," "enlarged section"). The visual pattern transfers because the honesty rules transfer.

## The short version to carry away

1. Pumps first. Pressure is the budget everything else spends.
2. Split both propellants. Each preburner gets both, in opposite leans.
3. Let each hot gas pay a turbine toll, then keep it. Nothing overboard.
4. Burn both streams together in the main chamber. A burn, not a detonation.
5. Run cold fuel through the wall on its way to burn. Cooling that pays itself back.
6. Trade pressure for velocity at the nozzle. Then look at the whole loop at once.

Six sentences, zero invented numbers, one complete engine. That is what a conceptual model owes you.

---

*Kinetic Gain LLC builds code-driven technical explainers and directory systems. This article and its animation are explanatory only and are not certified engineering references. Verify subject-specific details before publication, instruction, or engineering use.*

**Canonical interactive version:** GitHub Pages deployment linked from the repository README. **Hero image:** `hero-Cursor.svg`. **Source article file:** `MEDIUM-ARTICLE-Cursor.md`.
