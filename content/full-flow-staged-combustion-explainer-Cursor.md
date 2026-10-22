<!-- Medium title: Full-Flow Staged Combustion, Explained as a Machine -->
<!-- Subtitle: Two preburners, two turbines, a cooling jacket, and a nozzle. A Raptor-inspired section that leaves the spec sheet off the drawing. -->
<!-- Suggested slug: full-flow-staged-combustion-engine-anatomy -->
<!-- Author: Mirza Causevic. Draft dated 22 October 2026. -->

# Full-Flow Staged Combustion, Explained as a Machine

A full-flow staged combustion engine burns both propellants in preburners, runs each resulting gas through its own turbine, and then finishes the reaction in the main chamber. Nothing in that power cycle is thrown overboard. The 34-second film paired with this essay is an aligned section of that machine for liquid oxygen and liquid methane. It is a Raptor-inspired conceptual model. It is not a flight drawing, and it states no pressure, shaft speed, or gimbal angle.

The film runs 1,020 frames at 30 frames per second. The camera trucks with the propellant instead of pulling the engine apart. When the view changes scale, slows the teaching pace, or compresses a transit that would be much shorter in hardware, the frame says so. Those labels are honest about the edit. They are not a measured slow-motion factor.

> Review status: consolidated working brief, not a certified engineering or medical reference. Verify subject-specific details before publication or design use. This page is explanatory. It is not a procedure for building, operating, or inspecting an engine.

## What "full-flow" changes

Open the propellant path at the turbines and the cycle names fall into place.

In a gas-generator cycle, a small side stream burns and drives the turbines, and that turbine exhaust leaves the engine. In staged combustion, the turbine exhaust is sent onward into the main chamber, which is why the cycle is also called closed. A fuel-rich staged engine, such as the RS-25, drives its turbines with fuel-rich gas and injects the remaining oxidizer farther downstream. An oxidizer-rich staged engine, such as the RD-180, does the mirror image: all of the oxidizer and a little fuel pass the turbine, and the rest of the fuel goes to the chamber more directly.

Full-flow uses both arrangements at once. One preburner runs fuel-rich and drives the fuel turbopump. The other runs oxidizer-rich and drives the oxidizer turbopump. Essentially all of the fuel and all of the oxidizer pass through a turbine before the main chamber finishes the burn. Tim Dodd's cycle explainer draws that split as "almost all" of each propellant through its own preburner, with a minimal cross-feed of the other propellant so each preburner can burn at all. The Wikipedia summary of the cycle describes the same architecture: two shafts, two preburners, the entire supply of both propellants through the turbines.

That routing has three mechanical consequences that matter more than slogans.

The turbines see a large mass flow, so each kilogram of gas has less work to do. Public descriptions of the cycle treat that as a path to cooler turbine hardware and longer life. This page does not assign a temperature or a flight count to that claim.

Each shaft carries one propellant's pump and that propellant's turbine. The oxidizer-rich gas does not have to be sealed away from a fuel pump on the same shaft, and the fuel-rich gas does not have to be sealed away from an oxidizer pump. Removing that interpropellant seal is a reliability argument in the open literature. It is not a claim that seals, bearings, or failure modes disappear.

Both propellants arrive at the main injector as hot gas. Gas-gas mixing is the reason full-flow engines are discussed as compact, high-pressure chambers. Compactness here is a direction of the design argument. This model does not compute a chamber length.

| Cycle | Turbine drive | Turbine exhaust | Public example |
| --- | --- | --- | --- |
| Gas generator | Small burned side stream | Dumped overboard | Merlin |
| Fuel-rich staged combustion | Fuel-rich preburner | Into the main chamber | RS-25 |
| Oxidizer-rich staged combustion | Oxidizer-rich preburner | Into the main chamber | RD-180 |
| Full-flow staged combustion | Both preburners; both propellants pass a turbine | Both streams into the main chamber | Raptor |

