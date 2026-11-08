import { Fragment, type ReactNode } from "react";
import { Link } from "wouter";

// Tiny renderer for the guide markdown subset: ## h2, - lists, > tip, paragraphs,
// **bold** and [text](href). Content is our own, so no HTML is ever injected.
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index} className="font-semibold text-ink">{m[1]}</strong>);
    else if (m[3].startsWith("/")) out.push(<Link key={m.index} href={m[3]} className="font-semibold text-ink underline decoration-flame decoration-2 underline-offset-4 hover:decoration-ink">{m[2]}</Link>);
    else out.push(<a key={m.index} href={m[3]} target="_blank" rel="noopener noreferrer" className="underline">{m[2]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines[0].startsWith("## ")) {
          const text = lines[0].slice(3);
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return (
            <Fragment key={i}>
              <h2 id={id} className="mt-12 scroll-mt-24 text-2xl font-black md:text-3xl">{text}</h2>
              {lines.length > 1 && <Markdown source={lines.slice(1).join("\n")} />}
            </Fragment>
          );
        }
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="mt-5 space-y-2.5">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3 leading-relaxed text-ink-soft">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                  <span>{inline(l.slice(2))}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (lines[0].startsWith("> ")) {
          return <p key={i} className="mt-6 rounded-2xl bg-kraft/40 px-5 py-4 text-sm font-medium">{inline(lines.map((l) => l.replace(/^> /, "")).join(" "))}</p>;
        }
        return <p key={i} className="mt-5 text-lg leading-relaxed text-ink-soft">{inline(lines.join(" "))}</p>;
      })}
    </>
  );
}
