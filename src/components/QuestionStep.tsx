import type { FormEvent } from "react";
import { Button } from "./Button.tsx";
import { ShortcutHint } from "./IdeaStep.tsx";

const fieldClass =
  "min-h-36 w-full resize-y rounded-[14px] border border-line bg-card px-4 py-3 text-base leading-relaxed text-ink shadow-[0_16px_40px_-32px_rgba(23,22,20,0.7)] placeholder:text-[#8d877c] focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

type QuestionStepProps = {
  index: 0 | 1 | 2;
  title: string;
  hint: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onContinue: () => void;
};

export function QuestionStep({
  index,
  title,
  hint,
  placeholder,
  value,
  onChange,
  onBack,
  onSkip,
  onContinue,
}: QuestionStepProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onContinue();
  }

  return (
    <form onSubmit={submit}>
      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((bar) => (
          <span
            key={bar}
            className={`h-1 flex-1 rounded-full transition-colors ${bar <= index ? "bg-accent" : "bg-line"}`}
          />
        ))}
      </div>
      <p className="mt-6 text-xs font-medium tracking-[0.16em] text-accent uppercase">{index + 1} of 3</p>
      <h1 id="question-title" className="mt-3 text-[2rem] leading-[1.15] font-semibold tracking-tight text-balance text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-soft">{hint}</p>
      <label htmlFor="answer" className="sr-only">
        {title}
      </label>
      <textarea
        id="answer"
        data-autofocus
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck
        autoComplete="off"
        aria-labelledby="question-title"
        className={`${fieldClass} mt-6`}
      />
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" className="w-full sm:w-auto" onClick={onBack}>
          Back
        </Button>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button variant="ghost" className="w-full sm:w-auto" onClick={onSkip}>
            Skip for now
          </Button>
          <Button type="submit" className="w-full sm:w-auto sm:min-w-36">
            {index === 2 ? "See the cut" : "Continue"}
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <ShortcutHint />
      </div>
      <p className="sr-only" aria-live="polite">
        Question {index + 1} of 3. {title}
      </p>
    </form>
  );
}
