import type { UploadedReference } from "@/lib/ai/schemas";

export function FileUploader({
  references,
  onUpload,
  uploading
}: {
  references: UploadedReference[];
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  return (
    <section className="rounded-md border border-line bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-navy">Reference materials</h2>
        {uploading ? <span className="text-xs text-steel">Uploading...</span> : null}
      </div>
      <p className="mt-1 text-xs leading-5 text-steel">Attach source material so the output is grounded in provided context.</p>
      <label className="mt-3 flex cursor-pointer items-center justify-center rounded-md border border-dashed border-line bg-[#FBFCFD] px-4 py-5 text-center text-sm font-semibold text-steel transition hover:border-steel hover:bg-mist">
        <input
          type="file"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.currentTarget.value = "";
          }}
        />
        Add TXT, MD, CSV, JSON, or reference file
      </label>
      <div className="mt-3 space-y-2">
        {!references.length ? <p className="text-xs leading-5 text-steel">No reference material added. MyDesk will use the command only and flag assumptions or source limitations.</p> : null}
        {references.map((reference) => (
          <div key={reference.id} className="rounded-md border border-line bg-[#FBFCFD] px-3 py-2 text-xs text-ink">
            <div className="font-semibold">{reference.originalName}</div>
            {reference.warning ? <div className="mt-1 text-steel">{reference.warning}</div> : <div className="mt-1 text-steel">Text extracted for prompt context.</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
