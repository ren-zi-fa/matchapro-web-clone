import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.business_locations.count();
    return NextResponse.json({
      data,
    });
  } catch (error) {}
}
