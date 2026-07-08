export function PipingDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 14"
      fill="none"
      className={className ?? "piping-divider"}
      aria-hidden="true"
    >
      <path
        d="M2 7C10 -1 18 15 26 7C34 -1 42 15 50 7C56 1 62 9 70 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
