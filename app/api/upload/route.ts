import { NextResponse } from "next/server";
import { addReference } from "@/lib/files/projectStorage";
import { saveUpload } from "@/lib/files/saveUpload";

export async function POST(request: Request) {
  const formData = await request.formData();
  const projectId = String(formData.get("projectId") || "");
  const file = formData.get("file");

  if (!projectId || !(file instanceof File)) {
    return NextResponse.json({ error: "projectId and file are required." }, { status: 400 });
  }

  const reference = await saveUpload(projectId, file);
  const project = await addReference(projectId, reference);
  return NextResponse.json({ reference, project });
}
