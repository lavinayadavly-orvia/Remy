import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { GeneratedVersion } from "@/lib/ai/schemas";

const outputsRoot = path.join(process.cwd(), "outputs");

export function getVersionOutputDir(projectId: string, versionId: string): string {
  return path.join(outputsRoot, projectId, versionId);
}

export async function saveMarkdownOutput(projectId: string, version: GeneratedVersion): Promise<string> {
  const outputDir = getVersionOutputDir(projectId, version.id);
  await mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, "final.md");
  await writeFile(filePath, version.finalMarkdown, "utf8");
  return filePath;
}

export async function saveBinaryOutput(projectId: string, versionId: string, fileName: string, buffer: Buffer): Promise<string> {
  const outputDir = getVersionOutputDir(projectId, versionId);
  await mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, fileName);
  await writeFile(filePath, buffer);
  return filePath;
}
