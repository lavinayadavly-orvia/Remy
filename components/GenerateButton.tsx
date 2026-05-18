export function GenerateButton({
  disabled,
  loading,
  hasCommand,
  aiConfigured
}: {
  disabled: boolean;
  loading: boolean;
  hasCommand: boolean;
  aiConfigured: boolean;
}) {
  const label = loading
    ? "Generating..."
    : !hasCommand
      ? "Enter command to generate"
      : aiConfigured
        ? "Create plan"
        : "Create plan";

  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-md bg-navy px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-steel/50"
    >
      {label}
    </button>
  );
}