The table is a map of cycle class. It is not a ranking of thrust, efficiency, or maturity.

## How to watch the 34 seconds

The player is a single longitudinal section with the nozzle to the right. A real powerhead wraps its turbopumps around the chamber axis. One cutting plane would miss one of them. The film rotates both spools into the same plane. That is an aligned section, a drafting convention, and the caption says so. It is not a clocking diagram. The two pumps are not drawn coaxial, because this project was required not to invent a coaxial arrangement.

Hardware stays in a muted steel. Three overlays are explanatory, and the legend says they are not literal emission:

- Cyan is the primary pathway, the "you are here" trace.
- Gold is actuation or energy: shaft work and heat.
- Violet is sensing or a change of state: liquid, hot gas, and the textbook Mach regimes.

Pipe fills are duller on purpose. A cool gray body marks oxidizer. A warm gray body marks methane. Cyan chevrons sit on top of those bodies so a material cue and a pathway cue are not the same mark.

Five chapters match five causal steps. Each shot still shows the hardware that caused it.

1. Frames 0-149. Feed lines and both pumps. The inlets remain visible.
2. Frames 150-299. Both propellants enter each preburner, in opposite proportions.
3. Frames 300-509. Turbine gas from both spools runs to the injector.
4. Frames 510-749. Steady chamber burn and regenerative cooling. The push-in is marked as a scale change, and the pace is marked as conceptual slow motion.
5. Frames 750-1019. Nozzle expansion, then a pullback. The last frames hold the whole engine still.

Chevrons keep moving during that hold. The camera does not. The system is running. The edit is finished.

## Feeds and pumps

Liquid oxygen and liquid methane cannot ride along as room-temperature gas. The tanks would be enormous. Both fly as cold liquids. The pumps exist because the chamber sits at a pressure the tank walls are not asked to carry. Fluid moves from higher pressure to lower pressure, so the pumps have to deliver propellant still above chamber pressure after every loss in cooling channels, preburners, and turbines. The film shows the machines that do that work. It does not show the pressure.

The oxidizer pump is drawn a little larger than the fuel pump. On a methalox engine the oxidizer is the larger mass flow. The size difference is comparative, so the eye can tell the spools apart. It is not a measured diameter.

Each spool is a pump and a turbine on one shaft, with bearings drawn as blocks. The bearing type is not specified. A gold segment travels the shaft to mean work, and the label says the direction is shown and the speed is not. Impellers and turbine blades rotate with the frame clock so a paused frame is reproducible. That rotation is an identifier. It is not a rotational speed.

## Why the preburners run opposite ratios

A preburner has to make turbine gas without using up the propellant the main chamber still needs.

The oxidizer-rich preburner takes most of the oxygen and a little methane. The gas that leaves is hot and still mostly oxygen. It spins the oxidizer turbine and remains the oxidizer supply for the main chamber.

The fuel-rich preburner takes most of the methane and a little oxygen. The gas that leaves is hot and still mostly methane. It spins the fuel turbine and remains the fuel supply.

The film draws those splits as thick and thin lines, and a small card of ordinal bars. The card is marked as a mathematical diagram. Bar length means "most" and "little." It is not a mixture ratio, and no number on that card would be a measurement.

The bulk methane path is the one place this section is explicitly a schematic. The line leaves the fuel pump, runs aft to a manifold near the nozzle, returns through channels in the wall, and only then enters the fuel-rich preburner. Several public explainers describe methane cooling the wall before the fuel-rich preburner. A Federal Aviation Administration plume appendix for a Starship environmental review says the baseline booster engine it analyzes uses a closed power cycle and a regeneratively cooled thrust chamber nozzle. That sentence confirms a cooling jacket on the engine under analysis. It does not publish the tap point, the channel count, or the manifold station. The film therefore labels the route "schematic." If a later drawing from the manufacturer shows a different takeoff, the jacket still has the same job: keep the wall intact and leave the absorbed heat in the propellant.

