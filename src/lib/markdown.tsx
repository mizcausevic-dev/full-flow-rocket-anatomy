import Image from "next/image";
import type { ReactNode } from "react";
import { asset } from "./site";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i}`;
    i += 1;
    if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      const link = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (link) {
        const href = link[2];
        const safe = href.startsWith("https://") || href.startsWith("http://") || href.startsWith("/");
        nodes.push(
          safe ? (
            <a key={key} href={href.startsWith("/") ? asset(href) : href} rel="noopener noreferrer">
              {link[1]}
            </a>
          ) : (
            <span key={key}>{link[1]}</span>
          ),
        );
      }
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function isTable(block: string): boolean {
  const lines = block.split("\n");
  return lines.length >= 2 && lines[0].trim().startsWith("|") && /^\|?\s*-+/.test(lines[1].trim().replace(/\|/g, "|"));
}

function tableRows(block: string): string[][] {
  return block
    .split("\n")
    .filter((line) => !/^\s*\|?\s*:?-{3,}/.test(line.trim()))
    .map((line) =>
      line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim()),
    )
    .filter((row) => row.some((cell) => cell && !/^:?-{3,}:?$/.test(cell)));
}

export function Markdown({ source }: { source: string }) {
  const body = source.replace(/^# .+\n+/, "");
  const blocks = body.split(/\n{2,}/);
  return (
    <div className="essay-body">
      {blocks.map((block, index) => {
        const key = `b-${index}`;
        const trimmed = block.trim();
        if (!trimmed || trimmed === "---") return null;
        if (trimmed.startsWith("### ")) {
          return <h3 key={key}>{inline(trimmed.slice(4), key)}</h3>;
        }
        if (trimmed.startsWith("## ")) {
          return <h2 key={key}>{inline(trimmed.slice(3), key)}</h2>;
        }
        if (trimmed.startsWith("> ")) {
          return <blockquote key={key}>{inline(trimmed.replace(/^> /gm, ""), key)}</blockquote>;
        }
        if (trimmed.startsWith("![")) {
          const img = /!\[([^\]]*)\]\(([^)]+)\)/.exec(trimmed);
          if (!img) return null;
          const caption = trimmed.split("\n").slice(1).join(" ").trim();
          const src = img[2].startsWith("http") ? img[2] : `/${img[2].replace(/^\//, "")}`;
          return (
            <figure key={key} className="hero-figure">
              <Image src={src} alt={img[1]} width={1280} height={720} />
              {caption ? <figcaption>{caption}</figcaption> : null}
            </figure>
          );
        }
        if (isTable(trimmed) || trimmed.startsWith("|")) {
          const rows = tableRows(trimmed);
          if (rows.length === 0) return null;
          const [head, ...rest] = rows;
          return (
            <div key={key} className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {head.map((cell) => (
                      <th key={cell}>{inline(cell, `${key}-${cell}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rest.map((row) => (
                    <tr key={row.join("|")}>
                      {row.map((cell) => (
                        <td key={cell}>{inline(cell, `${key}-${cell}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (trimmed.split("\n").every((line) => line.trim().startsWith("- "))) {
          return (
            <ul key={key}>
              {trimmed.split("\n").map((line) => (
                <li key={line}>{inline(line.trim().slice(2), `${key}-${line}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={key}>{inline(trimmed.replace(/\n/g, " "), key)}</p>;
      })}
    </div>
  );
}
