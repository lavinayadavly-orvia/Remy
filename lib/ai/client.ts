import OpenAI from "openai";
import { buildSystemPrompt, type SystemPromptInput } from "@/lib/ai/systemPrompt";

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function callTextModel(prompt: string, jsonMode = false, systemInput: SystemPromptInput = {}): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    messages: [
      { role: "system", content: buildSystemPrompt(systemInput) },
      { role: "user", content: prompt }
    ],
    temperature: 0.35,
    response_format: jsonMode ? { type: "json_object" } : undefined
  });

  return response.choices[0]?.message?.content || "";
}
