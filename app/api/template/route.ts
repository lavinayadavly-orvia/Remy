import { NextResponse } from "next/server";
import path from "path";
import { setTemplate } from "@/lib/files/projectStorage";
import { saveUpload } from "@/lib/files/saveUpload";

const templateExtensions = new Set([".ppt", ".pptx", ".potx", ".doc", ".docx"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const projectId = String(formData.get("projectId") || "");
  const file = formData.get("file");

  if (!projectId || !(file instanceof File)) {
    return NextResponse.json({ error: "projectId and file are required." }, { status: 400 });
  }

  if (!templateExtensions.has(path.extname(file.name).toLowerCase())) {
    return NextResponse.json({ error: "Template must be a Word or PowerPoint file." }, { status: 400 });
  }

  const template = await saveUpload(projectId, file);
  const project = await setTemplate(projectId, template);
  return NextResponse.json({ template, project });
}
