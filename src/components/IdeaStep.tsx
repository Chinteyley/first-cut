import type { FormEvent } from "react";
import { Button } from "./Button.tsx";

const fieldClass =
  "min-h-52 w-full resize-y rounded-[14px] border bg-card px-4 py-3 text-base leading-relaxed text-ink shadow-[0_16px_40px_-32px_rgba(23,22,20,0.7)] placeholder:text-[#8d877c] focus:outline-none focus:ring-4 focus:ring-accent/15";

type IdeaStepProps = {
  idea: string;
  showError: boolean;
  onIdea: (value: string) => void;
  onContinue: () => void;
};

export function IdeaStep({ idea, showError, onIdea, onContinue }: IdeaStepProps) {
  const empty = idea.trim().length === 0;
  const long = idea.trim().length > 5000;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onContinue();
  }

  return (
    <form onSubmit={submit} className="mt-8">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="idea" className="text-sm font-medium text-ink">
          The idea
        </label>
        {idea.trim().length > 0 ? (
          <span className="text-xs tabular-nums text-ink-soft">{idea.trim().length}</span>
        ) : null}
      </div>
      <textarea
        id="idea"
        data-autofocus
        value={idea}
        onChange={(event) => onIdea(event.target.value)}
        placeholder="A two-hour dinner decider for whatever is in the fridge. Eventually, a social feed. I keep wanting accounts."
        spellCheck
        autoComplete="off"
        aria-invalid={showError && empty}
        aria-describedby="idea-hint"
        className={`${fieldClass} mt-2 ${showError && empty ? "border-accent" : "border-line"}`}
      />
      <p id="idea-hint" role={showError && empty ? "alert" : undefined} className="mt-3 text-sm leading-relaxed text-ink-soft">
        {empty
          ? "Write the idea first. An empty box has nothing to cut."
          : long
            ? "Shorter ideas cut cleaner. You can still continue."
            : "Stays in this browser. No account, no model, no API key."}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          aria-disabled={empty}
          className="w-full sm:w-auto sm:min-w-36"
        >
          Continue
        </Button>
        <ShortcutHint />
      </div>
    </form>
  );
}

export function ShortcutHint() {
  return (
    <p className="text-xs text-ink-soft">
      <kbd className="rounded border border-line bg-card px-1.5 py-0.5 font-sans text-[11px]">Ctrl</kbd>
      {" + "}
      <kbd className="rounded border border-line bg-card px-1.5 py-0.5 font-sans text-[11px]">Enter</kbd>
      <span className="sr-only"> or command enter</span>
    </p>
  );
}
