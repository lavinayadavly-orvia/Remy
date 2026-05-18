import type { GeneratedVersion } from "@/lib/ai/schemas";
import { formatTimestamp } from "@/lib/utils/date";

export function VersionHistory({
  versions,
  activeVersionId,
  onSelect
}: {
  versions: GeneratedVersion[];
  activeVersionId?: string;
  onSelect: (version: GeneratedVersion) => void;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-workbench">
      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-navy">Version history</h2>
      <div className="mt-3 space-y-2">
        {versions.length === 0 ? <p className="text-sm text-steel">No versions yet.</p> : null}
        {versions.map((version) => (
          <button
            key={version.id}
            type="button"
            onClick={() => onSelect(version)}
            className={`w-full rounded-md border px-3 py-2 text-left text-xs transition ${
              activeVersionId === version.id ? "border-navy bg-mist text-navy" : "border-line bg-white text-ink"
            }`}
          >
            <div className="font-semibold">{version.revisionCommand ? "Revision" : "Generated output"}</div>
            <div className="mt-1 text-steel">{formatTimestamp(version.createdAt)}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
