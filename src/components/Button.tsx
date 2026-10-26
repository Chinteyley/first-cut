import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-accent text-white hover:bg-accent-deep aria-disabled:hover:bg-accent",
  quiet: "border border-line bg-card text-ink hover:border-ink",
  ghost: "text-ink-soft hover:bg-black/5 hover:text-ink",
} as const;

type Variant = keyof typeof variants;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`press inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-disabled:cursor-not-allowed aria-disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
