---
doc: spec
status: approved
---

# First Cut — Technical Spec

## How This Works, In Plain Language
The app is one page in the browser. You type an idea, answer three questions, and the page fills a card. Nothing is uploaded. No model is called.

A function, `buildCut`, reads the four bits of text and applies written rules: a name, one sentence as the kernel, your who-line or a blank, a fixed sentence for the loop, Now from the finish line, Later from deferring sentences, and Cut from the temptations with a reason from a short list. The card is that result. Copy asks the browser clipboard; if that isn’t allowed, the same markdown sits in a box you can select. The browser may keep a draft in `localStorage` for this site only. Start over deletes it.

This shape is enough because the kernel is the card, not a service. A server or a model would add a key and a failure before the cut exists.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. You open the page. Vite serves `index.html`, which loads `src/main.tsx`. React renders `App` on the idea step. Nothing is fetched.
2. You type the idea. `App` holds it in memory and, once it isn’t blank, writes a draft through `saveDraft`.
3. Continue moves `step` to the first question, then the second, then the third. Back moves `step` the other way. The text stays in memory.
4. “See the cut” sets `step` to the card. `App` calls `buildCut` with the idea and the three answers. `CutCard` draws the result.
5. Copy calls `copyText`. On success the button says Copied. On failure `CutCard` shows the string from `toMarkdown` and selects it.
6. Start over clears memory and calls `clearDraft`. The idea step is empty again.
7. A later visit calls `loadDraft` once. If a draft exists, `App` fills the fields and shows “Draft restored”.

```
idea text ──► App (memory) ──► buildCut ──► CutCard
                 │                  │
                 ▼                  ▼
            localStorage        toMarkdown ──► clipboard or fallback box
```

## Stack
Installed and locked in `package-lock.json` (checked with `npm ls` while building):

