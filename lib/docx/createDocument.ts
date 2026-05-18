import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { GeneratedVersion } from "@/lib/ai/schemas";

export async function createDocument(version: GeneratedVersion): Promise<Buffer> {
  const children = markdownToParagraphs(version.finalMarkdown);
  const document = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  return Packer.toBuffer(document);
}

function markdownToParagraphs(markdown: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = markdown.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }

    if (trimmed.startsWith("# ")) {
      paragraphs.push(new Paragraph({ text: stripMarkdown(trimmed.slice(2)), heading: HeadingLevel.HEADING_1 }));
      continue;
    }

    if (trimmed.startsWith("## ")) {
      paragraphs.push(new Paragraph({ text: stripMarkdown(trimmed.slice(3)), heading: HeadingLevel.HEADING_2 }));
      continue;
    }

    if (trimmed.startsWith("### ")) {
      paragraphs.push(new Paragraph({ text: stripMarkdown(trimmed.slice(4)), heading: HeadingLevel.HEADING_3 }));
      continue;
    }

    if (trimmed.startsWith("- ")) {
      paragraphs.push(new Paragraph({ text: stripMarkdown(trimmed.slice(2)), bullet: { level: 0 } }));
      continue;
    }

    paragraphs.push(new Paragraph({ children: [new TextRun(stripMarkdown(trimmed))] }));
  }

  return paragraphs;
}

function stripMarkdown(value: string): string {
  return value.replace(/\*\*(.*?)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
}
