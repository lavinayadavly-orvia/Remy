import type { Project } from "@/lib/ai/schemas";
import { formatTimestamp } from "@/lib/utils/date";

export function ProjectHeader({ project }: { project: Project }) {
  const displayName = project.name.replace(/StudioRWE/g, "MyDesk");
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto max-w-[1480px] px-5 py-4">
        <div className="flex flex-col gap-4 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-steel">MyDesk</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-navy">{displayName}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {["Private Library", "Learned Style", "Command", "Final Output", "Download"].map((step) => (
              <span key={step} className="rounded-full border border-line bg-mist px-3 py-1 font-semibold text-steel">
                {step}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 min-[760px]:grid-cols-3">
          <div className="rounded border border-line bg-white px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-steel">Mode</p>
            <p className="mt-1 text-sm font-bold text-ink">Private execution assistant</p>
          </div>
          <div className="rounded border border-line bg-white px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-steel">Versions</p>
            <p className="mt-1 text-sm font-bold text-ink">{project.versions.length} saved</p>
          </div>
          <div className="rounded border border-line bg-white px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-steel">Updated</p>
            <p className="mt-1 text-sm font-bold text-ink">{formatTimestamp(project.updatedAt)}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
