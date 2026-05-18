import { NextResponse } from "next/server";
import { saveMarkdownOutput } from "@/lib/files/outputStorage";
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

    const filePath = await saveMarkdownOutput(projectId, version);
    version.generatedFiles = { ...version.generatedFiles, markdown: filePath };
    await saveProject(project);

    const fileName = `${sanitizeFilename(version.plan.title)}.md`;
    return new NextResponse(version.finalMarkdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Markdown export failure.";
    await logError({
      what_failed: `Markdown export failed: ${message}`,
      remember: "Export failures must be logged and should not create fake files."
    });
    return NextResponse.json({ error: message, errorLogUpdated: true }, { status: 500 });
  }
}
