export type CutEntry = {
  text: string;
  reason: string;
};

export type FirstCut = {
  name: string;
  kernel: string;
  who: string | null;
  loop: string;
  now: string[];
  later: string[];
  cut: CutEntry[];
};

export type CutInput = {
  idea: string;
  who: string;
  tonight: string;
  tempted: string;
};

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "to",
  "for",
  "of",
  "in",
  "on",
  "with",
  "my",
  "i",
  "we",
  "it",
  "is",
  "that",
  "this",
  "just",
  "want",
  "wanna",
  "build",
  "make",
  "something",
  "like",
  "really",
  "very",
  "into",
  "from",
  "your",
  "you",
  "so",
  "if",
  "at",
  "by",
  "be",
  "can",
  "will",
  "would",
  "should",
  "have",
  "has",
  "do",
  "does",
  "not",
  "no",
  "tonight",
  "idea",
]);

const LATER_WORD =
  /\b(eventually|someday|some day|v2|phase 2|next time|nice to have|for later|later on)\b/i;

const CONTRAST =
  /\b(instead|without|only|not just|unlike|rather than|the point|so that|before)\b/i;

const REASONS: readonly { pattern: RegExp; reason: string }[] = [
  {
    pattern: /\b(auth|login|sign[- ]?up|accounts?|passwords?|oauth)\b/i,
    reason: "Accounts are a second product. Tonight only has to be readable.",
  },
  {
    pattern: /\b(llm|gpt|openai|claude|ai|models?)\b/i,
    reason: "A model call does not prove the loop. Keep this version local.",
  },
  {
    pattern: /\b(mobile|ios|android|react native|expo)\b/i,
    reason: "Another client waits until this screen is real.",
  },
  {
    pattern: /\b(backend|database|server|api|postgres|supabase)\b/i,
    reason: "A server does not make the loop clearer.",
  },
  {
    pattern: /\b(collab\w*|share|multiplayer|realtime|real-time|comments?)\b/i,
    reason: "You can prove this alone. Other people can wait.",
  },
  {
    pattern: /\b(history|sync|cloud)\b/i,
    reason: "A fresh cut is enough to demo. History can wait.",
  },
  {
    pattern: /\b(payment|stripe|subscription|checkout)\b/i,
    reason: "Taking payment does not prove the idea works.",
  },
  {
    pattern: /\b(notif\w*|email|push|analytics)\b/i,
    reason: "A notification does not prove the loop works.",
  },
  {
    pattern: /\b(templates?|librar(?:y|ies)|gallery)\b/i,
    reason: "A catalog can wait. One cut is the proof.",
  },
];

export function buildCut(input: CutInput): FirstCut {
  const idea = input.idea.trim();
  const who = input.who.trim();
  const tonight = input.tonight.trim();
  const tempted = input.tempted.trim();
  const lines = sentences(idea);
  const now = splitList(tonight).slice(0, 6);

  return {
    name: suggestName(idea, lines),
    kernel: pickKernel(lines, idea),
    who: who.length > 0 ? who : null,
    loop: buildLoop(who, now.length > 0),
    now,
    later: lines.filter((line) => isLater(line)).slice(0, 4),
    cut: splitList(tempted)
      .slice(0, 6)
      .map((text) => ({ text, reason: reasonFor(text, tonight) })),
  };
}

export function reasonFor(item: string, tonight: string): string {
  for (const entry of REASONS) {
    if (entry.pattern.test(item)) return entry.reason;
  }
  const finish = tonight.trim();
  if (!finish) {
    return "You named it, so it waits. It is not required to prove the idea tonight.";
  }
  const short = finish.length > 90 ? `${finish.slice(0, 87).trimEnd()}…` : finish;
  return `You named it, so it waits. Tonight is done without it: “${short}”.`;
}

function buildLoop(who: string, hasNow: boolean): string {
  const sitting = hasNow
    ? "The loop is one sitting: start from the idea, do only what Now lists, and stop."
    : "The loop is one sitting with the idea. There is no finish line yet, because “working tonight” was skipped.";
  if (!who) return sitting;
  const rest = sitting.charAt(0).toLowerCase() + sitting.slice(1);
  if (who.length > 180) return `For the person you named, ${rest}`;
  return `For ${who}, ${rest}`;
}

