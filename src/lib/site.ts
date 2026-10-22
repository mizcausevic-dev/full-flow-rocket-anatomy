export const REPO = "https://github.com/mizcausevic-dev/full-flow-rocket-engine-explainer";
export const SITE = "https://mizcausevic-dev.github.io/full-flow-rocket-engine-explainer";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}

export const HERO_ALT =
  "Editorial rendering of a methalox-style rocket engine on a dark stand: two pump housings above one chamber and one bell nozzle. Not a photograph of a flight engine and not a measured cross-section.";
