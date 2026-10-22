import Image from "next/image";
import { EnginePlayer } from "@/components/engine-player";
import { display, mono } from "@/lib/fonts";
import { DESCRIPTION, REPO_URL, SITE_URL } from "@/lib/site";

const shots = [
  {
    clock: "0:00-0:05",
    frames: "0-149",
    title: "Feed lines and pumps",
    body: "Liquid oxygen and liquid methane enter on separate lines. Each side has its own turbopump and its own shaft. The camera starts on the inlets and moves down until the preburners begin to enter the frame. The small rotating inset is an along-shaft view of the impeller, and it is marked time-compressed. No rotational speed is stated. A coaxial pump is not drawn.",
  },
  {
    clock: "0:05-0:10",
    frames: "150-299",
    title: "Preburners, two ratios",
    body: "The camera moves from the oxidizer-rich preburner to the fuel-rich preburner. Each can receives both propellants. The thick inlet is the bulk fluid. The thin inlet is the tap from the other side. Violet marks the mixture state. The thicknesses are qualitative. No mixture ratio is stated.",
  },
  {
    clock: "0:10-0:17",
    frames: "300-509",
    title: "Turbine gas to the chamber",
    body: "Hot gas from each preburner drives the turbine on that side. Gold marks shaft work going back up into the pump that fed the circuit. Gas leaving the turbine is still propellant. Both ducts continue to the main injector. Duct transit is time-compressed so the path can be followed. The pumps remain on the minimap, so the power loop stays visible while the camera moves down.",
  },
  {
    clock: "0:17-0:25",
    frames: "510-749",
    title: "Chamber burn and cooling",
    body: "The two streams meet and burn continuously. The violet dashed line is a mixture-state marker, not a shock. The shot is slowed and labeled as combustion, not detonation. The camera then enlarges the wall. Fuel in the jacket is moving aft to forward, taking heat out of the liner, and that fuel is upstream of the fuel-rich preburner in this schematic. The enlargement is labeled. Channel count is illustrative.",
  },
  {
    clock: "0:25-0:34",
    frames: "750-1019",
    title: "Nozzle expansion",
    body: "The camera travels through the throat and down the bell. Cyan lines in the bell are expansion paths, not a measured plume. The inset is a mathematical diagram: a pedagogical curve of velocity rising and pressure falling. It is not integrated from this contour and it states no Mach number. The camera then pulls back. From 32 seconds to 34 seconds the whole engine is held still.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-[11px] tracking-[0.18em] text-[#00E5FF] uppercase">
          Aerospace engineering · steady-operation tour
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
          Full-flow staged combustion, in 34 seconds
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[#C5D0DE]">{DESCRIPTION}</p>
        <p className="max-w-3xl text-sm leading-6 text-[#9AA8BA]">
          Raptor-inspired conceptual model. One frame index drives every camera move, label, and flow marker. 30 frames per second, frames 0 through 1019. This is a working explainer, not a certified engine description.
        </p>
      </header>

      <EnginePlayer displayFamily={display.style.fontFamily} monoFamily={mono.style.fontFamily} />

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="text-2xl font-semibold">What the tour is walking</h2>
          <p className="mt-3 leading-7 text-[#C5D0DE]">
            In full-flow staged combustion, both propellants pass through preburners before the main chamber. The oxidizer-rich preburner drives the oxidizer turbopump. The fuel-rich preburner drives the fuel turbopump. Turbine exhaust is still propellant, and it is what the main injector receives. In this model the fuel also cools the chamber wall and the upper bell before it reaches the fuel-rich preburner. That jacket order is a labeled series schematic, not a measured manifold map.
          </p>
        </div>
        <aside className="rounded-xl border border-[#344257] bg-[#141b27] p-4">
          <h2 className="text-sm font-semibold tracking-wide text-[#FFD166] uppercase">
            Left off the drawing
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-[#C5D0DE]">
            <li>Pressures, temperatures as numbers, thrust, and specific impulse.</li>
            <li>Pump speed, mixture ratio, expansion ratio, and gimbal angle.</li>
            <li>A coaxial turbopump, a specific injector pattern, and a startup sequence.</li>
            <li>Detonation, shock diamonds, and decorative particles.</li>
          </ul>
        </aside>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Five shots, one causal chain</h2>
        <p className="mt-3 max-w-3xl leading-7 text-[#C5D0DE]">
          Each shot keeps the previous stage in frame at the cut, and the minimap keeps the whole machine visible during the close-ups. The hardware is one sectioned engine. Parts are not pulled apart.
        </p>
        <ol className="mt-6 flex flex-col gap-4">
          {shots.map((shot) => (
            <li key={shot.frames} className="rounded-xl border border-[#344257] bg-[#121826] p-4">
              <p className="font-mono text-xs text-[#00E5FF]">
                {shot.clock} · frames {shot.frames}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{shot.title}</h3>
              <p className="mt-2 leading-7 text-[#C5D0DE]">{shot.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <figure className="overflow-hidden rounded-xl border border-[#344257]">
        <Image
          src="/hero-Cursor.jpg"
          alt="Illustration of a sectioned methalox engine with two vertical shafts, preburners, a cooled chamber, and a bell nozzle. Cyan, gold, and violet marks are explanatory overlays."
          width={1280}
          height={720}
          className="h-auto w-full"
        />
        <figcaption className="bg-[#141b27] px-4 py-3 text-sm leading-6 text-[#9AA8BA]">
          Cover illustration for the article. Where the cover disagrees with the player, the player is the model. The cover is not a measured plumbing diagram and it carries no performance numbers.
        </figcaption>
      </figure>

      <section>
        <h2 className="text-2xl font-semibold">How to use this</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Item term="What it is" detail="A frame-accurate anatomy of a full-flow methalox engine in steady operation, built so the path, the power loop, and the heat path can be read without a fake spec sheet." />
          <Item term="Who it is for" detail="Propulsion students, technical writers, and program managers who need the cycle to be traceable. It assumes comfort with a cutaway and does not assume a design code." />
          <Item term="Why the limits are the product" detail="The useful claim is the topology: two biased preburners, two shafts, turbine gas into the chamber, fuel taking wall heat before the fuel-rich preburner. Numbers without a cited source would make that claim worse." />
          <Item term="How it is structured" detail="Five camera moves, a minimap, a breadcrumb, and a two-second hold on the complete section. Scale changes and time changes are labeled in the shot where they happen." />
          <Item term="How people find it" detail="This page, the GitHub repository, and the Medium article aimed at the query for how full-flow staged combustion works." />
          <Item term="How people use it" detail="Play the 34 seconds, scrub to a cut, and read the transcript beside that cut. The keyboard steps one frame when the film has focus." />
          <Item term="What completion looks like" detail="A viewer can say where each propellant goes, which turbine drives which pump, and why the chamber burn is not a detonation. There is no form and no mailing list." />
          <Item term="What it is worth" detail="A public technical asset for Kinetic Gain. Nothing is sold from this page. The reusable part is the frame contract: segment, camera, scale label, time label, hold." />
          <Item term="How it ships" detail="Static export on GitHub Pages. No account, no tracker, no stored viewer data." />
          <Item term="What would improve it" detail="A cited geometry or a published operating point can be added later, with the source on the label. A start sequence would be a separate schematic, not a silent edit to this tour." />
        </dl>
      </section>

      <section className="rounded-xl border border-[#344257] p-5">
        <h2 className="text-2xl font-semibold">Review status</h2>
        <p className="mt-3 leading-7 text-[#C5D0DE]">
          Consolidated working brief, not a certified engineering reference. Verify subject-specific details before publication or design use. The de Laval area relation and the definition of full-flow staged combustion are standard. The pipe routes, the bell contour, the channel count, and the cover illustration are teaching drawings. SpaceX Raptor is the public inspiration for a methane-oxygen full-flow engine. This model is not a Raptor drawing and it is not a SpaceX document.
        </p>
        <p className="mt-4 text-sm text-[#9AA8BA]">
          <a className="text-[#00E5FF] underline-offset-4 hover:underline" href={REPO_URL}>
            Source repository
          </a>
          <span> · </span>
          <a className="text-[#00E5FF] underline-offset-4 hover:underline" href={`${SITE_URL}/`}>
            {SITE_URL}/
          </a>
        </p>
      </section>
    </main>
  );
}

function Item({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="rounded-xl border border-[#344257] bg-[#121826] p-4">
      <dt className="font-semibold text-[#E7EEF6]">{term}</dt>
      <dd className="mt-2 text-sm leading-6 text-[#C5D0DE]">{detail}</dd>
    </div>
  );
}
