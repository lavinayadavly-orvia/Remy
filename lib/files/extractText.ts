import { readFile, writeFile } from "fs/promises";
import path from "path";
import JSZip from "jszip";
import { clampText } from "@/lib/utils/sanitize";

const textLikeExtensions = new Set([".txt", ".md", ".csv", ".tsv", ".json"]);
const officeXmlExtensions = new Set([".docx", ".pptx", ".potx"]);

export async function extractText(filePath: string, projectId: string): Promise<{ text: string; extractedTextPath?: string; warning?: string }> {
  const extension = path.extname(filePath).toLowerCase();
  if (!textLikeExtensions.has(extension) && !officeXmlExtensions.has(extension)) {
    return {
      text: "",
      warning: "Text extraction is limited in Phase 1/2. File was saved and can be referenced later, but its contents were not parsed."
    };
  }

  const text = textLikeExtensions.has(extension) ? clampText(await readFile(filePath, "utf8")) : clampText(await extractOfficeXmlText(filePath, extension));
  const extractedTextPath = path.join(process.cwd(), "data", "projects", `${projectId}-${path.basename(filePath)}.txt`);
  await writeFile(extractedTextPath, text, "utf8");
  return {
    text,
    extractedTextPath,
    warning: text ? undefined : "Template was saved, but no readable text was found in the file."
  };
}

async function extractOfficeXmlText(filePath: string, extension: string): Promise<string> {
  const zip = await JSZip.loadAsync(await readFile(filePath));
  const xmlPaths =
    extension === ".docx"
      ? ["word/document.xml"]
      : Object.keys(zip.files)
          .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const chunks = await Promise.all(
    xmlPaths.map(async (xmlPath) => {
      const file = zip.file(xmlPath);
      if (!file) return "";
      return xmlToText(await file.async("string"));
    })
  );
  return chunks.filter(Boolean).join("\n\n");
}

function xmlToText(xml: string): string {
  return decodeXmlEntities(
    xml
      .replace(/<a:br\s*\/>/g, "\n")
      .replace(/<w:br\s*\/>/g, "\n")
      .replace(/<\/a:p>/g, "\n")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim()
  );
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
