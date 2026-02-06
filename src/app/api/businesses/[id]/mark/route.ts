import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    const updatedBusiness = await prisma.business_locations.update({
      where: { idsbr: id },
      data: {
        latlong_status: gc_status, // Mapping "Keberadaan Usaha Hasil GC" to latlong_status
        nama_usaha: nama_usaha,
        alamat_usaha: alamat_usaha,
        latitude: latitude, // raw string
        longitude: longitude, // raw string
      },
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
