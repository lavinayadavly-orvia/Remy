import { VersionHistory } from "@/components/VersionHistory";
import type { GeneratedVersion, Project } from "@/lib/ai/schemas";
import type React from "react";

export function ReviewActionPanel({
  project,
  activeVersion,
  revisionCommand,
  loading,
  onRevisionChange,
  onImprove,
  onStartNextAction,
  onSelectVersion
}: {
  project: Project;
  activeVersion?: GeneratedVersion;
  revisionCommand: string;
  loading: boolean;
  onRevisionChange: (value: string) => void;
  onImprove: () => void;
  onStartNextAction: () => void;
  onSelectVersion: (version: GeneratedVersion) => void;
}) {
  const assumptions = activeVersion?.plan.assumptions || [];
  const missingInputs = activeVersion?.plan.missing_information || [];
  const qualityChecks = activeVersion?.critique.issues || [];

  return (
    <aside className="space-y-5 bg-white px-5 py-5">
      <div className="rounded-md border border-line bg-[#F8FAFC] p-3">
        <div className="text-xs font-black uppercase tracking-[0.14em] text-steel">Final output</div>
        <div className="mt-1 text-sm font-black text-navy">Refine and download</div>
        <p className="mt-1 text-xs leading-5 text-steel">Use this panel after the polished output is ready.</p>
      </div>

      <ReviewSection title="Key assumptions" empty="Generated assumptions will appear here." hasContent={assumptions.length > 0}>
        <List items={assumptions} />
      </ReviewSection>

      <ReviewSection title="Missing inputs" empty="Missing inputs will appear here if MyDesk flags any." hasContent={missingInputs.length > 0}>
        <List items={missingInputs} />
      </ReviewSection>

      <ReviewSection title="Quality checks" empty="Quality checks will appear after generation." hasContent={qualityChecks.length > 0}>
        <div className="space-y-3">
          {qualityChecks.slice(0, 4).map((issue, index) => (
            <div key={`${issue.area}-${index}`} className="border-b border-line pb-3 last:border-0 last:pb-0">
              <div className="text-sm font-black text-ink">{issue.area}</div>
              <div className="mt-1 text-sm leading-5 text-steel">{issue.finding}</div>
            </div>
          ))}
        </div>
      </ReviewSection>

      <section className="rounded-md border border-line bg-white p-4 shadow-workbench">
        <h2 className="text-sm font-black text-navy">Tweak request</h2>
        <p className="mt-1 text-xs leading-5 text-steel">Ask for a focused revision to the active version.</p>
        <textarea
          value={revisionCommand}
          onChange={(event) => onRevisionChange(event.target.value)}
          rows={5}
          className="mt-2 w-full resize-none rounded-md border border-line bg-white p-3 text-sm leading-5 text-ink outline-none focus:border-steel focus:ring-2 focus:ring-steel/20"
          placeholder="Tighten the executive story, add commercial logic, reduce claims..."
        />
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={onImprove}
            disabled={loading || !activeVersion || !revisionCommand.trim()}
            className="rounded-md bg-navy px-3 py-2 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-steel/50"
          >
            Improve output
          </button>
          <DownloadLinks projectId={project.id} version={activeVersion} />
          <button
            type="button"
            onClick={onStartNextAction}
            disabled={!activeVersion}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm font-black text-navy transition hover:border-steel hover:bg-mist disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-steel"
          >
            Start next action
          </button>
        </div>
      </section>

      {activeVersion?.nextActions ? (
        <section className="rounded-md border border-line bg-[#F8FAFC] p-4">
          <h2 className="text-sm font-black text-navy">Next action</h2>
          <p className="mt-2 text-sm font-semibold leading-5 text-ink">{activeVersion.nextActions.recommended_next_action}</p>
          <p className="mt-2 text-sm leading-5 text-steel">{activeVersion.nextActions.suggested_follow_up_task}</p>
        </section>
      ) : null}

      <VersionHistory versions={project.versions} activeVersionId={activeVersion?.id} onSelect={onSelectVersion} />
    </aside>
  );
}

function DownloadLinks({ projectId, version }: { projectId: string; version?: GeneratedVersion }) {
  if (!version) {
    return (
      <div className="grid gap-2">
        {["Download Word", "Download PowerPoint", "Download Markdown/Text"].map((label) => (
          <button
            key={label}
            type="button"
            disabled
            className="rounded-md border border-line bg-[#F8FAFC] px-3 py-2 text-sm font-black text-steel disabled:cursor-not-allowed"
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  const query = `projectId=${encodeURIComponent(projectId)}&versionId=${encodeURIComponent(version.id)}`;
  const links = [
    { label: "Download Word", href: `/api/export/docx?${query}` },
    { label: "Download PowerPoint", href: `/api/export/pptx?${query}` },
    { label: "Download Markdown/Text", href: `/api/export/text?${query}` }
  ];

  return (
    <div className="grid gap-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="rounded-md border border-line bg-white px-3 py-2 text-center text-sm font-black text-navy transition hover:border-steel hover:bg-mist"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function ReviewSection({ title, empty, hasContent, children }: { title: string; empty: string; hasContent: boolean; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-black text-navy">{title}</h2>
      {hasContent ? <div className="mt-2">{children}</div> : <p className="mt-2 text-sm leading-5 text-steel">{empty}</p>}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm leading-5 text-ink">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}
