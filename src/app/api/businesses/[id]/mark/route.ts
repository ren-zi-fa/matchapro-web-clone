import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { markBusinessAsChecked } from "@/features/mark-business";
import { prisma } from "@/shared/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    const body = await request.json();
    const { gc_status, nama_usaha, alamat_usaha, latitude, longitude } = body;

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from DB to get ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedBusiness = await markBusinessAsChecked(
      id,
      {
        gc_status,
        nama_usaha,
        alamat_usaha,
        latitude,
        longitude,
      },
      user.id,
    );

    return NextResponse.json({
      success: true,
      data: updatedBusiness,
    });
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json(
      { error: "Failed to update business data" },
      { status: 500 },
    );
  }
}
