import { appendFile, readFile, writeFile } from "fs/promises";
import path from "path";

const errorsPath = path.join(process.cwd(), "ERRORS.md");

export async function readErrors(): Promise<string> {
  try {
    return await readFile(errorsPath, "utf8");
  } catch {
    const initial = `# ERRORS.md

## Purpose
Track failed approaches so MyDesk does not repeat avoidable mistakes.

## Error Log
No errors logged yet.
`;
    await writeFile(errorsPath, initial, "utf8");
    return initial;
  }
}

export async function logError(entry: { what_failed: string; what_worked?: string; remember?: string }) {
  const line = `\n- ${new Date().toISOString()}: Failed: ${entry.what_failed}${entry.what_worked ? ` Worked: ${entry.what_worked}` : ""}${entry.remember ? ` Remember: ${entry.remember}` : ""}\n`;
  await appendFile(errorsPath, line, "utf8");
}
