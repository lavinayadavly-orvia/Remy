import { callTextModel, hasOpenAIKey } from "@/lib/ai/client";
import { draftPrompt } from "@/lib/ai/prompts";
import type { OutputPlan } from "@/lib/ai/schemas";

export async function generateDraft(plan: OutputPlan): Promise<string> {
  if (!hasOpenAIKey()) throw new Error("OpenAI is not configured. Cannot generate a draft.");
  return callTextModel(draftPrompt(JSON.stringify(plan, null, 2)), false, {
    userCommand: plan.title,
    taskType: plan.output_type,
    riskLevel: "medium"
  });
}
