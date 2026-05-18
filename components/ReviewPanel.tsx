import type { ReviewNotes } from "@/lib/ai/schemas";

export function ReviewPanel({ critique }: { critique?: ReviewNotes }) {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-workbench">
      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-navy">Review notes</h2>
      {!critique ? <p className="mt-3 text-sm text-steel">Waiting for review notes.</p> : null}
      {critique ? (
        <div className="mt-3 space-y-3 text-sm">
          <p className="text-ink">{critique.summary}</p>
          {critique.issues.map((issue, index) => (
            <div key={`${issue.area}-${index}`} className="rounded-md border border-line bg-[#F8FAFC] p-3">
              <div className="font-semibold text-ink">{issue.area}</div>
              <div className="mt-1 text-steel">{issue.finding}</div>
              <div className="mt-1 text-ink">{issue.recommendation}</div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
