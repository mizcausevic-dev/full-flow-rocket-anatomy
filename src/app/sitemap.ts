import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, lastModified: "2026-10-22", changeFrequency: "yearly", priority: 1 },
    { url: `${SITE}/poster/`, lastModified: "2026-10-22", changeFrequency: "yearly", priority: 0.3 },
  ];
}
