import { audiences, outputTypes, tones, type Audience, type OutputType, type Tone } from "@/lib/ai/schemas";

export function OutputTypeSelector({ value, onChange }: { value: OutputType; onChange: (value: OutputType) => void }) {
  return <Select label="Output type" value={value} values={outputTypes} onChange={onChange} />;
}

export function AudienceSelector({ value, onChange }: { value: Audience; onChange: (value: Audience) => void }) {
  return <Select label="Audience" value={value} values={audiences} onChange={onChange} />;
}

export function ToneSelector({ value, onChange }: { value: Tone; onChange: (value: Tone) => void }) {
  return <Select label="Tone" value={value} values={tones} onChange={onChange} />;
}

function Select<T extends string>({
  label,
  value,
  values,
  onChange
}: {
  label: string;
  value: T;
  values: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="mt-2 w-full rounded-md border border-line bg-[#FBFCFD] px-3 py-2 text-sm font-medium text-ink outline-none focus:border-steel focus:bg-white focus:ring-2 focus:ring-steel/20"
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
