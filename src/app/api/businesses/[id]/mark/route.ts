import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    const body = await request.json();
    const { gc_status, nama_usaha, alamat_usaha, latitude, longitude } = body;

    // Validate required fields if necessary
    // For now allow partial updates, but lat/long should probably go together

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get user from DB to get ID
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
         return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updatedBusiness = await prisma.business_locations.update({
      where: { idsbr: id },
      data: {
        latlong_status: gc_status, // Mapping "Keberadaan Usaha Hasil GC" to latlong_status
        nama_usaha: nama_usaha,
        alamat_usaha: alamat_usaha,
        latitude: latitude, // raw string
        longitude: longitude, // raw string
        updatedById: user.id
      },
    });

    // Award points to the user
    await prisma.user.update({
        where: { id: user.id },
        data: {
            points: {
                increment: 1
            }
        }
    });

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
