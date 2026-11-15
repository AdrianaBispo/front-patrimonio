export default function PaginationButton({
  children,
  onClick,
  active = false,
  disabled = false,
  ariaLabel,
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm ${
        active
          ? "border-secondary bg-secondary text-white"
          : "border-border bg-white text-text-primary hover:bg-bg-secondary"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
}
