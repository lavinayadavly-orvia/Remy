import { callTextModel, hasOpenAIKey } from "@/lib/ai/client";
import { parseJsonObject } from "@/lib/ai/json";
import { nextActionPrompt } from "@/lib/ai/prompts";
import type { NextActions } from "@/lib/ai/schemas";

export async function generateNextActions(finalMarkdown: string): Promise<NextActions> {
  if (!hasOpenAIKey()) throw new Error("OpenAI is not configured. Cannot generate next actions.");
  const raw = await callTextModel(nextActionPrompt(finalMarkdown), true, { taskType: "next_action", riskLevel: "low" });
  return parseJsonObject<NextActions>(raw);
}
