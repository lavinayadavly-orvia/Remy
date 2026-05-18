import { callTextModel, hasOpenAIKey } from "@/lib/ai/client";
import { parseJsonObject } from "@/lib/ai/json";
import { planPrompt } from "@/lib/ai/prompts";
import type { Audience, OutputPlan, OutputType, Tone, UploadedReference } from "@/lib/ai/schemas";

export async function createOutputPlan(input: {
  command: string;
  outputType: OutputType;
  audience: Audience;
  tone: Tone;
  count?: number;
  selectedApproach?: string;
  references: UploadedReference[];
  template?: UploadedReference;
  memory?: string;
  errors?: string;
}): Promise<OutputPlan> {
  if (!hasOpenAIKey()) throw new Error("OpenAI is not configured. Cannot create an output plan.");
  const raw = await callTextModel(planPrompt(input), true, {
    userCommand: input.command,
    uploadedMaterialContext: input.references.map((reference) => reference.originalName).join(", ") || "No references uploaded.",
    templateContext: input.template?.originalName || "No template uploaded.",
    taskType: input.outputType,
    riskLevel: "medium",
    memory: input.memory,
    errors: input.errors,
    fixedFacts: "Platform name: MyDesk."
  });
  return parseJsonObject<OutputPlan>(raw);
}
