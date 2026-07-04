import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ stats });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { stats } = await request.json() as { stats: { id: string; label: string; value: string; order: number }[] };
  for (const s of stats) {
    await prisma.stat.update({ where: { id: s.id }, data: { value: s.value } });
  }
  const updated = await prisma.stat.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ stats: updated });
}
