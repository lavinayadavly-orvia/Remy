import { NextResponse } from "next/server";
import { saveBinaryOutput } from "@/lib/files/outputStorage";
import { getProject, saveProject } from "@/lib/files/projectStorage";
import { createPresentation } from "@/lib/ppt/createPresentation";
import { validatePowerPointQuality } from "@/lib/ai/ruleChecks";
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

    const qualityCheck = validatePowerPointQuality(version.plan, version.finalMarkdown, {
      hasReferences: version.references.length > 0,
      command: version.command
    });
    if (!qualityCheck.ok) {
      await logError({
        what_failed: `PPTX export quality gate failed: ${qualityCheck.failures.join(", ")}`,
        what_worked: "Blocked PPTX export before producing a sloppy deck.",
        remember: "Do not export PowerPoint files that fail MyDesk deck quality rules."
      });
      return NextResponse.json(
        { error: "Output quality check failed. Please regenerate or provide reference materials.", failures: qualityCheck.failures },
        { status: 422 }
      );
    }

    const buffer = await createPresentation(version);
    const fileName = `${sanitizeFilename(version.plan.title)}.pptx`;
    const filePath = await saveBinaryOutput(projectId, versionId, fileName, buffer);
    version.generatedFiles = { ...version.generatedFiles, pptx: filePath };
    await saveProject(project);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${fileName}"`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown PPTX export failure.";
    await logError({
      what_failed: `PPTX export failed: ${message}`,
      remember: "Export failures must be logged and should not create fake files."
    });
    return NextResponse.json({ error: message, errorLogUpdated: true }, { status: 500 });
  }
}
