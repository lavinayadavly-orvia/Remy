export function DownloadPanel() {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-workbench">
      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-navy">Export</h2>
      <p className="mt-2 text-sm text-steel">Exports are unavailable until the core loop is stable.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button disabled className="rounded-md border border-line bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-steel">
          PPT
        </button>
        <button disabled className="rounded-md border border-line bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-steel">
          Word
        </button>
      </div>
    </section>
  );
}
