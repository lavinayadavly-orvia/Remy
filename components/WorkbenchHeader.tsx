import type { Project } from "@/lib/ai/schemas";

export function WorkbenchHeader({ project, hasVersion }: { project: Project; hasVersion: boolean }) {
  const displayName = project.name.replace(/StudioRWE/g, "MyDesk");
  const exportDisabled = !hasVersion;

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-5 py-4 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-sm font-black text-white">M</div>
            <div>
              <div className="text-xl font-black tracking-tight text-navy">MyDesk</div>
              <div className="mt-0.5 truncate text-sm font-semibold text-steel">{displayName}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1 rounded-full border border-line bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-steel">
            {hasVersion ? "Output ready" : "No output yet"}
          </div>
          {["Word", "PPT", "PDF"].map((label) => (
            <button
              key={label}
              type="button"
              disabled={exportDisabled}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-navy transition hover:border-steel hover:bg-mist disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-steel"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
