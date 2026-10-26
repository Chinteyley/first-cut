import type { Draft, Step } from "../types.ts";

const KEY = "first-cut-draft-v1";

export function serializeDraft(draft: Draft): string {
  return JSON.stringify(draft);
}

export function parseDraft(raw: string): Draft | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!isDraft(value)) return null;
    if (!value.idea.trim()) return null;
    return value;
  } catch {
    return null;
  }
}

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return parseDraft(raw);
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft): boolean {
  try {
    localStorage.setItem(KEY, serializeDraft(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // The cut still works when storage is blocked.
  }
}

function isDraft(value: unknown): value is Draft {
  if (typeof value !== "object" || value === null) return false;
  const draft = value as Record<string, unknown>;
  return (
    draft.v === 1 &&
    typeof draft.idea === "string" &&
    typeof draft.who === "string" &&
    typeof draft.tonight === "string" &&
    typeof draft.tempted === "string" &&
    isStep(draft.step) &&
    typeof draft.name === "string" &&
    typeof draft.nameTouched === "boolean"
  );
}

function isStep(value: unknown): value is Step {
  return (
    value === "idea" ||
    value === "who" ||
    value === "tonight" ||
    value === "tempted" ||
    value === "card"
  );
}
