import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ExplainBar } from "@/components/explain-bar";
import { Player } from "@/components/player";
import { ESSAY, FAQ } from "@/content/meta";
import { Markdown } from "@/lib/markdown";
import { REPO, SITE } from "@/lib/site";

const essay = readFileSync(join(process.cwd(), "medium-article-Cursor.md"), "utf8");

const pageUrl = `${SITE}/`;
const prompt = encodeURIComponent(`Please explain and summarize the key takeaways of this page: ${pageUrl}`);
const sendTo = [
  ["ChatGPT", `https://chatgpt.com/?q=${prompt}`],
  ["Claude", `https://claude.ai/new?q=${prompt}`],
  ["Perplexity", `https://www.perplexity.ai/search?q=${prompt}`],
  ["Gemini", `https://gemini.google.com/app?q=${prompt}`],
  ["Grok", `https://grok.com/?q=${prompt}`],
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      headline: ESSAY.title,
      description: ESSAY.description,
      datePublished: ESSAY.datePublished,
      dateModified: ESSAY.dateModified,
      image: `${SITE}/hero-editorial.jpg`,
      mainEntityOfPage: pageUrl,
      author: {
        "@type": "Person",
        name: "Mirza Causevic",
        url: "https://www.linkedin.com/in/mirzacausevic/",
        affiliation: {
          "@type": "Organization",
          name: "Kinetic Gain",
          url: "https://www.linkedin.com/company/kinetic-gain/",
        },
      },
      publisher: {
        "@type": "Organization",
        name: "Kinetic Gain",
        url: "https://www.linkedin.com/company/kinetic-gain/",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="top">
        <p className="kicker">Aerospace engineering · frame-locked section · 1,020 frames · 30 fps</p>
        <h1>{ESSAY.title}</h1>
        <p className="dek">
          A Raptor-inspired sectional model of the closed cycle: two turbopumps, two preburners, one cooled chamber, one
          nozzle. Explanatory colors, not emissions. No invented pressure, speed, or mixture ratio.
        </p>
      </header>
      <Player />
      <div className="tools">
        <ExplainBar />
        <div className="send-row">
          <span className="share-label">Send to</span>
          {sendTo.map(([label, href]) => (
            <a key={label} className="send-btn" href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          ))}
        </div>
      </div>
      <article className="essay">
        <Markdown source={essay} />
      </article>
      <footer>
        <p>
          Static page. No account, no form, no analytics, and no third-party runtime script. The sectional model is a
          working brief, not a certified engineering reference.{" "}
          <a href={REPO}>Repository</a>.
        </p>
        <nav aria-label="Kinetic Gain and Mirza Causevic">
          <a href="https://www.linkedin.com/company/kinetic-gain/" target="_blank" rel="noopener noreferrer">
            Kinetic Gain
          </a>
          <a href="https://github.com/mizcausevic-dev" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/mirzacausevic/" target="_blank" rel="noopener noreferrer">
            Mirza Causevic
          </a>
        </nav>
      </footer>
    </>
  );
}
