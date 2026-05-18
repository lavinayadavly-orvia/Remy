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

export function OutputPreview({ markdown }: { markdown?: string }) {
  return (
    <section className="min-h-[560px] rounded-lg border border-line bg-white p-5 shadow-workbench">
      <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-navy">Improved final</h2>
        <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-steel">Markdown</span>
      </div>
      {markdown ? (
        <div className="markdown-preview text-sm leading-6" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
      ) : (
        <div className="flex h-[420px] items-center justify-center rounded bg-mist text-center text-sm text-steel">
          Waiting for generated output.
        </div>
      )}
    </section>
  );
}
