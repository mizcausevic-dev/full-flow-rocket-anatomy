import type { Metadata } from "next";
import { display, mono } from "@/lib/fonts";
import { DESCRIPTION, SITE_URL, TITLE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/hero-Cursor.jpg`,
        width: 1280,
        height: 720,
        alt: "Cutaway illustration of a full-flow staged combustion engine with cyan pathway lines, gold shafts, and violet state markers on a dark technical stage.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/hero-Cursor.jpg`],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE_URL}/`,
  learningResourceType: "interactive animation",
  educationalUse: "explanation",
  timeRequired: "PT34S",
  isAccessibleForFree: true,
  datePublished: "2026-10-22",
  image: `${SITE_URL}/hero-Cursor.jpg`,
  author: {
    "@type": "Person",
    name: "Mirza Causevic",
    url: "https://github.com/mizcausevic-dev",
    sameAs: ["https://www.linkedin.com/in/mirzacausevic/"],
  },
  publisher: {
    "@type": "Organization",
    name: "Kinetic Gain LLC",
    url: "https://kineticgain.com",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} dark h-full antialiased`}
    >
      <body
        className="min-h-full bg-[#0B1019] text-[#E7EEF6]"
        style={{ fontFamily: display.style.fontFamily }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
