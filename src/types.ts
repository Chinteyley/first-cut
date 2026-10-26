export const STEPS = ["idea", "who", "tonight", "tempted", "card"] as const;

export type Step = (typeof STEPS)[number];

export type Draft = {
  v: 1;
  idea: string;
  who: string;
  tonight: string;
  tempted: string;
  step: Step;
  name: string;
  nameTouched: boolean;
};
