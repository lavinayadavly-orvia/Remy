import type { OutputType } from "@/lib/ai/schemas";
import type { ConfidenceLevel, RiskLevel, Significance } from "@/lib/ai/platformRules";

export type TaskClassification = {
  task_type: string;
  significance: Significance;
  needs_approach_selection: boolean;
  needs_confirmation: boolean;
  risk_level: RiskLevel;
  output_type?: OutputType;
  likely_files_affected: string[];
  uncertainty_level: ConfidenceLevel;
  approaches: Array<{ id: string; label: string; description: string }>;
  missing_context: string[];
};

export function classifyTask(input: { command: string; outputType?: OutputType; isRevision?: boolean }): TaskClassification {
  const command = input.command.toLowerCase();
  const significant =
    input.isRevision ||
    /deck|proposal|prd|client-ready|strategy|strategic|execution plan|rewrite|architecture|materially|powerpoint|document/i.test(input.command);
  const risky = /delete|overwrite|deploy|migration|production|send email|external api|drop database|remove file/i.test(input.command);
  const missing_context: string[] = [];

  if (!input.outputType && /create|generate|prepare|write/i.test(command)) missing_context.push("output_type");
  if (!/ceo|commercial head|medical affairs|msl|investor|internal team|client procurement|regulatory/i.test(command)) {
    missing_context.push("audience");
  }

  return {
    task_type: input.isRevision ? "revision" : inferTaskType(command, input.outputType),
    significance: significant ? "significant" : "minor",
    needs_approach_selection: false,
    needs_confirmation: risky || Boolean(input.isRevision && /rewrite|restructure|change materially|replace/i.test(command)),
    risk_level: risky ? "high" : significant ? "medium" : "low",
    output_type: input.outputType,
    likely_files_affected: risky ? ["Unknown until confirmed"] : [],
    uncertainty_level: missing_context.length ? "medium" : "high",
    approaches: buildApproaches(input.outputType, command),
    missing_context
  };
}

function inferTaskType(command: string, outputType?: OutputType) {
  if (outputType) return outputType;
  if (command.includes("deck") || command.includes("powerpoint")) return "PowerPoint deck";
  if (command.includes("email")) return "Email";
  if (command.includes("prd")) return "PRD";
  if (command.includes("action plan")) return "Action plan";
  return "general_output";
}

function buildApproaches(outputType: OutputType | undefined, command: string) {
  if (outputType === "PowerPoint deck" || command.includes("deck") || command.includes("powerpoint")) {
    return [
      { id: "executive", label: "Executive boardroom draft", description: "Concise strategic story, strong slide messages, minimal detail." },
      { id: "evidence", label: "Evidence-aware version", description: "More emphasis on source caveats, assumptions, and medical governance." },
      { id: "commercial", label: "Commercial-first version", description: "Sharper business logic, adoption rationale, and next-step ask." }
    ];
  }
  return [
    { id: "fast", label: "Fast structured draft", description: "Creates a clean first version with practical assumptions flagged." },
    { id: "senior", label: "Senior review version", description: "Prioritizes logic, tone, risks, and executive flow." },
    { id: "implementation", label: "Implementation-first version", description: "Focuses on actions, ownership, dependencies, and next steps." }
  ];
}