The small cross-feeds are the other half of the same idea. A little oxygen has to reach the fuel-rich preburner, and a little methane has to reach the oxidizer-rich preburner, or those chambers have nothing to burn. Where the lines cross the hot-gas ducts, the duct is drawn in front. The crossing is not a joint.

## Turbine gas is propellant

Downstream of each turbine, the gas is lower in pressure and temperature than it was at the turbine inlet, because the turbine took shaft work out of it. It is still propellant. In a full-flow engine both of those streams turn inward and feed the main injector.

That is the whole distinction from a gas generator. The gas-generator stream has already been burned too far, in the wrong place, to be worth piping into the chamber, so it leaves. The full-flow streams were burned only far enough to drive the pumps. The main chamber is where the reaction is finished.

The injector face in the film is a row of paired holes. A real full-flow injector mixes oxidizer-rich gas and fuel-rich gas at the element, not as two unmixed halves of the chamber. The row is marked schematic. It is not an element map, and it is not a claim about swirl, pintles, or face pattern.

## Chamber burn and the cooling jacket

The gold wash in the chamber is an energy overlay. It is not a photograph of a flame and not a computed heat-release field. The reaction it stands for is steady deflagration: a subsonic flame held where the incoming gas keeps it. A detonation is a different regime, a supersonic combustion wave coupled to a shock. Rotating detonation engines are a different device. This film does not depict one. The caption says so because a gold glow is easy to misread as an explosion.

The chapter is marked slow motion, conceptual. A parcel of gas does not spend eight seconds in a chamber of this class. No residence time is stated, so no slow-motion factor is stated either. The mark only tells you the edit is slower than the hardware.

While that burn is on screen, the wall is opened into channels. Gold ticks point from the hot gas into the metal and then into the methane. Violet is reserved for the state change along the coolant, which is "the coolant gets hotter in this direction," not a temperature. The heat taken out of the wall is not thrown away. It rides with the methane into the preburner and, later, into the chamber. That is the regenerative part of regenerative cooling. The channel count, the liner alloy, and the coolant state (liquid, supercritical, or gas) are omitted. Those are real design choices. They are not things this section can honestly draw.

A violet dot on the outside of the chamber is a sensor tap with no reading. It marks that a flight engine is instrumented. It is not a sensor map.

## What the nozzle is doing

Past the chamber, the wall converges to a throat and then diverges into a bell. NASA's Glenn Research Center primer on nozzle design states the textbook picture this film labels and does not solve:

The throat is the minimum area. When the nozzle is choked, the Mach number at the throat is 1, and that throat sets the mass flow. Downstream, a diverging wall can accelerate a supersonic flow. Static pressure and temperature fall as the gas speeds up. If the throat is not choked, the diverging section does the opposite and the flow stays subsonic. The exit Mach number of a choked nozzle depends on the area ratio. This contour is not that calculation. The bell is a smooth schematic, labeled as such, and it is not a Rao optimum.

The violet words in the divergent section (subsonic in the chamber, sonic at the throat, supersonic in the bell) are regime names from that textbook picture. They are not a CFD result. The small card during that shot is marked "mathematical diagram" so it cannot be mistaken for the metal. Shock diamonds and plume afterburning are left out. Both depend on the pressure outside the nozzle, and neither belongs on a section that refuses to state pressures.

The pullback at the end is the accountability shot. Every part from the previous chapters is still there, the chevrons still follow the path, and the camera stops. A film that ends on a detail implies the detail is the machine. The machine is the path.

## Published figures this model leaves off the drawing

