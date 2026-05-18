import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createId } from "@/lib/utils/ids";
import { sanitizeFilename } from "@/lib/utils/sanitize";
import { extractText } from "@/lib/files/extractText";
import type { UploadedReference } from "@/lib/ai/schemas";

export async function saveUpload(projectId: string, file: File): Promise<UploadedReference> {
  const projectUploadDir = path.join(process.cwd(), "uploads", projectId);
  await mkdir(projectUploadDir, { recursive: true });

  const id = createId("file");
  const storedName = `${id}-${sanitizeFilename(file.name)}`;
  const filePath = path.join(projectUploadDir, storedName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const extracted = await extractText(filePath, projectId);
  return {
    id,
    originalName: file.name,
    storedName,
    path: filePath,
    extractedTextPath: extracted.extractedTextPath,
    extractedText: extracted.text,
    warning: extracted.warning
  };
}
