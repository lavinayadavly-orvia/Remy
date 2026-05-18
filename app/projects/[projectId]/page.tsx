import { notFound } from "next/navigation";
import { Workbench } from "@/components/Workbench";
import { getProject } from "@/lib/files/projectStorage";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  try {
    const project = await getProject(projectId);
    return <Workbench initialProject={project} aiConfigured={Boolean(process.env.OPENAI_API_KEY)} />;
  } catch {
    notFound();
  }
}
