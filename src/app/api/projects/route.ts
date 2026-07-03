import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, description, imageUrl, linkUrl, category } = await request.json();
  if (!title || !description || !category) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  const project = await prisma.project.create({
    data: { title, description, imageUrl: imageUrl ?? "", linkUrl: linkUrl ?? "", category },
  });
  return NextResponse.json({ project }, { status: 201 });
}
