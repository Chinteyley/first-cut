---
doc: scope
status: approved
---

# First Cut

A one-screen web page that turns a fuzzy side-project idea into tonight’s cut: kernel, who it’s for, core loop, and a Now / Later / Cut list.

## The Unique Kernel
The output is an explicit Cut list with a reason on each line, not another feature wish-list. The reason is the guilt-trip against scope creep: if you are tempted to add it tonight, the card says why it waits. Delete the reasons and this is just a form that sorts notes.

## Who It's For
Indie hackers and students like Chintey, about to start a two-to-four hour build tonight. Today they paste a fuzzy idea into a coding agent and it builds too much. First Cut is the page they open before that.

## The Core Loop
Open the page, paste the messy idea, answer three short questions, and look at one card. They come back the next time an idea shows up and an agent is ready to run — the card is what they screenshot or paste into a README before any code.

## Inspiration & Identity
Calm, high-contrast, student-indie. Not a generic purple AI gradient. Inter (with the system font behind it), off-white paper, near-black text, one accent. He allowed teal or amber; the build uses teal so there is only one. Generous space, a card that can be screenshotted, and a short motion when the step changes. The feeling to avoid is “the agent already started coding.”

## Why This Matters to the Learner
He wants the habit of a written cut before code, and he wants to walk the Devpost Learn skills from start through ship on a project small enough to finish. The app is that habit, turned into something he can demo.

## What "Working" Looks Like
Someone opens the app, pastes an idea, answers who it’s for, what “working tonight” looks like, and what they’re tempted to add. One card appears: a suggested name they can edit, the kernel, who, a one-or-two sentence core loop, and Now / Later / Cut. Copy as Markdown puts usable markdown on the clipboard (or a selected box, if the clipboard is blocked). Start over clears it. The whole path happens without a refresh. The “oh” is the Cut column: their own temptations, each with a reason.

## The POC Boundary
One screen. Idea, three freeform questions, one card, copy, start over. The card is assembled with fixed rules from their words. No account, no server, no model call. A draft may sit in the browser so a refresh doesn’t wipe the form.

## Later
An AI rewrite of the card. Accounts. A mobile app. A templates library. Worth wanting after tonight’s cut is real.

## Explicitly Cut
- **Auth** — accounts don’t prove the card is worth screenshotting.
- **A backend** — the cut has to work with the laptop closed to the network.
- **An LLM in v1** — a model call would hide whether the rules are honest, and it would need a key. The UI says when a line is a fixed transform.
- **Collaboration** — one person can finish the loop.
- **History of past cuts** — a fresh card is enough to demo. A local draft is only so this sitting survives a refresh, not a log of old projects.
