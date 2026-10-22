import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";
import { siteUrl, withBase } from "@/lib/site";

const title = "Full-flow staged combustion, explained as a machine";
const description =
  "How a methalox full-flow engine moves both propellants through preburners and turbines, cools the chamber with the fuel, and expands in a nozzle. Raptor-inspired, with the spec sheet left off the drawing.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/article/" },
  openGraph: {
    title,
    description,
    type: "article",
    publishedTime: "2026-10-22",
    authors: ["Mirza Causevic"],
    images: [{ url: "/hero-Cursor.jpg", alt: "Editorial cutaway of a full-flow rocket engine" }],
  },
};

export default function ArticlePage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "content/full-flow-staged-combustion-explainer-Cursor.md"),
    "utf8",
  );
  const html = renderMarkdown(raw);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Full-Flow Staged Combustion, Explained as a Machine",
    description,
    datePublished: "2026-10-22",
    dateModified: "2026-10-22",
    author: {
      "@type": "Person",
      name: "Mirza Causevic",
      url: "https://www.linkedin.com/in/mirzacausevic/",
    },
    image: `${siteUrl}/hero-Cursor.jpg`,
    mainEntityOfPage: `${siteUrl}/article/`,
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="font-mono text-[10px] tracking-[0.18em] text-[#93A0B5]">ESSAY · 22 OCTOBER 2026</p>
      <p className="mt-3 text-sm">
        <Link href="/" className="text-[#00E5FF]">
          Back to the 34-second section
        </Link>
      </p>
      <figure className="mt-6">
        <Image
          src={withBase("/hero-Cursor.jpg")}
          alt="Editorial illustration of a full-flow rocket engine cutaway on a dark field. Colored lines in this still are not the film legend."
          width={1200}
          height={675}
          unoptimized
          priority
          className="h-auto w-full rounded-lg border border-white/10"
        />
        <figcaption className="mt-2 text-xs leading-relaxed text-[#93A0B5]">
          Editorial still for the header. The colored strokes in this image are not the player&apos;s legend. The
          frame-locked section is the schematic, and its cyan, gold, and violet overlays are labeled there.
        </figcaption>
      </figure>
      <article className="essay mt-8" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
