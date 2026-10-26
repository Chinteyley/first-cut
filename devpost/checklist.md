---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast — chosen in the run brief under the deadline. Less narration between slices; the card is still reviewed in the browser before ship notes.

## Slices

- [x] **1. Paste an idea, answer three questions, and see the cut card**
  Becomes usable: A running page where an idea and three answers become one card: name, kernel, who, loop, and Now / Later / Cut with reasons.
  Why now: The Cut column is the kernel. Scaffolding is inside this slice so the first thing that runs is the card, not a shell.
  PRD ref: `prd.md > The Core Journey`, `prd.md > The card`
  Spec ref: `spec.md > buildCut`, `spec.md > Idea step`, `spec.md > Question step`, `spec.md > Cut card`, `spec.md > Look and Feel`
  Build: Vite + React + TypeScript + Tailwind. Idea step, question step, and the card. `buildCut` suggests the name, lifts the kernel, and fills the columns. Empty answers stay empty. Motion, focus, and the teal paper UI are part of this slice.
  Verify (mechanical): `npm run check` (demo idea → name First Cut, kernel sentence about reasons, four cut reasons) and `npm run build`.
  Learner check: Open the app, paste an idea, answer the three questions, and say whether the card looks like the one you’d screenshot.
  Commit: `Build the First Cut page with a ruled card and markdown copy`

- [x] **2. Copy the markdown, start over, and keep a draft**
  Becomes usable: Copy as Markdown, a selected fallback when the clipboard is blocked, Start over, and a draft that comes back in this browser.
  Why now: The card is already the proof. These are the actions the demo has to show after the reveal, and the clipboard question from the spec gets checked here.
  PRD ref: `prd.md > The card`, `prd.md > Draft on this browser`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Clipboard copy`, `spec.md > Draft storage`, `spec.md > Important Failure Modes`
  Build: `toMarkdown`, `copyText` / `shouldUseClipboardApi`, fallback textarea, `saveDraft` / `loadDraft` / `clearDraft`, restored-draft note, Start fresh.
  Verify (mechanical): `npm run check` covers markdown headings, empty Cut copy, draft parse failures, and `shouldUseClipboardApi(false, true) === false`. `npm run build`.
  Learner check: Copy and paste the markdown somewhere visible. Start over and confirm the idea box is empty. Reload mid-answer and confirm the draft note.
  Commit: `Build the First Cut page with a ruled card and markdown copy`

## Hands-on Checkpoints

- [x] Early usable behavior explored — browser walk of idea → three questions → card, same session as the final pass (fast mode, delegated run)
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Final review complete — browser pass matched the acceptance criteria. The only follow-up was the clipboard hang timeout, which keeps the fallback `prd.md > The card` already required. Chintey still records the demo video; that is ship work, not an open product change.

## Code Tour and App Map

- [x] Learning activity complete — focused alternative for a plan-first run: the no-model cut, and the clipboard uncertainty
- [x] Optional edit and transfer reflection addressed — not applicable in this delegated run; no live edit, reflection not answered in session
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: `npm run check` locks the kernel sentence in `scripts/check-build-cut.ts` against `buildCut`. A headless Chrome walk then denied `clipboard.writeText` (`NotAllowedError` on a secure localhost). `copyText` in `src/lib/clipboard.ts` fell back within the 1.2s timeout, and the selected box contained `# First Cut` and the Cut reasons. Empty Continue, Back, Start over, draft restore, and a 390px skipped-temptation card were exercised in the same walk.
Route and stops: reference route in `devpost/app-map.html` — `continueFrom` in `src/App.tsx`, `buildCut` / `reasonFor` in `src/lib/buildCut.ts`, `CutCard` in `src/components/CutCard.tsx`. Not clicked through in an editor during this run.
Edit outcome: not applicable
Reflection: not answered in session — personal note stays out of this file
Activity mode: focused alternative, with the app exercised in a browser and the map as a reference route

## Revisions

- Card, copy, and draft shipped together — they are one screen; a card without Copy and Start over would not match `prd.md > The card`.
- Headless Chrome rejects `clipboard.writeText` even on localhost. `copyText` now gives up after about a second so a hung permission check still opens the selected markdown box.
