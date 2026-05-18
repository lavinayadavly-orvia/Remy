import { NextResponse } from "next/server";
import { createDocument } from "@/lib/docx/createDocument";
import { saveBinaryOutput } from "@/lib/files/outputStorage";
import { getProject, saveProject } from "@/lib/files/projectStorage";
import { logError } from "@/lib/storage/errorStore";
import { sanitizeFilename } from "@/lib/utils/sanitize";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || "";
  const versionId = searchParams.get("versionId") || "";

  if (!projectId || !versionId) {
    return NextResponse.json({ error: "projectId and versionId are required." }, { status: 400 });
  }

  try {
    const project = await getProject(projectId);
    const version = project.versions.find((item) => item.id === versionId);
    if (!version) {
      return NextResponse.json({ error: "Version not found." }, { status: 404 });
    }

    const buffer = await createDocument(version);
    const fileName = `${sanitizeFilename(version.plan.title)}.docx`;
    const filePath = await saveBinaryOutput(projectId, versionId, fileName, buffer);
    version.generatedFiles = { ...version.generatedFiles, docx: filePath };
    await saveProject(project);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown DOCX export failure.";
    await logError({
      what_failed: `DOCX export failed: ${message}`,
      remember: "Export failures must be logged and should not create fake files."
    });
    return NextResponse.json({ error: message, errorLogUpdated: true }, { status: 500 });
  }
}
