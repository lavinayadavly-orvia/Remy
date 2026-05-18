import { appendFile, readFile, writeFile } from "fs/promises";
import path from "path";

const memoryPath = path.join(process.cwd(), "MEMORY.md");

export async function readMemory(): Promise<string> {
  try {
    return await readFile(memoryPath, "utf8");
  } catch {
    const initial = `# MEMORY.md

## Platform Identity
- Platform name: MyDesk
- MyDesk V1 is a private, local-first executive execution assistant for one senior healthcare/RWE/business strategy user.
- MyDesk is not a chatbot, backend utility, crude prototype, project management dashboard, or bare-minimum MVP.
- MyDesk should let the user delegate a serious business task and return to a polished downloadable output.

## Operating Rules
- No filler openings.
- Significant tasks require 2-3 approaches before execution.

## Fixed Project Facts
- Platform name: MyDesk.
- Product framing: MyDesk V1 - a private, world-class executive execution assistant for one senior healthcare/RWE/business strategy user, built cleanly so it can scale later.

## Decisions
- To be updated as decisions are made.

## Session Summaries
- To be updated when the user says session end or let's stop here.
`;
    await writeFile(memoryPath, initial, "utf8");
    return initial;
  }
}

export async function appendMemoryDecision(entry: { decision: string; why: string; rejected?: string }) {
  const line = `\n- ${new Date().toISOString().slice(0, 10)}: ${entry.decision} Why: ${entry.why}${entry.rejected ? ` Rejected: ${entry.rejected}` : ""}\n`;
  await appendFile(memoryPath, line, "utf8");
}
