import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import path from "path";
import { createId } from "@/lib/utils/ids";
import type { GeneratedVersion, Project, UploadedReference } from "@/lib/ai/schemas";

const projectsRoot = path.join(process.cwd(), "data", "projects");

async function ensureProjectsRoot() {
  await mkdir(projectsRoot, { recursive: true });
}

export function getProjectPath(projectId: string): string {
  return path.join(projectsRoot, `${projectId}.json`);
}

export async function createProject(name?: string): Promise<Project> {
  await ensureProjectsRoot();
  const now = new Date().toISOString();
  const project: Project = {
    id: createId("project"),
    name: name?.trim() || "Untitled StudioRWE Project",
    createdAt: now,
    updatedAt: now,
    references: [],
    versions: []
  };
  await saveProject(project);
  return project;
}

export async function getProject(projectId: string): Promise<Project> {
  const raw = await readFile(getProjectPath(projectId), "utf8");
  return JSON.parse(raw) as Project;
}

export async function saveProject(project: Project): Promise<void> {
  await ensureProjectsRoot();
  project.updatedAt = new Date().toISOString();
  await writeFile(getProjectPath(project.id), JSON.stringify(project, null, 2), "utf8");
}

export async function listProjects(): Promise<Project[]> {
  await ensureProjectsRoot();
  const files = await readdir(projectsRoot);
  const projects = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map((file) => readFile(path.join(projectsRoot, file), "utf8").then((raw) => JSON.parse(raw) as Project))
  );
  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function addReference(projectId: string, reference: UploadedReference): Promise<Project> {
  const project = await getProject(projectId);
  project.references.unshift(reference);
  await saveProject(project);
  return project;
}

export async function setTemplate(projectId: string, template: UploadedReference): Promise<Project> {
  const project = await getProject(projectId);
  project.template = template;
  await saveProject(project);
  return project;
}

export async function addVersion(projectId: string, version: GeneratedVersion): Promise<Project> {
  const project = await getProject(projectId);
  project.versions.unshift(version);
  await saveProject(project);
  return project;
}
