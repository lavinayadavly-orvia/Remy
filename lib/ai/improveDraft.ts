import { callTextModel, hasOpenAIKey } from "@/lib/ai/client";
import type { ReviewNotes } from "@/lib/ai/schemas";

export async function improveDraft(draftMarkdown: string, critique: ReviewNotes): Promise<string> {
  if (!hasOpenAIKey()) throw new Error("OpenAI is not configured. Cannot improve a draft.");
  const { improvePrompt } = await import("@/lib/ai/prompts");
  return callTextModel(improvePrompt({ draftMarkdown, critiqueJson: JSON.stringify(critique, null, 2) }), false, {
    taskType: "improvement",
    riskLevel: "medium"
  });
}
