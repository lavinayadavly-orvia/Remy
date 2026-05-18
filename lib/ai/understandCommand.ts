import type { Audience, OutputType, Tone } from "@/lib/ai/schemas";

export type CommandUnderstanding = {
  outputType: OutputType;
  audience: Audience;
  tone: Tone;
  businessObjective: string;
  missingContext: string[];
};

export function understandCommand(command: string, selected: { outputType: OutputType; audience: Audience; tone: Tone }): CommandUnderstanding {
  return {
    outputType: selected.outputType,
    audience: selected.audience,
    tone: selected.tone,
    businessObjective: command.trim(),
    missingContext: command.trim().length < 20 ? ["Brief is short; generation will use conservative assumptions."] : []
  };
}