function suggestName(idea: string, lines: string[]): string {
  const quoted = idea.match(/\b(?:called|named)\s+["“]([^"”\n]{2,48})["”]/i);
  if (quoted?.[1]) return quoted[1].trim();

  const called = idea.match(
    /\b(?:called|named)\s+([A-Z][\p{L}\p{N}'’+-]*(?:\s+[A-Z0-9][\p{L}\p{N}'’+-]*){0,4})/u,
  );
  if (called?.[1]) return called[1].trim();

  const firstLine = (idea.split(/\n+/)[0] ?? "").trim();
  const titled = firstLine.match(
    /^([A-Z][\p{L}\p{N}'’+-]*(?:\s+[A-Z0-9][\p{L}\p{N}'’+-]*){0,4})\s+(?:—|–|-|:)\s+\S/u,
  );
  if (titled?.[1] && titled[1].length <= 48) return titled[1].trim();

  const words = firstLine.split(/\s+/).filter(Boolean);
  const firstWord = words[0]?.toLowerCase() ?? "";
  if (
    firstLine.length > 0 &&
    firstLine.length <= 42 &&
    words.length <= 5 &&
    !/[.!?]$/.test(firstLine) &&
    !STOP.has(firstWord)
  ) {
    return words.map(titleWord).join(" ");
  }

  const concrete = contentWords(lines[0] ?? idea).slice(0, 3).map(titleWord);
  if (concrete.length > 0) return concrete.join(" ");
  return "Untitled cut";
}

function pickKernel(lines: string[], idea: string): string {
  if (lines.length === 0) {
    return idea.length > 0
      ? clamp(idea, 280)
      : "The idea is still fuzzy. The columns use only what you typed.";
  }
  let best = lines[0] ?? idea;
  let bestScore = Number.NEGATIVE_INFINITY;
  lines.forEach((line, index) => {
    const score = scoreLine(line, index);
    if (score > bestScore) {
      best = line;
      bestScore = score;
    }
  });
  return clamp(best, 280);
}

function isLater(sentence: string): boolean {
  if (LATER_WORD.test(sentence)) return true;
  return /\blater\b/i.test(sentence) && !/now\s*[/|]\s*later/i.test(sentence);
}

function scoreLine(sentence: string, index: number): number {
  let score = 0;
  if (CONTRAST.test(sentence)) score += 3;
  if (/\breasons?\b/i.test(sentence)) score += 2;
  if (isLater(sentence)) score -= 3;
  if (sentence.length >= 40 && sentence.length <= 240) score += 2;
  if (sentence.length < 28) score -= 2;
  if (index === 0) score += 1;
  return score;
}

export function sentences(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n+|(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && /[\p{L}\p{N}]/u.test(part));
}

export function splitList(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const parts = /\n|•|;/.test(trimmed)
    ? trimmed.split(/\n+|;\s*|•\s*/)
    : trimmed.includes(",")
      ? trimmed.split(/,\s*/)
      : [trimmed];
  const cleaned = parts.map(cleanListItem).filter((part) => part.length > 0);
  if (cleaned.length <= 6) return cleaned;
  return [...cleaned.slice(0, 5), cleaned.slice(5).join(", ")];
}

function cleanListItem(raw: string): string {
  let text = raw.replace(/\s+/g, " ").trim();
  text = text.replace(/^[-*•]+(?:\s+)?/, "");
  text = text.replace(/^\d+[.)]\s+/, "");
  text = text.replace(/^(?:and|or)\s+/i, "");
  text = text.replace(/^(?:an|a|the)\s+/i, "");
  text = text.replace(/[.,;:]+$/, "").trim();
  if (!text) return "";
  return leadIn(text);
}

function leadIn(text: string): string {
  if (/[A-Z]/.test(text.charAt(1))) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function contentWords(text: string): string[] {
  return text
    .split(/[^\p{L}\p{N}'’+-]+/u)
    .filter((word) => word.length > 1 && !STOP.has(word.toLowerCase()));
}

function titleWord(word: string): string {
  if (/[a-z]/.test(word) && /[A-Z]/.test(word)) return word;
  if (word.length <= 4 && word === word.toUpperCase() && /[A-Z]/.test(word)) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, max - 1);
  const space = sliced.lastIndexOf(" ");
  const base = space > max * 0.6 ? sliced.slice(0, space) : sliced;
  return `${base.replace(/[.,;:\s]+$/, "")}…`;
}
