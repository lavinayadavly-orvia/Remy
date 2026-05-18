import { NextResponse } from "next/server";
import { hasOpenAIKey } from "@/lib/ai/client";
import { critiqueDraft } from "@/lib/ai/critiqueDraft";
import { createOutputPlan } from "@/lib/ai/createOutputPlan";
import { generateDraft } from "@/lib/ai/generateDraft";
import { generateNextActions } from "@/lib/ai/generateNextActions";
import { improveDraft } from "@/lib/ai/improveDraft";
import { requiresApproachGate, validateGeneratedText, validatePlan, validatePowerPointQuality } from "@/lib/ai/ruleChecks";
import { understandCommand } from "@/lib/ai/understandCommand";
import type { GenerateRequest, GeneratedVersion } from "@/lib/ai/schemas";
import { classifyTask } from "@/lib/ai/taskClassifier";
import { addVersion, getProject } from "@/lib/files/projectStorage";
import { saveMarkdownOutput } from "@/lib/files/outputStorage";
import { logError, readErrors } from "@/lib/storage/errorStore";
import { readMemory } from "@/lib/storage/memoryStore";
import { createId } from "@/lib/utils/ids";

export async function POST(request: Request) {
  const body = (await request.json()) as GenerateRequest;
  if (!body.projectId || !body.command || !body.outputType || !body.audience || !body.tone) {
    return NextResponse.json({ error: "projectId, command, outputType, audience, and tone are required." }, { status: 400 });
  }

  const project = await getProject(body.projectId);
  const [memory, errors] = await Promise.all([readMemory(), readErrors()]);
  const classification = classifyTask({ command: body.command, outputType: body.outputType });

  if (requiresApproachGate(classification, body.selectedApproach)) {
    return NextResponse.json(
      {
        requiresApproachSelection: true,
        message: "Choose an approach before MyDesk generates this significant output.",
        classification,
        approaches: classification.approaches,
        memoryChecked: Boolean(memory),
        errorLogChecked: Boolean(errors)
      },
      { status: 428 }
    );
  }

  if (!hasOpenAIKey()) {
    await logError({
      what_failed: "Generation requested without OPENAI_API_KEY configured.",
      what_worked: "Stopped generation and returned a clear configuration error.",
      remember: "Do not generate local placeholder output when the API key is missing."
    });
    return NextResponse.json(
      {
        error: "OpenAI is not configured. Add OPENAI_API_KEY to .env and restart npm run dev before generating real outputs.",
        classification,
        memoryChecked: Boolean(memory),
        errorLogChecked: Boolean(errors),
        errorLogUpdated: true
      },
      { status: 503 }
    );
  }

  try {
    understandCommand(body.command, body);
    const plan = await createOutputPlan({ ...body, references: project.references, template: project.template, memory, errors });
    const planCheck = validatePlan(plan, body.count);
    if (!planCheck.ok) {
      await logError({
        what_failed: `Plan validation failed: ${planCheck.failures.join(", ")}`,
        remember: "Regenerate plans that ignore requested count or include placeholders."
      });
      return NextResponse.json({ error: "Output plan failed MyDesk rule checks.", failures: planCheck.failures }, { status: 422 });
    }

    const draftMarkdown = await generateDraft(plan);
    const critique = await critiqueDraft(draftMarkdown);
    let finalMarkdown = await improveDraft(draftMarkdown, critique);
    let outputCheck = validateGeneratedText(finalMarkdown, classification);

    if (!outputCheck.ok) {
      finalMarkdown = await improveDraft(finalMarkdown, {
        ...critique,
        issues: [
          ...critique.issues,
          {
            area: "Rule compliance",
            finding: `The output failed rule checks: ${outputCheck.failures.join(", ")}`,
            recommendation: "Fix the output without changing the requested objective, audience, tone, output type, or structure."
          }
        ]
      });
      outputCheck = validateGeneratedText(finalMarkdown, classification);
    }

    if (!outputCheck.ok) {
      await logError({
        what_failed: `Generated output failed validation twice: ${outputCheck.failures.join(", ")}`,
        what_worked: "Stopped before showing non-compliant output.",
        remember: "Strengthen prompts for status summaries, caveats, and placeholder blocking."
      });
      return NextResponse.json({ error: "Generated output failed MyDesk rule checks.", failures: outputCheck.failures }, { status: 422 });
    }

    if (body.outputType === "PowerPoint deck") {
      const deckFinalCheck = validatePowerPointQuality(plan, finalMarkdown, {
        hasReferences: project.references.length > 0,
        command: body.command
      });
      if (!deckFinalCheck.ok) {
        await logError({
          what_failed: `PowerPoint quality final gate failed: ${deckFinalCheck.failures.join(", ")}`,
          what_worked: "Stopped before saving or exporting a weak deck.",
          remember: "PowerPoint decks must pass quality checks before becoming downloadable."
        });
        return NextResponse.json(
          { error: "Output quality check failed. Please regenerate or provide reference materials.", failures: deckFinalCheck.failures },
          { status: 422 }
        );
      }
    }

    const nextActions = await generateNextActions(finalMarkdown);

    const version: GeneratedVersion = {
      id: createId("version"),
      createdAt: new Date().toISOString(),
      command: body.command,
      outputType: body.outputType,
      audience: body.audience,
      tone: body.tone,
      count: body.count,
      selectedApproach: body.selectedApproach,
      references: project.references,
      template: project.template,
      plan,
      draftMarkdown,
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
    const message = error instanceof Error ? error.message : "Unknown generation failure.";
    await logError({
      what_failed: `Generation pipeline failed: ${message}`,
      what_worked: "Stopped before saving or showing a fake fallback output.",
      remember: "Generation failures must be visible and logged; do not substitute placeholder output."
    });
    return NextResponse.json({ error: message, errorLogUpdated: true }, { status: 500 });
  }
}
