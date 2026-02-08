import { prisma } from "@/shared/lib/db";

interface MarkBusinessData {
  gc_status: string;
  nama_usaha: string;
  alamat_usaha: string;
  latitude: string;
  longitude: string;
}

export async function markBusinessAsChecked(
  businessId: string,
  data: MarkBusinessData,
  userId: string,
) {
  try {
    // Update business location
    const updatedBusiness = await prisma.business_locations.update({
      where: { idsbr: businessId },
      data: {
        latlong_status: data.gc_status,
        nama_usaha: data.nama_usaha,
        alamat_usaha: data.alamat_usaha,
        latitude: data.latitude,
        longitude: data.longitude,
        updatedById: userId,
      },
    });

    // Award points to the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: 1,
        },
      },
    });

    return updatedBusiness;
  } catch (error) {
    console.error("Error in markBusinessAsChecked:", error);
    throw new Error("Failed to mark business as checked");
  }
}
