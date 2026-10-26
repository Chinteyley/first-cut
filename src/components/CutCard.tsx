import { useEffect, useRef, useState, type ReactNode } from "react";
import { emptyCopy, HONESTY } from "../content.ts";
import type { FirstCut } from "../lib/buildCut.ts";
import { copyText } from "../lib/clipboard.ts";
import { toMarkdown } from "../lib/markdown.ts";
import { Button } from "./Button.tsx";

type CutCardProps = {
  card: FirstCut;
  name: string;
  onNameChange: (value: string) => void;
  onStartOver: () => void;
};

export function CutCard({ card, name, onNameChange, onStartOver }: CutCardProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">("idle");
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const displayName = name.trim() || card.name;
  const markdown = toMarkdown(card, displayName);

  useEffect(() => {
    if (copyState !== "copied") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  useEffect(() => {
    if (copyState !== "fallback") return;
    const node = fallbackRef.current;
    if (!node) return;
    node.focus();
    node.select();
  }, [copyState, markdown]);

  async function onCopy() {
    const result = await copyText(markdown);
    setCopyState(result === "copied" ? "copied" : "fallback");
  }

  return (
    <article className="rounded-[22px] border border-line bg-card px-5 py-6 shadow-[0_28px_70px_-36px_rgba(23,22,20,0.55)] sm:px-8 sm:py-8">
      <h1 tabIndex={-1} data-autofocus className="sr-only">
        Tonight’s cut, {displayName}
      </h1>
      <div className="h-1 w-14 rounded-full bg-accent" />
      <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-accent uppercase">Tonight’s cut</p>
      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="project-name" className="text-xs font-medium tracking-[0.16em] text-ink-soft uppercase">
            Project name
          </label>
          <span className="text-xs text-ink-soft">Editable</span>
        </div>
        <input
          id="project-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          maxLength={80}
          autoComplete="off"
          spellCheck
          placeholder={card.name}
          className="mt-1 w-full border-b border-transparent bg-transparent pb-1 text-4xl font-semibold tracking-tight text-ink outline-none placeholder:text-ink-soft/50 focus:border-accent sm:text-5xl"
        />
      </div>

      <section className="mt-8 max-w-2xl">
        <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">Kernel</h2>
        <blockquote className="mt-3 border-l-2 border-accent pl-4 text-xl leading-snug font-medium text-pretty text-ink sm:text-2xl">
          {card.kernel}
        </blockquote>
      </section>

      <div className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
        <section>
          <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">Who it’s for</h2>
          <p className={`mt-2 text-base leading-relaxed ${card.who ? "text-ink" : "text-ink-soft"}`}>
            {card.who ?? emptyCopy.who}
          </p>
        </section>
        <section>
          <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">Core loop</h2>
          <p className="mt-2 text-base leading-relaxed text-ink">{card.loop}</p>
        </section>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <Column label="Now" count={card.now.length} tone="now">
          {card.now.length === 0 ? (
            <Empty>{emptyCopy.now}</Empty>
          ) : (
            <ol className="space-y-3">
              {card.now.map((item, index) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink">
                  <span className="mt-0.5 w-5 shrink-0 text-xs font-semibold tabular-nums text-accent">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          )}
        </Column>
        <Column label="Later" count={card.later.length} tone="later">
          {card.later.length === 0 ? (
            <Empty>{emptyCopy.later}</Empty>
          ) : (
            <ul className="space-y-3">
              {card.later.map((item) => (
                <li key={item} className="text-[15px] leading-relaxed text-ink">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </Column>
        <Column label="Cut" count={card.cut.length} tone="cut">
          {card.cut.length === 0 ? (
            <Empty>{emptyCopy.cut}</Empty>
          ) : (
            <ul className="space-y-4">
              {card.cut.map((item) => (
                <li key={item.text}>
                  <p className="text-[15px] leading-snug font-medium text-ink">{item.text}</p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-soft">
                    <span className="mr-1.5 font-semibold tracking-[0.14em] text-accent uppercase">Why</span>
                    {item.reason}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Column>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ink-soft">{HONESTY}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button className="w-full sm:w-auto sm:min-w-48" onClick={() => void onCopy()}>
          {copyState === "copied" ? <CheckIcon /> : <CopyIcon />}
          {copyState === "copied" ? "Copied" : "Copy as Markdown"}
        </Button>
        <Button variant="quiet" className="w-full sm:w-auto" onClick={onStartOver}>
          Start over
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copyState === "copied"
          ? "Markdown copied to the clipboard."
          : copyState === "fallback"
            ? "Clipboard blocked. Markdown is selected below."
            : ""}
      </p>

      {copyState === "fallback" ? (
        <div className="mt-4 rounded-2xl border border-line bg-paper p-4">
          <p className="text-sm font-medium text-ink">Copy it from here</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            This page can’t use the clipboard. The markdown is selected — press Ctrl+C or ⌘C.
          </p>
          <textarea
            ref={fallbackRef}
            readOnly
            value={markdown}
            aria-label="Markdown for your cut"
            className="mt-3 h-48 w-full resize-y rounded-xl border border-line bg-card p-3 font-mono text-sm leading-relaxed text-ink focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
          />
        </div>
      ) : null}

      <details className="mt-8 border-t border-line pt-4">
        <summary className="cursor-pointer text-sm font-medium text-ink-soft marker:text-ink-soft hover:text-ink">
          How this card was made
        </summary>
        <ul className="mt-3 max-w-2xl space-y-2 text-sm leading-relaxed text-ink-soft">
          <li>
            <span className="font-medium text-ink">Name.</span> A “called” or “named” phrase, a short title before a dash, or the first concrete words.
          </li>
          <li>
            <span className="font-medium text-ink">Kernel.</span> One sentence from the idea. A line that draws a boundary wins. “Eventually” lines are skipped.
          </li>
          <li>
            <span className="font-medium text-ink">Core loop.</span> A fixed sentence that points at Now. It is not a rewrite.
          </li>
          <li>
            <span className="font-medium text-ink">Now.</span> Your finish line, split on new lines or commas.
          </li>
          <li>
            <span className="font-medium text-ink">Later.</span> Sentences that say later, eventually, someday, v2, phase 2, or next time.
          </li>
          <li>
            <span className="font-medium text-ink">Cut.</span> What you are tempted to add. The reason comes from a short fixed list, or it points at your finish line.
          </li>
        </ul>
      </details>
    </article>
  );
}

function Column({
  label,
  count,
  tone,
  children,
}: {
  label: string;
  count: number;
  tone: "now" | "later" | "cut";
  children: ReactNode;
}) {
  const toneClass =
    tone === "cut"
      ? "border-accent/40 bg-accent-soft"
      : tone === "now"
        ? "border-line bg-white"
        : "border-line bg-paper";
  return (
    <section className={`flex min-h-48 flex-col rounded-2xl border p-4 ${toneClass}`}>
      <header className="flex items-center justify-between gap-3">
        <h3 className={`text-xs font-semibold tracking-[0.16em] uppercase ${tone === "cut" ? "text-accent" : "text-ink"}`}>
          {label}
        </h3>
        <span className="text-xs tabular-nums text-ink-soft">{count}</span>
      </header>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: string }) {
  return <p className="text-sm leading-relaxed text-ink-soft">{children}</p>;
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5.2" y="5.2" width="8" height="8" rx="1.4" />
      <path d="M10.5 5.1V3.6A1.1 1.1 0 0 0 9.4 2.5H3.6A1.1 1.1 0 0 0 2.5 3.6v5.8A1.1 1.1 0 0 0 3.6 10.5H5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3.5 8.2 6.4 11l6.1-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
