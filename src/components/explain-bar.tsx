"use client";

import { useState } from "react";

const LEVELS = {
  tech: "Full-flow staged combustion, shown as a still machine with a moving explanation. Methane and oxygen each have a turbopump and a preburner. Fuel-rich gas drives the fuel shaft. Oxidizer-rich gas drives the oxygen shaft. Both streams inject into one chamber, burn in deflagration, and leave through a de Laval bell. Methane cools the wall on the way to its preburner. Cyan is the path, gold is shaft work or heat, violet is state. No pressure, speed, gimbal angle, or mixture ratio is asserted.",
  nontech:
    "The film follows propellant through a closed rocket engine. Two pumps feed two small burners. Those burners spin the pumps, and the gas they leave behind is burned again in the main chamber instead of being thrown away. Fuel also runs through the wall so the metal survives. The last shot is the nozzle, then the whole engine held still.",
  layman:
    "A rocket has to carry both its fuel and its oxygen. This diagram shows how those two liquids get pumped, partly burned to spin the pumps, then fully burned and pushed out the nozzle. It is a learning drawing. It is not a manual and it does not show secret engine numbers.",
} as const;

export function ExplainBar() {
  const [level, setLevel] = useState<keyof typeof LEVELS>("tech");
  return (
    <div className="explain-row">
      <span className="share-label">Explain this page</span>
      {(Object.keys(LEVELS) as Array<keyof typeof LEVELS>).map((key) => (
        <button
          key={key}
          type="button"
          className="level-btn"
          aria-pressed={level === key}
          onClick={() => setLevel(key)}
        >
          {key === "tech" ? "Tech" : key === "nontech" ? "Non-tech" : "Layman"}
        </button>
      ))}
      <p id="explain-text">{LEVELS[level]}</p>
    </div>
  );
}
