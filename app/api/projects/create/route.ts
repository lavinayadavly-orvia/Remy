import { NextResponse } from "next/server";
import { createProject } from "@/lib/files/projectStorage";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const project = await createProject(body.name);
  return NextResponse.json({ project });
}
