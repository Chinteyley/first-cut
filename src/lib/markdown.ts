import { emptyCopy, HONESTY } from "../content.ts";
import type { FirstCut } from "./buildCut.ts";

export function toMarkdown(card: FirstCut, name: string): string {
  const title = name.trim() || card.name;
  return [
    `# ${title}`,
    "",
    `> ${HONESTY}`,
    "",
    "## Kernel",
    "",
    card.kernel,
    "",
    "## Who",
    "",
    card.who ?? emptyCopy.who,
    "",
    "## Core loop",
    "",
    card.loop,
    "",
    "## Now",
    "",
    bulletList(card.now, emptyCopy.now),
    "",
    "## Later",
    "",
    bulletList(card.later, emptyCopy.later),
    "",
    "## Cut",
    "",
    card.cut.length > 0
      ? card.cut.map((item) => `- **${item.text}** — ${item.reason}`).join("\n")
      : `_${emptyCopy.cut}_`,
    "",
  ].join("\n");
}

function bulletList(items: readonly string[], empty: string): string {
  if (items.length === 0) return `_${empty}_`;
  return items.map((item) => `- ${item}`).join("\n");
}
