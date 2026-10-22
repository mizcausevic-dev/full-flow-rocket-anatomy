import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ESSAY } from "@/content/meta";
import { HERO_ALT, SITE } from "@/lib/site";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE}/`),
  title: {
    default: "How Full-Flow Staged Combustion Works",
    template: "%s · Full-flow staged combustion",
  },
  description: ESSAY.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "article",
    url: "/",
    title: "How full-flow staged combustion works",
    description: ESSAY.description,
    images: [{ url: "/hero-editorial.jpg", width: 1280, height: 720, alt: HERO_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How full-flow staged combustion works",
    description: ESSAY.description,
    images: ["/hero-editorial.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#stage-title">
          Skip to the stage explanation
        </a>
        {children}
      </body>
    </html>
  );
}
