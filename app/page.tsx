import { redirect } from "next/navigation";
import { createProject } from "@/lib/files/projectStorage";

export default async function HomePage() {
  const project = await createProject("MyDesk Project");
  redirect(`/projects/${project.id}`);
}
