import assert from "node:assert/strict";
import { buildCut } from "../src/lib/buildCut.ts";
import { shouldUseClipboardApi } from "../src/lib/clipboard.ts";
import { toMarkdown } from "../src/lib/markdown.ts";
import { parseDraft, serializeDraft } from "../src/lib/storage.ts";
import type { Draft } from "../src/types.ts";

const idea = [
  "First Cut — a tiny web page for indie hackers and students about to start a two-hour build.",
  "",
  "You paste a fuzzy idea and answer three short questions. You get one card: the kernel, who it is for, the core loop, and a Now / Later / Cut list. The cut list has reasons, so you feel the cost of scope creep before any code.",
  "",
  "Eventually, a template library. Not tonight.",
].join("\n");

const card = buildCut({
  idea,
  who: "Indie hackers and students starting a two-hour build tonight",
  tonight: "I can paste an idea, answer three questions, and copy a markdown card",
  tempted: "Accounts and auth\nAn LLM rewrite\nA mobile app\nCollaboration",
});

assert.equal(card.name, "First Cut");
assert.equal(
  card.kernel,
  "The cut list has reasons, so you feel the cost of scope creep before any code.",
);
assert.equal(card.who, "Indie hackers and students starting a two-hour build tonight");
assert.equal(
  card.loop,
  "For Indie hackers and students starting a two-hour build tonight, the loop is one sitting: start from the idea, do only what Now lists, and stop.",
);
assert.deepEqual(card.now, [
  "I can paste an idea",
  "Answer three questions",
  "Copy a markdown card",
]);
assert.equal(card.later.length, 1);
assert.match(card.later[0] ?? "", /template library/);
assert.deepEqual(
  card.cut.map((item) => item.text),
  ["Accounts and auth", "LLM rewrite", "Mobile app", "Collaboration"],
);
assert.match(card.cut[0]?.reason ?? "", /second product/);
assert.match(card.cut[1]?.reason ?? "", /model call/);
assert.match(card.cut[2]?.reason ?? "", /Another client/);
assert.match(card.cut[3]?.reason ?? "", /prove this alone/);

const blank = buildCut({
  idea: "I want a plant watering reminder for my desk pothos",
  who: "",
  tonight: "",
  tempted: "",
});
assert.equal(blank.name, "Plant Watering Reminder");
assert.equal(blank.who, null);
assert.deepEqual(blank.now, []);
assert.deepEqual(blank.later, []);
assert.deepEqual(blank.cut, []);
assert.match(blank.loop, /no finish line/i);

const titled = buildCut({
  idea: "Plant water log",
  who: "Me",
  tonight: "One plant, one reminder",
  tempted: "A weird extra I have no category for",
});
assert.equal(titled.name, "Plant Water Log");
assert.equal(titled.cut.length, 1);
assert.match(titled.cut[0]?.reason ?? "", /Tonight is done without it/);

const markdown = toMarkdown(card, "Renamed");
assert.match(markdown, /^# Renamed/);
assert.match(markdown, /## Cut/);
assert.match(markdown, /second product/);
assert.match(markdown, /No model|Rules, not a model/);

const emptyCut = toMarkdown(blank, blank.name);
assert.match(emptyCut, /Name a temptation/);

const draft: Draft = {
  v: 1,
  idea: "A cut",
  who: "",
  tonight: "",
  tempted: "",
  step: "who",
  name: "A cut",
  nameTouched: false,
};
assert.deepEqual(parseDraft(serializeDraft(draft)), draft);
assert.equal(parseDraft("{"), null);
assert.equal(parseDraft(JSON.stringify({ ...draft, step: "nope" })), null);
assert.equal(parseDraft(JSON.stringify({ ...draft, idea: "   " })), null);

assert.equal(shouldUseClipboardApi(false, true), false);
assert.equal(shouldUseClipboardApi(true, false), false);
assert.equal(shouldUseClipboardApi(true, true), true);

console.log("check-build-cut: ok");
