import { callTextModel, hasOpenAIKey } from "@/lib/ai/client";
import { parseJsonObject } from "@/lib/ai/json";
import { critiquePrompt } from "@/lib/ai/prompts";
import type { ReviewNotes } from "@/lib/ai/schemas";

export async function critiqueDraft(draftMarkdown: string): Promise<ReviewNotes> {
  if (!hasOpenAIKey()) throw new Error("OpenAI is not configured. Cannot critique a draft.");
  const raw = await callTextModel(critiquePrompt(draftMarkdown), true, { taskType: "critique", riskLevel: "low" });
  return parseJsonObject<ReviewNotes>(raw);
}
