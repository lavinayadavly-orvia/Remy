export const outputTypes = [
  "PowerPoint deck",
  "Word proposal",
  "Strategy memo",
  "PRD",
  "Email",
  "Codex build brief",
  "Action plan"
] as const;

export const audiences = [
  "CEO",
  "Commercial Head",
  "Medical Affairs",
  "MSL",
  "Investor",
  "Internal Team",
  "Client Procurement",
  "Regulatory Stakeholder"
] as const;

export const tones = [
  "Senior and sharp",
  "Firm but polite",
  "Executive",
  "Scientific",
  "Commercial",
  "Non-salesy"
] as const;

export type OutputType = (typeof outputTypes)[number];
export type Audience = (typeof audiences)[number];
export type Tone = (typeof tones)[number];

export type UploadedReference = {
  id: string;
  originalName: string;
  storedName: string;
  path: string;
  extractedTextPath?: string;
  extractedText?: string;
  warning?: string;
};

export type OutputPlan = {
  output_type: string;
  title: string;
  audience: string;
  objective: string;
  key_messages: string[];
  structure: string;
  sections_or_slides: Array<{
    number: number;
    type: string;
    headline: string;
    key_message: string;
    body_points: string[];
    recommended_visual?: string;
    speaker_notes?: string;
    source_note?: string;
  }>;
  assumptions: string[];
  risks: string[];
  missing_information: string[];
  next_actions: string[];
};

export type ReviewNotes = {
  summary: string;
  issues: Array<{
    area: string;
    finding: string;
    recommendation: string;
  }>;
  compliance_notes: string[];
  source_limitations: string[];
};

export type NextActions = {
  recommended_next_action: string;
  suggested_follow_up_task: string;
  required_inputs_for_next_version: string[];
};

export type GeneratedVersion = {
  id: string;
  createdAt: string;
  command: string;
  revisionCommand?: string;
  outputType: OutputType;
  audience: Audience;
  tone: Tone;
  count?: number;
  selectedApproach?: string;
  references: UploadedReference[];
  template?: UploadedReference;
  plan: OutputPlan;
  draftMarkdown: string;
  critique: ReviewNotes;
  finalMarkdown: string;
  nextActions: NextActions;
  generatedFiles?: {
    markdown?: string;
    docx?: string;
    pptx?: string;
  };
};

export type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  references: UploadedReference[];
  template?: UploadedReference;
  versions: GeneratedVersion[];
};

export type GenerateRequest = {
  projectId: string;
  command: string;
  outputType: OutputType;
  audience: Audience;
  tone: Tone;
  count?: number;
  selectedApproach?: string;
};

export type ReviseRequest = {
  projectId: string;
  versionId: string;
  revisionCommand: string;
};
