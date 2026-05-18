import { callTextModel, hasOpenAIKey } from "@/lib/ai/client";
import { revisePrompt } from "@/lib/ai/prompts";

export async function reviseOutput(finalMarkdown: string, revisionCommand: string): Promise<string> {
  if (!hasOpenAIKey()) throw new Error("OpenAI is not configured. Cannot revise an output.");
  return callTextModel(revisePrompt({ finalMarkdown, revisionCommand }), false, {
    userCommand: revisionCommand,
    taskType: "revision",
    riskLevel: "medium"
  });
}