An FAA appendix on exhaust-plume calculations for a SpaceX Starship environmental review describes the baseline Super Heavy booster engine it analyzes as liquid oxygen and liquid methane, closed cycle, with a regeneratively cooled thrust chamber nozzle. In that document the nozzle area ratio is 34.34:1, the injector-face stagnation pressure used for the analysis is 3669.5 psia, and the engine mixture ratio is 3.60, which the appendix calls somewhat fuel-rich. Those are analysis inputs in an environmental study. They are quoted here so a reader can find the primary document. They are not drawn on the film, they are not recomputed here, and they should not be treated as a timeless description of every Raptor variant or of a later vehicle layout. The appendix also states an engine count for the baseline stage it studied. Vehicle engine counts have been discussed differently in other public contexts, so this essay does not repeat a count as current.

Popular articles often cite round numbers near 300 bar and turbine temperatures from unofficial models. Some of those pages label the temperatures as model output. This essay does not promote them to measurements.

## The engines that framed the cycle

Three programs are enough context. More would turn the essay into a catalog.

The Integrated Powerhead Demonstrator was a U.S. ground engine, liquid oxygen and liquid hydrogen, built to show full-flow staged combustion. NASA's release on the test that reached steady-state 100 percent power describes a fuel-rich preburner driving the fuel turbopump and an oxidizer-rich preburner driving the oxygen turbopump, about 250,000 pounds of thrust, and a longer turbine life as the reason the extra mass flow matters. The same release says the demonstrator itself will not be flown. It is a hydrogen engine. The film is methalox. The cycle idea is what they share.

The Soviet RD-270 was an earlier full-flow design aimed at a launcher that did not fly. It belongs in the history of the cycle. It is not a template for the geometry on screen.

SpaceX Raptor is the flown methalox example in the sources above. The film borrows the cycle and the propellants. It does not borrow unpublished powerhead packaging, a gimbal schedule, or a claim about how many times an engine has been, or will be, fired.

## What this page is for

Use the player when you want the causal chain in order: cold liquids, two pumps, two opposite preburners, two turbines, one chamber, a jacket that puts heat back into the methane, and a nozzle that trades thermal energy for directed velocity once the throat is choked.

Use this essay when you want the boundaries. Cyan, gold, and violet are teaching colors. The aligned section is a drafting choice. The cooling takeoff is a schematic. The Mach labels are a textbook regime, not a solved flowfield. The FAA figures are a cited analysis case, not a number this model produced.

The repurposing is straightforward. The same frame clock, the same three-overlay legend, and the same rule (if the mechanism cannot be drawn faithfully, mark a schematic) fit a turbofan, a combined-cycle plant, or a refrigeration loop. The discipline is the product. The engine is the first subject.

## Sources

- Federal Aviation Administration, "Appendix G, Exhaust Plume Calculations," SpaceX Starship environmental review materials. Closed cycle, regenerative cooling, area ratio 34.34:1, injector-face stagnation pressure 3669.5 psia, mixture ratio 3.60. [PDF](https://www.faa.gov/sites/faa.gov/files/space/stakeholder_engagement/spacex_starship/Appendix_G_Exhaust_Plume_Calculations.pdf)
- NASA, "New Rocket Engine Combustion Cycle Technology Testing Reaches 100% Power Level." Integrated Powerhead Demonstrator, full-flow staged combustion, liquid oxygen and liquid hydrogen, ground engine. [Release](https://www.nasa.gov/news-release/new-rocket-engine-combustion-cycle-technology-testing-reaches-100-power-level/)
- NASA Glenn Research Center, "Nozzle Design," Beginner's Guide to Aeronautics. Choked throat at Mach 1, supersonic expansion in the divergent section, and the subsonic counterexample. [Primer](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/nozzle-design/)
- Tim Dodd, "Rocket Engine Cycles," Everyday Astronaut. Qualitative routing for full-flow: both propellants through preburners and turbines, minimal cross-feeds. [Essay](https://everydayastronaut.com/rocket-engine-cycles/)
- "Staged combustion cycle," Wikipedia, section on full-flow staged combustion. Secondary summary of the twin-shaft cycle. [Article](https://en.wikipedia.org/wiki/Staged_combustion_cycle)

Mirza Causevic. 22 October 2026.
