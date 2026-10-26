export function Mark({ className = "size-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path
        className="fill-accent"
        d="M7 5.5h12.2L26.5 13v13.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-19a2 2 0 0 1 2-2z"
      />
      <path className="fill-paper" d="M19.2 5.5 26.5 13h-5.3a2 2 0 0 1-2-2V5.5z" />
      <path
        d="M10 20.5h12"
        className="stroke-paper"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
