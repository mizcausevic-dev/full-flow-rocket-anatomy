# Full-Flow Staged Combustion, Explained in 34 Seconds

**SEO title:** Full-Flow Staged Combustion, Explained in 34 Seconds

**Meta description:** A 34-second anatomy of a Raptor-inspired full-flow engine: two shafts, two preburners, chamber burn, wall cooling, and nozzle expansion, with no invented pressures or speeds.

**Slug:** full-flow-staged-combustion-explained

**Canonical player:** https://mizcausevic-dev.github.io/full-flow-rocket-anatomy/

**Hero file:** `public/hero-Cursor.jpg` in the repository. Upload that file as the Medium hero.

**Hero alt:** Cutaway illustration of a sectioned methalox full-flow engine on a dark stage, with cyan pathway lines, gold shafts, and violet state markers. The illustration is a cover, not a measured plumbing diagram.

**Tags:** Aerospace, Rocket Engines, Propulsion, Engineering, Full-Flow Staged Combustion

---

A full-flow staged combustion engine sends both propellants through preburners, uses those hot gases to drive two turbopumps, and then burns the turbine exhaust in the main chamber. The 34-second player linked above is a Raptor-inspired model of that path. It is not a Raptor drawing, it is not a SpaceX document, and it does not contain a chamber pressure, a pump speed, or a gimbal angle.

I left those numbers off on purpose. A topology you can trace is useful. A precise-looking figure with an invented operating point is not.

SpaceX public descriptions identify Raptor as a methane-oxygen engine using full-flow staged combustion. That is the family this model belongs to. The pipe routes, the bell contour, the cooling-channel count, and the cover illustration are teaching drawings. Where the cover disagrees with the player, the player is the model.

## The path in steady operation

The tour is not a start sequence. Bootstrap, ignition, and shutdown are different machines in time. What is on screen is the engine once propellant is already moving.

Read it from the inlets down.

Liquid oxygen enters the oxidizer turbopump. Liquid methane enters the fuel turbopump. The pumps do not share a shaft. Each shaft continues down to the turbine on that same side.

In this schematic, methane leaving the fuel pump runs down the outside of the engine, into an aft manifold, and up through channels in the chamber wall and the upper bell. It picks up heat from the liner. It then returns to the fuel-rich preburner. I am calling that a series jacket. It is a common way to teach the heat path. It is not a claim about the manifold layout of any specific engine serial number.

A small fuel tap leaves that circuit and enters the oxidizer-rich preburner, which also receives the bulk of the oxygen. A small oxygen tap enters the fuel-rich preburner with the bulk of the methane. The thicker line is the bulk fluid. The thinner line is the tap. There is no mixture ratio on the label, because I do not have one I am willing to print.

Each preburner feeds the turbine on its own side. The turbine and the pump share the shaft you can see between them. Gold on that shaft means shaft work, the energy overlay, not a claim that the metal is gold. The arrow points into the pump because that is the machine the turbine is driving.

Gas leaving each turbine has already had work taken out of it, and it is still propellant. Both streams go to the main injector. They meet in the chamber and burn. The throat and the bell then expand the gas.

That is the whole cycle this model is willing to defend.

## Why the preburners run at opposite biases

A turbine needs a large mass flow and a temperature its metal can survive. The hottest mixture is the one closest to a stoichiometric burn, where fuel and oxidizer are present in the proportion that releases the most heat. A preburner that stayed near that proportion would make a poor turbine drive if the point of the preburner is to process a lot of propellant without melting the blades.

Full-flow staged combustion avoids putting either turbine on that peak by splitting the bias. One preburner is oxidizer-rich: most of what flows through it is oxygen, with only enough fuel to burn and make drive gas. The other is fuel-rich: most of what flows through it is methane, with only enough oxygen to do the same job. The main chamber is where those two biased streams finally burn together.

The player shows that with pipe weight and a violet state marker. Violet means "the state changed," not "a flight sensor is installed here." I did not draw a sensor suite.

Oxygen-rich drive gas is chemically aggressive toward many metals. That is a real materials constraint on the oxidizer side of this cycle. I am not naming an alloy, because naming one would imply I had inspected a specific turbine.

## The turbine exhaust is the chamber's propellant

This is the part the name is about. In a full-flow cycle, the flow that drove the turbines continues into the main chamber. The propellant is not split into a small burned stream that only turns a turbine and a separate raw stream that only feeds the chamber. Both propellants have been through a preburner and a turbine by the time they arrive at the injector.

What the turbine took was shaft work. What remains in the gas is still chemical potential, because each stream left its preburner far from a complete burn. The chamber finishes the combustion that the preburners deliberately did not finish.

The ducts in the player are drawn time-compressed between 10 and 17 seconds. A chevron is a reading aid. It is not a velocity.

## Combustion here is a burn

Rocket chambers of this type are built for continuous combustion. The flame is anchored, the flow is fed, and the process continues as long as the propellant arrives. That is deflagration in the broad sense: a burn propagating by heat and mixing, subsonic relative to the gas, sitting upstream of a nozzle that may be choked.

Detonation is a different regime. A detonation couples a shock to the reaction and travels supersonically through the mixture. Rotating detonation engines are a separate architecture. Nothing in this tour is that. The chamber shot is explicitly slowed, from 17 to 25 seconds, so the mixing region can be read, and the caption says the burn is not a detonation.

I also left shock diamonds out of the bell. A diamond pattern is a real plume feature when the exit pressure does not match the ambient pressure. Drawing one would imply an expansion condition this model does not claim. The cyan lines in the bell are expansion paths. They are not a photograph of an exhaust plume.

