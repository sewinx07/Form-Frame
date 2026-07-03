import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  await prisma.contactInquiry.create({
    data: { name, email, message },
  });

  await sendContactNotification(name, email, message).catch(() => {});

  return NextResponse.json({ success: true }, { status: 201 });
}
