import { NextResponse } from "next/server";
import { loginUser, getSession, destroySession } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const session = await loginUser(email, password);
  if (!session) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  return NextResponse.json({ user: session });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: session });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ success: true });
}
