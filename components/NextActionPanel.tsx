import type { NextActions } from "@/lib/ai/schemas";

export function NextActionPanel({ nextActions }: { nextActions?: NextActions }) {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-workbench">
      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-navy">Next action</h2>
      {!nextActions ? <p className="mt-3 text-sm text-steel">Waiting for next action.</p> : null}
      {nextActions ? (
        <div className="mt-3 space-y-3 text-sm">
          <p className="font-semibold text-ink">{nextActions.recommended_next_action}</p>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-steel">Suggested follow-up</div>
            <p className="mt-1 text-ink">{nextActions.suggested_follow_up_task}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
