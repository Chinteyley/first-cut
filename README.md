# First Cut

A one-screen page that turns a fuzzy side-project idea into tonight’s cut: a kernel, who it’s for, the core loop, and a Now / Later / Cut list. The Cut lines have reasons.

The card is a fixed transform of what you type. No account, no API key, no model call. The page says so.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173 .

```bash
npm run check
npm run build
npm run preview
```

`npm run check` locks the card rules. `npm run build` writes a static site to `dist/`.

## Demo

The hackathon wants a 1–3 minute screen recording of this flow. The shot list is in [DEMO.md](DEMO.md). A deployed URL is optional and does not replace the video. Stills from a local pass are in `docs/screenshots/`.

## Planning

The Devpost Learn notes are in `devpost/`:

- `scope.md`
- `prd.md`
- `spec.md`
- `checklist.md`
- `app-map.html`

The skill pack used to write them is in `.agents/skills/`, pinned by `skills-lock.json`.
