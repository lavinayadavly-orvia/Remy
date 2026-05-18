import { NextResponse } from "next/server";
import { hasOpenAIKey } from "@/lib/ai/client";
import { critiqueDraft } from "@/lib/ai/critiqueDraft";
import { generateNextActions } from "@/lib/ai/generateNextActions";
import { improveDraft } from "@/lib/ai/improveDraft";
import { validateGeneratedText } from "@/lib/ai/ruleChecks";
import { reviseOutput } from "@/lib/ai/revisionEngine";
import type { GeneratedVersion, ReviseRequest } from "@/lib/ai/schemas";
import { classifyTask } from "@/lib/ai/taskClassifier";
import { addVersion, getProject } from "@/lib/files/projectStorage";
import { saveMarkdownOutput } from "@/lib/files/outputStorage";
import { logError, readErrors } from "@/lib/storage/errorStore";
import { readMemory } from "@/lib/storage/memoryStore";
import { createId } from "@/lib/utils/ids";

export async function POST(request: Request) {
  const body = (await request.json()) as ReviseRequest;
  if (!body.projectId || !body.versionId || !body.revisionCommand) {
    return NextResponse.json({ error: "projectId, versionId, and revisionCommand are required." }, { status: 400 });
  }

  const project = await getProject(body.projectId);
  const [memory, errors] = await Promise.all([readMemory(), readErrors()]);
  const classification = classifyTask({ command: body.revisionCommand, isRevision: true });

  if (classification.needs_confirmation) {
    return NextResponse.json(
      {
        requiresConfirmation: true,
        message: "This revision may materially alter existing content. Confirm the affected sections before MyDesk proceeds.",
        classification,
        memoryChecked: Boolean(memory),
        errorLogChecked: Boolean(errors)
      },
      { status: 428 }
    );
  }

  if (!hasOpenAIKey()) {
    await logError({
      what_failed: "Revision requested without OPENAI_API_KEY configured.",
      what_worked: "Stopped revision and returned a clear configuration error.",
      remember: "Do not generate local placeholder revisions when the API key is missing."
    });
    return NextResponse.json({ error: "OpenAI is not configured. Add OPENAI_API_KEY to .env and restart npm run dev before revising outputs." }, { status: 503 });
  }

  const source = project.versions.find((version) => version.id === body.versionId);
  if (!source) {
    return NextResponse.json({ error: "Source version not found." }, { status: 404 });
  }

  try {
    const revisedDraft = await reviseOutput(source.finalMarkdown, body.revisionCommand);
    const critique = await critiqueDraft(revisedDraft);
    const finalMarkdown = await improveDraft(revisedDraft, critique);
    const outputCheck = validateGeneratedText(finalMarkdown, classification);
    if (!outputCheck.ok) {
      await logError({
        what_failed: `Revision output failed validation: ${outputCheck.failures.join(", ")}`,
        what_worked: "Stopped before saving non-compliant revision."
      });
      return NextResponse.json({ error: "Revision failed MyDesk rule checks.", failures: outputCheck.failures }, { status: 422 });
    }
    const nextActions = await generateNextActions(finalMarkdown);

    const version: GeneratedVersion = {
      ...source,
      id: createId("version"),
      createdAt: new Date().toISOString(),
      revisionCommand: body.revisionCommand,
      draftMarkdown: revisedDraft,
      critique,
      finalMarkdown,
      nextActions
    };

    version.generatedFiles = {
      markdown: await saveMarkdownOutput(body.projectId, version)
    };

    const updatedProject = await addVersion(body.projectId, version);
    return NextResponse.json({ project: updatedProject, version, classification, memoryChecked: Boolean(memory), errorLogChecked: Boolean(errors) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown revision failure.";
    await logError({
      what_failed: `Revision pipeline failed: ${message}`,
      what_worked: "Stopped before saving or showing a fake fallback output.",
      remember: "Revision failures must be visible and logged; do not substitute placeholder output."
    });
    return NextResponse.json({ error: message, errorLogUpdated: true }, { status: 500 });
  }
}
