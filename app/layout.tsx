import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const description =
  "A 34-second aligned section of a methalox full-flow staged combustion engine: two preburners, two turbines, regenerative cooling, and nozzle expansion. Raptor-inspired, with pressures and speeds left off the drawing.";

export const metadata: Metadata = {
  metadataBase: new URL("https://mizcausevic-dev.github.io/full-flow-anatomy"),
  title: {
    default: "Full-flow anatomy: a 34-second sectional engine",
    template: "%s · Full-flow anatomy",
  },
  description,
  keywords: [
    "full-flow staged combustion",
    "rocket engine",
    "preburner",
    "turbopump",
    "regenerative cooling",
    "methalox",
    "Raptor engine",
    "nozzle throat",
  ],
  authors: [{ name: "Mirza Causevic", url: "https://www.linkedin.com/in/mirzacausevic/" }],
  openGraph: {
    title: "Full-flow anatomy: a 34-second sectional engine",
    description,
    type: "article",
    images: [{ url: "/hero-Cursor.jpg", width: 1200, height: 675, alt: "Editorial cutaway of a full-flow rocket engine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full-flow anatomy: a 34-second sectional engine",
    description,
    images: ["/hero-Cursor.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0B1019] text-[#E8EEF6]">{children}</body>
    </html>
  );
}
