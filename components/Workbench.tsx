"use client";

import { useState } from "react";
import type React from "react";
import type { Audience, GeneratedVersion, OutputType, Project, Tone } from "@/lib/ai/schemas";

const outputChoices: Array<{ label: string; value: OutputType }> = [
  { label: "PowerPoint", value: "PowerPoint deck" },
  { label: "Word", value: "Word proposal" },
  { label: "Memo", value: "Strategy memo" },
  { label: "PRD", value: "PRD" },
  { label: "Email", value: "Email" },
  { label: "Action Plan", value: "Action plan" },
  { label: "Codex Brief", value: "Codex build brief" }
];

export function Workbench({ initialProject, aiConfigured }: { initialProject: Project; aiConfigured: boolean }) {
  const [project, setProject] = useState(initialProject);
  const [command, setCommand] = useState("");
  const [outputType, setOutputType] = useState<OutputType>("PowerPoint deck");
  const [loading, setLoading] = useState(false);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [uploadingReference, setUploadingReference] = useState(false);
  const [activeVersion, setActiveVersion] = useState<GeneratedVersion | undefined>();
  const [status, setStatus] = useState("");
  const displayName = project.name.replace(/StudioRWE/g, "MyDesk");

  async function runGenerate() {
    if (!command.trim()) return;
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          command,
          outputType,
          audience: defaultAudience(),
          tone: defaultTone(),
          count: inferRequestedCount(command, outputType)
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || "Generation failed.");
        return;
      }
      setProject(data.project);
      setActiveVersion(data.version);
      setStatus("Final output generated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runGenerate();
  }

  async function uploadTemplate(file: File) {
    setUploadingTemplate(true);
    setStatus("");
    try {
      const formData = new FormData();
      formData.append("projectId", project.id);
      formData.append("file", file);
      const response = await fetch("/api/template", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Template upload failed.");
      setProject(data.project);
      setStatus(data.template?.warning || "Template saved. MyDesk will use it as optional structure and style guidance.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Template upload failed.");
    } finally {
      setUploadingTemplate(false);
    }
  }

  async function uploadReference(file: File) {
    setUploadingReference(true);
    setStatus("");
    try {
      const formData = new FormData();
      formData.append("projectId", project.id);
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Reference upload failed.");
      setProject(data.project);
      setStatus(data.reference?.warning || "Reference material saved. MyDesk will use it as optional context.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Reference upload failed.");
    } finally {
      setUploadingReference(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071A33] text-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(84,132,181,0.28),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(255,255,255,0.12),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.08)_0,transparent_34%,rgba(255,255,255,0.05)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-64 w-[760px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

      <header className="relative border-b border-white/10 bg-[#071A33]/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between">
          <div className="min-w-0">
            <div className="text-2xl font-black tracking-tight text-white">MyDesk V1</div>
            <div className="mt-1 truncate text-sm font-semibold text-white/65">Private executive execution assistant - {displayName}</div>
          </div>
          <nav className="flex items-center gap-5 text-sm font-bold text-white">
            <a href="/" className="transition hover:text-white/70">
              Private Library
            </a>
            <a href="#history" className="transition hover:text-white/70">
              History
            </a>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 min-[980px]:py-20">
        <form onSubmit={generate} className="rounded-lg border border-white/20 bg-white/95 p-7 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur min-[760px]:p-9">
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.14em] text-navy">Delegate</span>
            <textarea
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              rows={8}
              className="mt-4 w-full resize-none rounded-lg border border-[#C9D4DF] bg-[#FBFCFD] p-6 text-2xl leading-9 text-ink outline-none transition placeholder:text-slate-400 focus:border-[#244C73] focus:bg-white focus:ring-4 focus:ring-[#244C73]/15"
              placeholder="Tell MyDesk the output to create, the audience, and any must-use context..."
            />
          </label>
          <p className="mt-3 text-sm font-medium text-steel">Give the business task once. MyDesk will use your library, style cues, assumptions, and quality checks to produce a downloadable final output.</p>

          <div className="mt-7 grid gap-4 min-[720px]:grid-cols-[minmax(260px,360px)_auto] min-[720px]:items-end">
            <label className="block">
              <span className="text-sm font-black uppercase tracking-[0.14em] text-navy">Final output</span>
              <select
                value={outputType}
                onChange={(event) => setOutputType(event.target.value as OutputType)}
                className="mt-2 w-full rounded-md border border-[#C9D4DF] bg-[#FBFCFD] px-4 py-3.5 text-sm font-bold text-ink outline-none focus:border-[#244C73] focus:bg-white focus:ring-4 focus:ring-[#244C73]/15"
              >
                {outputChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={loading || !command.trim() || !aiConfigured}
              className="rounded-md bg-[#071A33] px-7 py-3.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(7,26,51,0.28)] transition hover:bg-[#12365D] disabled:cursor-not-allowed disabled:bg-steel disabled:shadow-none"
            >
              {loading ? "Creating final output..." : "Create final output"}
            </button>
          </div>

          <div className="mt-7 grid gap-4 min-[900px]:grid-cols-2">
            <UploadRow
              id="template-upload"
              label="Style and structure reference"
              helper="Upload a deck, proposal, memo, or template when MyDesk should learn the visible format, rhythm, and polish."
              currentFile={project.template?.originalName}
              uploading={uploadingTemplate}
              accept=".ppt,.pptx,.potx,.doc,.docx"
              onUpload={uploadTemplate}
            />
            <UploadRow
              id="reference-upload"
              label="Private library material"
              helper="Upload offering docs, prior proposals, client material, data, notes, or references MyDesk should use as local context."
              currentFile={project.references[0]?.originalName}
              currentCount={project.references.length}
              uploading={uploadingReference}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.csv,.xlsx,.xls"
              onUpload={uploadReference}
            />
          </div>

          {!aiConfigured ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
              OpenAI is not configured. Add OPENAI_API_KEY to .env and restart npm run dev before creating outputs.
            </div>
          ) : null}
          {status ? (
            <div className={`mt-4 rounded-md border px-4 py-3 text-sm font-bold ${activeVersion && status.includes("generated") ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-line bg-mist text-steel"}`}>
              {status}
            </div>
          ) : null}
        </form>

        {activeVersion ? (
          <section className="rounded-lg border border-white/20 bg-white/95 p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur min-[760px]:p-8">
            <div className="flex flex-col gap-3 border-b border-line pb-4 min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between">
              <div>
                <h1 className="text-xl font-black tracking-tight text-navy">Final Preview</h1>
                <p className="mt-1 text-sm font-semibold text-steel">{activeVersion.plan.title}</p>
              </div>
              <div className="flex flex-wrap gap-2">{downloadLinks(project.id, activeVersion)}</div>
            </div>
            <div className="markdown-preview mt-5 text-sm leading-6" dangerouslySetInnerHTML={{ __html: renderMarkdown(activeVersion.finalMarkdown) }} />
          </section>
        ) : null}
      </div>
    </main>
  );
}

