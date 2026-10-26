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

- [ ] Early usable behavior explored — the card after three answers, in the same browser session as the final pass (fast mode)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: not recorded yet
Route and stops: not recorded yet
Edit outcome: not recorded yet
Reflection: not recorded yet
Activity mode: not recorded yet

## Revisions

- Card, copy, and draft shipped together — they are one screen; a card without Copy and Start over would not match `prd.md > The card`.
