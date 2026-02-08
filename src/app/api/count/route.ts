import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";

export async function GET(_req: NextRequest) {
  try {
    const data = await prisma.business_locations.count();
    return NextResponse.json({
      data,
    });
  } catch (_error) {}
}