function UploadRow({
  id,
  label,
  helper,
  currentFile,
  currentCount,
  uploading,
  accept,
  onUpload
}: {
  id: string;
  label: string;
  helper: string;
  currentFile?: string;
  currentCount?: number;
  uploading: boolean;
  accept?: string;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="rounded-lg border border-[#D5DEE8] bg-[#F8FAFC] p-4">
      <div className="flex flex-col gap-3 min-[560px]:flex-row min-[560px]:items-start min-[560px]:justify-between">
        <div className="min-w-0">
          <label htmlFor={id} className="text-sm font-black text-navy">
            {label}
          </label>
          <p className="mt-1 text-xs font-medium leading-5 text-steel">{helper}</p>
          {currentFile ? (
            <p className="mt-2 truncate text-xs font-bold text-navy">
              Using: {currentFile}
              {currentCount && currentCount > 1 ? ` + ${currentCount - 1} more` : ""}
            </p>
          ) : (
            <p className="mt-2 text-xs font-bold text-steel">No file selected. MyDesk will proceed with conservative assumptions.</p>
          )}
        </div>
        <label className="shrink-0 cursor-pointer rounded-md border border-[#C9D4DF] bg-white px-3 py-2 text-xs font-black text-navy shadow-sm transition hover:border-[#244C73]">
          {uploading ? "Uploading..." : "Upload"}
          <input
            id={id}
            type="file"
            accept={accept}
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
              event.currentTarget.value = "";
            }}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}

function defaultAudience(): Audience {
  return "Internal Team";
}

function defaultTone(): Tone {
  return "Senior and sharp";
}

function inferRequestedCount(command: string, outputType: OutputType) {
  if (outputType !== "PowerPoint deck") return undefined;
  const match = command.match(/\b(\d{1,2})\s*(?:slide|slides|page|pages)\b/i);
  return match ? Number(match[1]) : 8;
}

function downloadLinks(projectId: string, version: GeneratedVersion) {
  const query = `projectId=${encodeURIComponent(projectId)}&versionId=${encodeURIComponent(version.id)}`;
  if (version.outputType === "PowerPoint deck") {
    return (
      <a className="rounded-md bg-navy px-4 py-2 text-sm font-black text-white transition hover:bg-[#17365C]" href={`/api/export/pptx?${query}`}>
        Download PowerPoint
      </a>
    );
  }
  if (version.outputType === "Word proposal") {
    return (
      <a className="rounded-md bg-navy px-4 py-2 text-sm font-black text-white transition hover:bg-[#17365C]" href={`/api/export/docx?${query}`}>
        Download Word
      </a>
    );
  }
  return (
    <a className="rounded-md bg-navy px-4 py-2 text-sm font-black text-white transition hover:bg-[#17365C]" href={`/api/export/text?${query}`}>
      Download Markdown/Text
    </a>
  );
}

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
