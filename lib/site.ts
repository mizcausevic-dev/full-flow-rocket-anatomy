export const repoName = "full-flow-anatomy";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const siteUrl = `https://mizcausevic-dev.github.io/${repoName}`;

export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