The violet dashed line in the chamber is a mixture-state marker between the oxidizer-rich stream and the fuel-rich stream. It is an annotation. It is not a measured contour and it is not a shock.

## Regenerative cooling is the fuel carrying heat back into the cycle

The chamber wall and the upper nozzle cannot sit in the gas stream unprotected. In regenerative cooling, a propellant flows through passages in the wall, the liner conducts heat into that propellant, and the heat stays in the cycle because the coolant is propellant you were going to burn anyway.

In this model the coolant is the fuel, and the jacket sits upstream of the fuel-rich preburner. Cold methane, relative to the gas, enters toward the aft end of the cooled section and moves forward, toward the injector end, then returns to the preburner. Direction is part of the teaching point: the camera finds the jacket during the chamber shot because that is where the heat is, but the fuel in those channels has not burned yet. A label says so. If you only remember "cooling happens after combustion," you have the camera order and the fluid order swapped.

At about 22 seconds the camera enlarges the wall. The label says the scale changed. The slots you can count are illustrative. I do not know, and I am not inventing, a channel count, a channel aspect ratio, or a coolant velocity.

Heat is marked in gold, from the gas toward the wall. Gold is the energy overlay. The wall itself stays metal gray.

## The nozzle is a shape that trades pressure for speed

Upstream of the throat, the gas in a conventional chamber is subsonic. In subsonic flow, a narrowing passage accelerates the gas and the static pressure falls. If the pressure ratio is high enough, the throat chokes: the speed there reaches the local speed of sound. Downstream, the relation reverses. In supersonic flow, a widening passage accelerates the gas further, and the static pressure keeps falling. A de Laval nozzle is the converging section, the throat, and the diverging bell used together.

That is the principle on the inset diagram between 25 seconds and about 32 seconds. The curves are hand-shaped. Velocity rises, pressure falls, and both change in a way that is meant to be read through the throat. They are not the result of integrating the area-Mach relation along this contour. There is no gamma, no area ratio, and no exit Mach number, because those would be a performance model. The axis says "unscaled" for that reason.

The bell outline is a smooth schematic. It is not a Rao contour and it is not a claimed Raptor nozzle.

The last two seconds pull the camera back and hold. Impellers, chevrons, and the camera stop. The frame is there to be read: oxidizer side, fuel side, two preburners, chamber, nozzle.

## How the 34 seconds are cut

| Clock | Frames | What the camera is doing |
| --- | --- | --- |
| 0:00-0:05 | 0-149 | Inlets and the two turbopumps. Preburners enter at the bottom of the frame. |
| 0:05-0:10 | 150-299 | Both propellants into each preburner, bulk line versus tap. |
| 0:10-0:17 | 300-509 | Turbine gas traced to the injector, with shaft work still marked. |
| 0:17-0:25 | 510-749 | Chamber burn, then an enlarged regenerative wall. |
| 0:25-0:34 | 750-1019 | Throat, bell, pedagogical diagram, then a held full section. |

The clock is 30 frames per second. Frame 1019 is the last frame of a 1,020-frame timeline. The animation state is a pure function of that index. There is no random particle field and no clock besides the frame.

A minimap stays on the film so a close-up does not forget the machine it belongs to. The breadcrumb marks which shot is current. Previous shots stay marked, because the path is cumulative.

## What I refused to draw

Pressures, temperatures as numbers, thrust, specific impulse, pump speed, mixture ratio, expansion ratio, and gimbal angle.

A coaxial turbopump. Public discussion of Raptor hardware has included argument about shaft layout. This model uses the textbook arrangement, one shaft per propellant side, and says so. It does not settle a hardware argument it did not inspect.

A specific injector element pattern. The face is a bar with two ports. Counting holes would have implied an element count.

A startup, a throttle ramp, or a shutdown.

Detonation, a fireball, or shock diamonds.

Any overlay that pretends to be a measured field. Cyan is the primary pathway. Gold is actuation or energy. Violet is a state change. The metal is the hardware. The inset axes are a diagram. Those three layers are not the same kind of object, and the player keeps them visually separate.

## How to watch it, and what would make it a certified description

Play it once without stopping. Then scrub. The cuts worth pausing on are the moment both taps are visible, the moment the gold shaft and the turbine exhaust are in the same frame, the enlarged wall, and the held final frame.

The player is the authority for the routing in this project. The Medium hero is a cover illustration. Treat it as a picture of the subject, not as a second schematic.

Turning this into a description of a real engine would require a cited geometry, a named engine revision, and operating points taken from a source you can open. Until those exist on the label, the correct reading is the one the lower third already gives you: steady full-flow path, both propellants drive turbines, then they burn together in the chamber.

The same frame contract can teach a different machine later. A turbofan, a combined-cycle plant, or a chemical reactor can use the same rules: one segment per causal step, the previous step still in frame, scale and time called out when they change, and a held last frame with no new claim hiding in the decoration. The engine changes. The refusal to invent the spec sheet should not.

---

*Review status: consolidated working brief, not a certified engineering or medical reference. Verify subject-specific details before publication or design use. Medical subjects are outside this piece. This article explains a rocket-engine cycle. It is not an instruction to build, fuel, or fire an engine.*

*Player: https://mizcausevic-dev.github.io/full-flow-rocket-anatomy/*

*Source: https://github.com/mizcausevic-dev/full-flow-rocket-anatomy*