| Piece | Version | Why |
| --- | --- | --- |
| [Vite](https://vite.dev/) | 8.3.5 | Dev server and static build. His web default. |
| [React](https://react.dev/) | 19.3.1 | UI. Familiar. |
| [TypeScript](https://www.typescriptlang.org/) | 6.0.3 | The rules in `buildCut` stay typed. |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | 6.1.2 | JSX in Vite. |
| [Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite) | 4.3.3 | Styling, via the Vite plugin `@tailwindcss/vite` 4.3.3. No purple theme. |
| [@fontsource/inter](https://fontsource.org/fonts/inter) | 5.3.0 | Inter ships with the app, so the demo doesn’t depend on a font CDN. |

Tradeoff he accepted: client-only rules instead of a model. The card is dumber than a rewrite and honest about it. No API key.

Node 22 is what this repo was built with (`engines` asks for 22+). `npm run check` runs the rule script with Node’s type stripping.

## Where It Runs and How Someone Tries It
Browser, local. No API key.

```
npm install
npm run dev
```

Open http://localhost:5173 . Record that tab. The hackathon still wants a 1–3 minute screen recording and a public GitHub repo; a live URL does not replace the video. See `DEMO.md` for the shot list.

```
npm run build
npm run preview
```

`dist/` is the static site. Deployment to Vercel is optional and not required for the demo. There is no `.env`.

`npm run check` asserts the demo idea becomes the expected name, kernel, columns, reasons, markdown, draft parser, and clipboard decision. `npm run lint` runs oxlint.

## Look and Feel
Source: `prd.md > Look and Feel`, `scope.md > Inspiration & Identity`.

Tailwind v4 theme tokens in `src/index.css`: paper `#f3f0e8`, card `#fffcf7`, ink `#171614`, soft ink `#5c564c`, line `#e2dacd`, accent `#115e59`. Inter through the `--font-sans` token. A 3px accent rule on the top edge of the page. One faint teal wash at the top of the paper, not a gradient hero. Buttons are 44px tall, 10px radius. The card is the only big surface: 22px radius, warm border, soft shadow. Step changes use a 240ms rise; `prefers-reduced-motion` turns it off. The form column is `max-w-xl`. The card column is `max-w-5xl`, stacking to one column under the `md` breakpoint.

## Components

### Idea step
`src/components/IdeaStep.tsx`. The idea box, the empty hint, Continue.
PRD ref: `prd.md > The idea`.

### Question step
`src/components/QuestionStep.tsx`. Progress, one question, Back, Skip, Continue / See the cut.
PRD ref: `prd.md > The three questions`.

### Cut card
`src/components/CutCard.tsx`. Name field, kernel, who, loop, three columns, honesty line, copy, start over, clipboard fallback, rules disclosure.
PRD ref: `prd.md > The card`.

### buildCut
`src/lib/buildCut.ts`. Pure function `buildCut`, plus `reasonFor`, `sentences`, and `splitList`. No React, no network.
PRD ref: `prd.md > The card`.

### Draft storage
`src/lib/storage.ts`. `saveDraft`, `loadDraft`, `clearDraft`, `parseDraft`. Key `first-cut-draft-v1`. Bad JSON or an empty idea returns null.
PRD ref: `prd.md > Draft on this browser`.

### Clipboard copy
`src/lib/clipboard.ts`. `shouldUseClipboardApi` is false when the page isn’t a secure context or `writeText` is missing. `copyText` catches a rejected write and returns `"fallback"`.
PRD ref: `prd.md > The card` (Copy as Markdown).

`src/App.tsx` owns the step and the text, calls `buildCut`, and persists the draft. `src/lib/markdown.ts` (`toMarkdown`) is the string Copy uses. `src/lib/steps.ts` is the step order.

## Data Model
One draft object, version 1:

- `idea`, `who`, `tonight`, `tempted` — strings from the form
- `step` — `idea`, `who`, `tonight`, `tempted`, or `card`
- `name`, `nameTouched` — the edited title, or the suggestion when they haven’t edited it

It lives in React memory first. After a non-blank edit, `saveDraft` writes it to `localStorage`. On load, `loadDraft` restores it. Start over removes the key. Leaving the site does not create an account or a file on a server. If storage throws, the in-memory card still works.

`buildCut` does not store anything. Its output is derived. The name shown on the card is the typed name once `nameTouched` is set; otherwise it is `buildCut(...).name`.

## File Structure

```
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── README.md
├── DEMO.md
├── scripts/check-build-cut.ts   # locks the card rules
├── public/favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx                  # step, draft, journey
│   ├── index.css                # paper, ink, teal
│   ├── content.ts               # microcopy and empty lines
│   ├── types.ts                 # Draft and Step
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Mark.tsx
│   │   ├── IdeaStep.tsx
│   │   ├── QuestionStep.tsx
│   │   └── CutCard.tsx
│   └── lib/
│       ├── buildCut.ts
│       ├── markdown.ts
│       ├── clipboard.ts
│       ├── storage.ts
│       └── steps.ts
├── devpost/                     # scope, prd, spec, checklist, app map
├── .agents/skills/              # Learn skill pack (canonical)
└── skills-lock.json
```

The installer also linked `.claude/skills` and copied `agent/skills`. Planning docs stay in `devpost/`. `devpost/learner-profile.md` is gitignored.

## External Services and Dependencies
None for the product. No API calls, no database, no hosting requirement, no key.

Fonts are files from `@fontsource/inter`, bundled by Vite, not a runtime request to Google Fonts. Clipboard and `localStorage` are browser APIs:

- [Clipboard.writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) — secure context, can throw
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) — same-origin, can throw in private mode

Tailwind is build-time only ([Vite install guide](https://tailwindcss.com/docs/installation/using-vite)).

## Important Failure Modes

- **Empty idea, Continue** → the button doesn’t advance; the hint is an alert; the box is focused. PRD ref: `prd.md > States and Boundaries`.
- **Clipboard missing, denied, or still pending after about a second** → “Copy it from here” and a selected textarea. `shouldUseClipboardApi(false, …)` is the insecure-origin case. A hung `writeText` must not leave the button spinning with no result.
- **localStorage throws** → “Couldn’t save a draft in this browser. You can still finish the cut.”
- **Garbage in the draft key** → `parseDraft` returns null and the page starts empty.

## What Was Simplified and Why

- **Fixed rules in `buildCut`** instead of an LLM rewrite — the kernel of the product is a cut you can explain. A model would need a key, a network, and a fake “thinking” state. The fuller version is the deferred rewrite.
- **`localStorage` draft** instead of accounts and history — recovery for this sitting only. Accounts are cut in scope.
- **No router** — one screen, one `step` value. Routes would imply a product with pages.
- **Keyword reasons** instead of a written critique per idea — the reason is honest about being a rule. The disclosure lists the rules.

## Decisions and Open Issues
- **Stack** — his web default, recorded above. Tradeoff: no one-click native app. Accepted in his spec answers.
- **No model** — his cut. Tradeoff: the loop sentence is a template. The card says so.
- **Teal** — chosen inside “teal or amber” so the CSS has one accent. Not a new product decision.
- **Clipboard uncertainty** — he asked to clarify insecure origins during the build. Clarified in code: `shouldUseClipboardApi` requires a secure context and `writeText`. Otherwise, and if `writeText` throws, the UI selects the markdown. `npm run check` locks the boolean. A browser pass should deny the clipboard once and show the box. Localhost itself is a secure context, so the happy path can still copy.
- **Draft vs history** — a draft is not the history feature scope cut. It only restores the open sitting.
- From `prd.md > Open Questions`: deployment stays optional. No product question left that blocks the build.
