import { FileUploader } from "@/components/FileUploader";
import { TemplateUploader } from "@/components/TemplateUploader";
import { audiences, outputTypes, tones, type Audience, type OutputType, type Tone, type UploadedReference } from "@/lib/ai/schemas";
import type { TaskClassification } from "@/lib/ai/taskClassifier";
import type React from "react";

export function CommandMaterialsPanel({
  command,
  outputType,
  audience,
  tone,
  count,
  references,
  template,
  uploading,
  uploadingTemplate,
  loading,
  status,
  aiConfigured,
  approaches,
  onCommandChange,
  onOutputTypeChange,
  onAudienceChange,
  onToneChange,
  onCountChange,
  onUpload,
  onTemplateUpload,
  onSubmit,
  onSelectApproach
}: {
  command: string;
  outputType: OutputType;
  audience: Audience;
  tone: Tone;
  count: number;
  references: UploadedReference[];
  template?: UploadedReference;
  uploading: boolean;
  uploadingTemplate: boolean;
  loading: boolean;
  status: string;
  aiConfigured: boolean;
  approaches: TaskClassification["approaches"];
  onCommandChange: (value: string) => void;
  onOutputTypeChange: (value: OutputType) => void;
  onAudienceChange: (value: Audience) => void;
  onToneChange: (value: Tone) => void;
  onCountChange: (value: number) => void;
  onUpload: (file: File) => void;
  onTemplateUpload: (file: File) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSelectApproach: (approachId: string) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="rounded-md border border-line bg-[#F8FAFC] p-3">
        <div className="text-xs font-black uppercase tracking-[0.14em] text-steel">Step 1</div>
        <div className="mt-1 text-sm font-black text-navy">Command and source material</div>
        <p className="mt-1 text-xs leading-5 text-steel">Define the job, choose the output shape, add a template if needed, and attach source material.</p>
      </div>

      <section className="space-y-3">
        <label className="block">
          <span className="text-sm font-black text-navy">Command</span>
          <textarea
            value={command}
            onChange={(event) => onCommandChange(event.target.value)}
            rows={7}
            className="mt-2 w-full resize-none rounded-md border border-line bg-white p-4 text-base leading-6 text-ink outline-none transition placeholder:text-slate-400 focus:border-steel focus:ring-2 focus:ring-steel/20"
            placeholder="Create a 12-slide oncology RWE opportunity deck for Medical Affairs..."
          />
        </label>
        {!aiConfigured ? (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-950">
            OpenAI is not configured. Please add the API key before generating output.
          </div>
        ) : null}
        {status ? <div className="rounded-md border border-line bg-[#F8FAFC] px-3 py-2 text-sm leading-5 text-steel">{status}</div> : null}
      </section>

      {approaches.length ? (
        <section className="space-y-2">
          <h2 className="text-sm font-black text-navy">Choose an approach</h2>
          {approaches.map((approach) => (
            <button
              key={approach.id}
              type="button"
              onClick={() => onSelectApproach(approach.id)}
              className="w-full rounded-md border border-line bg-white px-3 py-3 text-left transition hover:border-navy hover:bg-mist"
            >
              <span className="block text-sm font-bold text-ink">{approach.label}</span>
              <span className="mt-1 block text-sm leading-5 text-steel">{approach.description}</span>
            </button>
          ))}
        </section>
      ) : null}

      <section className="space-y-3 rounded-md border border-line bg-white p-4">
        <div>
          <h2 className="text-sm font-black text-navy">Output settings</h2>
          <p className="mt-1 text-xs leading-5 text-steel">These settings control the format, audience, tone, and length of the generated artifact.</p>
        </div>
        <select
          value={outputType}
          onChange={(event) => onOutputTypeChange(event.target.value as OutputType)}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-steel focus:ring-2 focus:ring-steel/20"
        >
          {outputTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-1 gap-3 min-[1180px]:grid-cols-2">
          <Select label="Audience" value={audience} values={audiences} onChange={onAudienceChange} />
          <Select label="Tone" value={tone} values={tones} onChange={onToneChange} />
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Length</span>
          <input
            type="number"
            min={1}
            max={30}
            value={count}
            onChange={(event) => onCountChange(Number(event.target.value))}
            className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-steel focus:ring-2 focus:ring-steel/20"
          />
        </label>
      </section>

      <section>
        <TemplateUploader template={template} onUpload={onTemplateUpload} uploading={uploadingTemplate} />
      </section>

      <section>
        <FileUploader references={references} onUpload={onUpload} uploading={uploading} />
      </section>

      <button
        type="submit"
        disabled={loading || !command.trim()}
        className="w-full rounded-md bg-navy px-4 py-3 text-sm font-black text-white shadow-workbench transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-steel/50 disabled:shadow-none"
      >
        {loading ? "Working through plan, draft, critique, final..." : "Generate reviewed output"}
      </button>
    </form>
  );
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
        className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-steel focus:ring-2 focus:ring-steel/20"
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
