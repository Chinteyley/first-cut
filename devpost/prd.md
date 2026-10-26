---
doc: prd
status: approved
---

# First Cut — Product Requirements

A one-screen page for indie hackers and students who are about to overbuild a side project tonight.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. They open First Cut. They see the name, a short line about leaving with a version they can finish tonight, a large box for the messy idea, and Continue.
2. Continue does nothing useful until the idea has words. The page says so.
3. They answer three questions, one at a time: who this is for; what working tonight looks like; what they’re tempted to add that they shouldn’t. Each can be skipped.
4. They can step back and change an answer without refreshing or losing the idea.
5. The card appears: an editable project name, the kernel, who, the core loop, and Now / Later / Cut. Cut lines have reasons.
6. Copy as Markdown puts that card on the clipboard, or shows the markdown selected if the clipboard won’t work. Start over clears the sitting, including a saved draft.

Success is that card, readable in a screenshot, and the markdown a README could hold.

## Screens and Layout
One screen. The step changes in place. There is no second page.

- **Idea.** Left-aligned column. Mark, eyebrow, title “First Cut”, tagline, labeled idea box, Continue. A compact way back to the name sits on later steps so the question or the card can be the heading.
- **Questions.** A three-part progress mark, “1 of 3” (then 2, then 3), the question as the heading, one line of hint, a text box, Back, Skip for now, and Continue. The last primary button reads “See the cut”.
- **Card.** Wider than the form so Now, Later, and Cut can sit in a row on a laptop and stack on a phone. Copy as Markdown and Start over sit under the columns.

Mobile is a single column. The questions and the card stay inside the same page.

## Look and Feel
Source: `scope.md > Inspiration & Identity`.

Off-white paper, near-black type, one accent: teal. Inter, then the system sans. High contrast, calm, no purple gradient, no second accent. Space is generous. The result is a card with a short teal rule, a large editable name, the kernel set off like a quote, and three columns that read at a glance. Cut is the column that should photograph well: the temptation, then “Why”, then the reason. Step changes fade and rise slightly. If the person has asked the OS to reduce motion, the step just appears. Focus rings are visible. Buttons are tall enough to hit with a thumb.

## Features and Behavior

### The idea
They type or paste anything. The box is empty at the start, with a placeholder that shows the kind of mess that’s welcome. Continue stays quiet until there is non-empty text; activating it anyway focuses the box and says to write the idea first. Ctrl+Enter or ⌘+Enter continues from the idea and from each question.

### The three questions
Shown one at a time, in this order:

1. Who is this for?
2. What does working tonight look like?
3. What are you tempted to add that you shouldn’t?

Skip for now clears that answer and moves on. Continue keeps whatever they typed, including an empty answer, and moves on. Back returns to the previous step with the text still there. Empty answers are allowed. The card must not invent a person, a finish line, or a temptation to fill the hole.

### The card
- **Project name.** Suggested from their words. They can edit it. The suggestion updates if they change the idea before they edit the name.
- **Kernel.** One sentence taken from the idea, preferring a sentence that draws a boundary. A line that only defers work (“eventually…”) is not the kernel.
- **Who.** Their answer, or a plain blank if they skipped.
- **Core loop.** One or two sentences in a fixed pattern that points at the Now column. It is not a paraphrase from a model.
- **Now.** The “working tonight” answer, split on new lines or commas. Blank if they skipped.
- **Later.** Sentences in the idea that defer work (eventually, someday, later, v2, and the same kind of phrase). Mentioning the words “Now / Later / Cut” as the shape of the card does not count as deferring. Blank if none.
- **Cut.** Each temptation, with a reason. Reasons come from a short fixed list (accounts, a model, another client, a server, other people, history, payment, notifications, a catalog) or from a default that points at their finish line. Blank if they named nothing.
- A visible line states that the card is rules, not a model, and that a blank stays blank. “How this card was made” can be opened for the actual rules.
- **Copy as Markdown** produces a heading, kernel, who, core loop, and the three lists. On success the button reads Copied. If the clipboard API is missing or rejects the write, the same markdown is shown in a box, already selected, with instructions to press Ctrl+C or ⌘C.
- **Start over** returns to the empty idea and drops the saved draft.

### Draft on this browser
If they leave and come back in the same browser, the sitting is restored and a note says so, with Keep it and Start fresh. Start fresh is the same clear as Start over. Nothing is sent to a server.

## States and Boundaries

- **First visit** — empty idea, Continue not willing to proceed, hint telling them to write something.
- **Normal** — idea, any mix of answers, then the card.
- **Skipped question** — that part of the card uses the soft empty line, not a guessed user or feature.
- **Clipboard blocked** — selected markdown box, card otherwise unchanged.
- **Draft storage blocked** — the card still works; a short line says the draft couldn’t be saved.
- **Very long idea** — they can continue; a quiet note says shorter ideas cut cleaner.
- **Start over / Start fresh** — idea, answers, name edits, and the saved draft are gone.
- **What persists** — the current sitting in this browser only, until Start over or Start fresh. No account, no shared history.

## Product Decisions

- One screen, not a wizard with routes — the demo is one sitting. Source: his PRD answers.
- Three freeform questions, skippable — he asked for soft empty states, not required fields beyond the idea.
- Back, so a wrong answer doesn’t force Start over or a refresh — from “complete the journey without a refresh.”
- Last question’s button says “See the cut” so the card feels like the point.
- Teal, not amber — he allowed either; one accent means picking one. Amber is unused.
- No model, and the card says so — from the spec answers and the kernel. Blanks stay blank rather than reading like a generated persona.
- Copy and Start over are the only actions on the card — from his acceptance notes.
- A local draft is optional recovery, not a history feature — from the spec answers. Explicitly cut in scope: a log of past projects.

## What We're Building
The journey above, on a phone-width column and on a laptop, with the card looking finished enough to record. Copy works or degrades visibly. Start over clears. `npm run build` produces a static site. No key, no account.

## Deferred From the POC
Source: `scope.md > Later`.

- AI rewrite of the wording — it would replace the honest rules and need a key.
- Accounts — there is no “my cuts” yet.
- Mobile app — this is the one screen.
- Templates library — one card is the proof, not a catalog.

## Possible Later Enhancements
A rewrite pass once the rules feel too stiff. A signed-in list of old cuts. An Expo client of the same card. A handful of example ideas someone can start from. None of these are in the demo.

## Non-Goals
- Auth, backend, collaboration, and a history of past projects — `scope.md > Explicitly Cut`.
- Pretending a network call is “thinking.”
- A second accent, a purple gradient, or a dashboard of metrics.
- Teaching a framework inside the product UI.

## Open Questions
- Clipboard on insecure origins — decided in the product: try the API, and if it isn’t there or it throws, show the selected box. Confirm during the build on a page where the API fails. Does not block the card.
- Whether he records on localhost or a deployed URL — deployment is optional. The video can be local. Left for ship.
