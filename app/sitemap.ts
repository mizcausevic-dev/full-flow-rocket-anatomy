import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, lastModified: "2026-10-22", changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/article/`, lastModified: "2026-10-22", changeFrequency: "monthly", priority: 0.8 },
  ];
}
