import type { GeneratedVersion, ReviewNotes } from "@/lib/ai/schemas";

export type OutputStage = "plan" | "draft" | "critique" | "final";

const stages: Array<{ id: OutputStage; label: string; description: string }> = [
  { id: "plan", label: "Structure", description: "Output shape and assumptions" },
  { id: "draft", label: "Working Version", description: "Generated content" },
  { id: "critique", label: "Quality Check", description: "Evidence and polish review" },
  { id: "final", label: "Final Output", description: "Ready to preview and download" }
];

export function StageOutputPanel({
  activeVersion,
  activeStage,
  loading,
  status,
  onStageChange
}: {
  activeVersion?: GeneratedVersion;
  activeStage: OutputStage;
  loading: boolean;
  status: string;
  onStageChange: (stage: OutputStage) => void;
}) {
  const activeStageLabel = stages.find((stage) => stage.id === activeStage)?.label || "Output";

  return (
    <section className="flex min-h-[760px] flex-col bg-[#FBFCFD]">
      <div className="border-b border-line bg-white px-5 py-4">
        <div className="flex flex-col gap-3 min-[760px]:flex-row min-[760px]:items-end min-[760px]:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.14em] text-steel">Output generator</div>
            <h1 className="mt-1 text-xl font-black tracking-tight text-navy">{activeStageLabel}</h1>
          </div>
          <div className="rounded-full border border-line bg-[#F8FAFC] px-3 py-1 text-xs font-bold text-steel">
            {activeVersion ? "Version ready" : loading ? "Generating" : "Waiting for command"}
          </div>
        </div>
        <div className="mt-4 grid gap-2 min-[760px]:grid-cols-4">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => onStageChange(stage.id)}
              className={`group rounded-md border px-3 py-3 text-left transition ${
                activeStage === stage.id ? "border-navy bg-navy text-white shadow-workbench" : "border-line bg-white text-ink hover:border-steel hover:bg-mist"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    activeStage === stage.id ? "bg-white text-navy" : "bg-mist text-steel group-hover:bg-white"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black">{stage.label}</span>
                  <span className={`mt-0.5 block text-xs font-semibold ${activeStage === stage.id ? "text-white/75" : "text-steel"}`}>
                    {stage.description}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto px-5 py-5">
        {!activeVersion ? (
          <div className="flex min-h-[560px] items-center justify-center rounded-md border border-dashed border-line bg-white px-6">
            <div className="max-w-xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mist text-lg font-black text-navy">1</div>
              <h2 className="mt-4 text-lg font-black text-navy">{loading ? "MyDesk is building the output" : "Start with a command on the left"}</h2>
              <p className="mt-2 text-sm leading-6 text-steel">
                {loading
                  ? status || "MyDesk is producing one reviewed version with assumptions, source gaps, and quality checks handled internally."
                  : "Your polished output will appear here after MyDesk applies the relevant library material, style cues, assumptions, and quality checks."}
              </p>
              <div className="mt-5 grid gap-2 text-left text-sm min-[620px]:grid-cols-4">
                {stages.map((stage, index) => (
                  <div key={stage.id} className="rounded-md border border-line bg-[#F8FAFC] p-3">
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-steel">Step {index + 1}</div>
                    <div className="mt-1 font-black text-ink">{stage.label}</div>
                    <div className="mt-1 text-xs leading-4 text-steel">{stage.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-line bg-white p-5 shadow-workbench">
            <StageContent activeVersion={activeVersion} activeStage={activeStage} />
          </div>
        )}
      </div>
    </section>
  );
}

function StageContent({ activeVersion, activeStage }: { activeVersion: GeneratedVersion; activeStage: OutputStage }) {
  if (activeStage === "plan") return <PlanView version={activeVersion} />;
  if (activeStage === "draft") return <MarkdownView markdown={activeVersion.draftMarkdown} />;
  if (activeStage === "critique") return <CritiqueView critique={activeVersion.critique} />;
  return <MarkdownView markdown={activeVersion.finalMarkdown} />;
}

function PlanView({ version }: { version: GeneratedVersion }) {
  return (
    <div className="space-y-6 text-sm leading-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-navy">{version.plan.title}</h1>
        <p className="mt-2 max-w-3xl text-steel">{version.plan.objective}</p>
      </div>
      <section>
        <h2 className="text-sm font-black text-navy">Key messages</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink">
          {version.plan.key_messages.map((message, index) => (
            <li key={`${message}-${index}`}>{message}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-sm font-black text-navy">Structure</h2>
        <p className="mt-2 text-ink">{version.plan.structure}</p>
      </section>
      <section>
        <h2 className="text-sm font-black text-navy">Sections</h2>
        <div className="mt-3 divide-y divide-line border-y border-line">
          {version.plan.sections_or_slides.map((item) => (
            <div key={`${item.number}-${item.headline}`} className="py-3">
              <div className="text-xs font-black uppercase tracking-[0.12em] text-steel">
                {item.type} {item.number}
              </div>
              <div className="mt-1 font-black text-ink">{item.headline}</div>
              <div className="mt-1 text-steel">{item.key_message}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CritiqueView({ critique }: { critique: ReviewNotes }) {
  return (
    <div className="space-y-5 text-sm leading-6">
      <p className="text-base font-semibold text-ink">{critique.summary}</p>
      <section>
        <h2 className="text-sm font-black text-navy">Quality checks</h2>
        <div className="mt-3 divide-y divide-line border-y border-line">
          {critique.issues.map((issue, index) => (
            <div key={`${issue.area}-${index}`} className="py-3">
              <div className="font-black text-ink">{issue.area}</div>
              <div className="mt-1 text-steel">{issue.finding}</div>
              <div className="mt-1 text-ink">{issue.recommendation}</div>
            </div>
          ))}
        </div>
      </section>
      {critique.compliance_notes.length ? <SimpleList title="Compliance notes" items={critique.compliance_notes} /> : null}
      {critique.source_limitations.length ? <SimpleList title="Source limitations" items={critique.source_limitations} /> : null}
    </div>
  );
}

function SimpleList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-sm font-black text-navy">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-ink">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function MarkdownView({ markdown }: { markdown: string }) {
  return <div className="markdown-preview text-sm leading-6" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />;
}

function renderMarkdown(markdown: string) {
  const html = markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br />");
  return `<p>${html}</p>`;
}
