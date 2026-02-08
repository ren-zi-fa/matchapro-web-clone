import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ points: 0 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { points: true },
  });

  return NextResponse.json({ points: user?.points || 0 });
}
