import type { UploadedReference } from "@/lib/ai/schemas";

export function TemplateUploader({
  template,
  onUpload,
  uploading
}: {
  template?: UploadedReference;
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  return (
    <section className="rounded-md border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-black text-navy">Template</h2>
        {uploading ? <span className="text-xs text-steel">Uploading...</span> : null}
      </div>
      <p className="mt-1 text-xs leading-5 text-steel">Optional. Add a PPTX, DOCX, or related template so MyDesk can follow its structure and style.</p>
      <label className="mt-3 flex cursor-pointer items-center justify-center rounded-md border border-dashed border-line bg-[#FBFCFD] px-4 py-4 text-center text-sm font-semibold text-steel transition hover:border-steel hover:bg-mist">
        <input
          type="file"
          accept=".ppt,.pptx,.potx,.doc,.docx"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.currentTarget.value = "";
          }}
        />
        Upload Word or PowerPoint template
      </label>
      {template ? (
        <div className="mt-3 rounded-md border border-line bg-[#F8FAFC] px-3 py-2 text-xs text-ink">
          <div className="font-semibold">{template.originalName}</div>
          <div className="mt-1 text-steel">
            {template.warning || (template.extractedText ? "Readable template text extracted for structure guidance." : "Template saved for generation guidance.")}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-5 text-steel">No template selected. MyDesk will use the chosen output type defaults.</p>
      )}
    </section>
  );
}
