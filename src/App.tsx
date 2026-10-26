import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { CutCard } from "./components/CutCard.tsx";
import { IdeaStep } from "./components/IdeaStep.tsx";
import { Mark } from "./components/Mark.tsx";
import { Button } from "./components/Button.tsx";
import { QuestionStep } from "./components/QuestionStep.tsx";
import { questions } from "./content.ts";
import { buildCut } from "./lib/buildCut.ts";
import { nextStep, previousStep } from "./lib/steps.ts";
import { clearDraft, loadDraft, saveDraft } from "./lib/storage.ts";
import type { Step } from "./types.ts";

export default function App() {
  const [savedDraft] = useState(loadDraft);
  const [idea, setIdea] = useState(savedDraft?.idea ?? "");
  const [who, setWho] = useState(savedDraft?.who ?? "");
  const [tonight, setTonight] = useState(savedDraft?.tonight ?? "");
  const [tempted, setTempted] = useState(savedDraft?.tempted ?? "");
  const [step, setStep] = useState<Step>(savedDraft?.step ?? "idea");
  const [name, setName] = useState(savedDraft?.name ?? "");
  const [nameTouched, setNameTouched] = useState(savedDraft?.nameTouched ?? false);
  const [showRestored, setShowRestored] = useState(savedDraft !== null);
  const [showError, setShowError] = useState(false);
  const [draftError, setDraftError] = useState(false);

  const card = useMemo(
    () => buildCut({ idea, who, tonight, tempted }),
    [idea, who, tonight, tempted],
  );
  const shownName = nameTouched ? name : card.name;

  useEffect(() => {
    const blank =
      step === "idea" &&
      !idea.trim() &&
      !who.trim() &&
      !tonight.trim() &&
      !tempted.trim() &&
      !nameTouched;
    if (blank) {
      clearDraft();
      return;
    }
    const saved = saveDraft({
      v: 1,
      idea,
      who,
      tonight,
      tempted,
      step,
      name: shownName,
      nameTouched,
    });
    if (!saved) {
      const markUnsaved = window.setTimeout(() => setDraftError(true), 0);
      return () => window.clearTimeout(markUnsaved);
    }
    return undefined;
  }, [idea, who, tonight, tempted, step, nameTouched, shownName]);

  const continueFrom = useCallback(() => {
    if (step === "idea" && !idea.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setStep(nextStep(step));
  }, [idea, step]);

  useEffect(() => {
    if (step === "card") return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        continueFrom();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [continueFrom, step]);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, [step]);

  function startOver() {
    setIdea("");
    setWho("");
    setTonight("");
    setTempted("");
    setStep("idea");
    setName("");
    setNameTouched(false);
    setShowError(false);
    setShowRestored(false);
    setDraftError(false);
    clearDraft();
  }

  function skipQuestion() {
    switch (step) {
      case "who":
        setWho("");
        break;
      case "tonight":
        setTonight("");
        break;
      case "tempted":
        setTempted("");
        break;
      case "idea":
      case "card":
        break;
      default: {
        const exhaustive: never = step;
        return exhaustive;
      }
    }
    setStep(nextStep(step));
  }

  function changeAnswer(value: string) {
    switch (step) {
      case "who":
        setWho(value);
        return;
      case "tonight":
        setTonight(value);
        return;
      case "tempted":
        setTempted(value);
        return;
      case "idea":
      case "card":
        return;
      default: {
        const exhaustive: never = step;
        return exhaustive;
      }
    }
  }

  const answer = step === "who" ? who : step === "tonight" ? tonight : tempted;
  const question = questions[step === "tonight" ? 1 : step === "tempted" ? 2 : 0];
  const questionIndex = step === "tonight" ? 1 : step === "tempted" ? 2 : 0;

  return (
    <div className="min-h-svh px-5 py-12 sm:px-8 sm:py-16">
      <div className={step === "card" ? "mx-auto w-full max-w-5xl" : "mx-auto w-full max-w-xl"}>
        <Brand hero={step === "idea"} />
        {showRestored ? (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-ink">Draft restored from this browser.</p>
            <div className="flex gap-2">
              <Button variant="ghost" className="h-10" onClick={() => setShowRestored(false)}>
                Keep it
              </Button>
              <Button variant="quiet" className="h-10" onClick={startOver}>
                Start fresh
              </Button>
            </div>
          </div>
        ) : null}
        {draftError ? (
          <p className="mt-4 text-sm text-ink-soft" role="status">
            Couldn’t save a draft in this browser. You can still finish the cut.
          </p>
        ) : null}
        <div key={step} className="step-enter mt-2">
          {step === "idea" ? (
            <IdeaStep
              idea={idea}
              showError={showError}
              onIdea={(value) => {
                setIdea(value);
                if (value.trim()) setShowError(false);
              }}
              onContinue={continueFrom}
            />
          ) : null}
          {step === "who" || step === "tonight" || step === "tempted" ? (
            <QuestionStep
              index={questionIndex}
              title={question.title}
              hint={question.hint}
              placeholder={question.placeholder}
              value={answer}
              onChange={changeAnswer}
              onBack={() => setStep(previousStep(step))}
              onSkip={skipQuestion}
              onContinue={continueFrom}
            />
          ) : null}
          {step === "card" ? (
            <CutCard
              card={card}
              name={shownName}
              onNameChange={(value) => {
                setNameTouched(true);
                setName(value);
              }}
              onStartOver={startOver}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Brand({ hero }: { hero: boolean }) {
  if (!hero) {
    return (
      <div className="mb-8 flex items-center gap-2.5">
        <Mark className="size-7" />
        <p className="text-sm font-semibold tracking-tight text-ink">First Cut</p>
      </div>
    );
  }

  return (
    <header>
      <Mark className="size-11" />
      <p className="mt-8 text-xs font-semibold tracking-[0.18em] text-accent uppercase">Before any code</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-[-0.035em] text-ink sm:text-6xl">First Cut</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-pretty text-ink-soft">
        Paste a fuzzy idea. Leave with a version you can finish tonight, and a list of what you will not build.
      </p>
    </header>
  );
}
