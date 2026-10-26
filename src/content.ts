export const HONESTY =
  "Rules, not a model. Your words, sorted. A blank stays blank.";

export const emptyCopy = {
  who: "Skipped. Left blank on purpose.",
  now: "Skipped. Now stays empty until you describe a finish line.",
  later:
    "Nothing was deferred. Words like “eventually”, “someday”, or “v2” land here.",
  cut: "Name a temptation. This column is the point.",
} as const;

export const questions = [
  {
    id: "who",
    title: "Who is this for?",
    hint: "A person you could text. “Users” is too vague to cut against.",
    placeholder: "Students starting a two-hour build tonight",
  },
  {
    id: "tonight",
    title: "What does working tonight look like?",
    hint: "If you can point at it on a screen, you can stop.",
    placeholder: "I can paste an idea and copy a markdown card",
  },
  {
    id: "tempted",
    title: "What are you tempted to add that you shouldn’t?",
    hint: "List them. They become the Cut column, each with a reason.",
    placeholder: "Accounts\nA model rewrite\nA mobile app",
  },
] as const;

export type QuestionId = (typeof questions)[number]["id"];
