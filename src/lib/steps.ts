import type { Step } from "../types.ts";

export function nextStep(step: Step): Step {
  switch (step) {
    case "idea":
      return "who";
    case "who":
      return "tonight";
    case "tonight":
      return "tempted";
    case "tempted":
      return "card";
    case "card":
      return "card";
    default: {
      const exhaustive: never = step;
      return exhaustive;
    }
  }
}

export function previousStep(step: Step): Step {
  switch (step) {
    case "idea":
      return "idea";
    case "who":
      return "idea";
    case "tonight":
      return "who";
    case "tempted":
      return "tonight";
    case "card":
      return "tempted";
    default: {
      const exhaustive: never = step;
      return exhaustive;
    }
  }
}
