export function CommandBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">Command or brief</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        className="mt-2 w-full resize-none rounded-md border border-line bg-[#FBFCFD] p-4 text-sm leading-6 text-ink outline-none transition placeholder:text-slate-400 focus:border-steel focus:bg-white focus:ring-2 focus:ring-steel/20"
        placeholder="Create a 12-slide oncology RWE opportunity deck for MSD India..."
      />
    </label>
  );
}
