export const ESSAY = {
  title: "How full-flow staged combustion works",
  description:
    "How full-flow staged combustion routes methane and oxygen through two preburners, two turbines, a cooled chamber, and a nozzle. A sectional model with no invented pressures.",
  datePublished: "2026-10-22",
  dateModified: "2026-10-22",
};

export const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What is full-flow staged combustion?",
    a: "It is a closed rocket cycle with two preburners. One runs fuel-rich and drives the fuel turbopump. One runs oxidizer-rich and drives the oxidizer turbopump. Both turbine streams then enter the main chamber and finish burning. Full-flow means both propellants take a turbine path, rather than only one of them.",
  },
  {
    q: "How is it different from a gas-generator cycle?",
    a: "A gas-generator cycle burns a little propellant to spin the turbines and dumps that gas overboard. Staged combustion ducts the turbine exhaust into the main chamber and burns it there. Full-flow staged combustion does that with two preburners, one for each propellant.",
  },
  {
    q: "Why are there two preburners?",
    a: "So each turbopump can be driven by gas that is already rich in its own propellant. The fuel turbine sees fuel-rich gas. The oxidizer turbine sees oxidizer-rich gas. The plate shows two shafts for that reason. It does not show a coaxial dual-pump rotor.",
  },
  {
    q: "Where does regenerative cooling sit in the path?",
    a: "In the teaching route drawn here, pumped liquid methane flows through channels in the chamber and nozzle wall before it reaches the fuel-rich preburner. The methane picks up wall heat. The oxidizer goes from its pump to the oxidizer-rich preburner. Flight plumbing differs by engine version, so the drawing is labeled as a route, not as a tube map of one serial number.",
  },
  {
    q: "Is the chamber combustion a detonation?",
    a: "No. The chamber in this cycle is a continuous burner. The reaction is deflagration. Detonation is a supersonic, shock-coupled reaction, and nothing on this plate is drawn that way.",
  },
  {
    q: "Why are there no pressures, speeds, or mixture ratios?",
    a: "The source brief forbids invented pressures, rotational speeds, gimbal angles, and a coaxial pump arrangement. Public explainers sometimes print those figures. This project did not measure them, so the plate and this article do not adopt them. Bar widths mean most or a little.",
  },
  {
    q: "Is this a drawing of a flight Raptor?",
    a: "It is a Raptor-inspired conceptual model of the full-flow methalox cycle. It is not a dimensioned cross-section of Raptor 1, 2, or 3. SpaceX has not published the drawing this plate would have to match. The editorial photograph is a rendering of an engine on a stand, not flight hardware.",
  },
];
