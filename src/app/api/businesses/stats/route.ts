import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Group by status_perusahaan to get counts for each status
    const statusCounts = await prisma.business_locations.groupBy({
      by: ["status_perusahaan"],
      _count: {
        status_perusahaan: true,
      },
    });

    let activeCount = 0;
    let inactiveCount = 0;
    let totalCount = 0;

    statusCounts.forEach((item) => {
      const status = item.status_perusahaan?.toLowerCase().trim();
      const count = item._count.status_perusahaan;
      totalCount += count;

      // Logic: Only "aktif" is Active, everything else (Tutup, Tidak Ditemukan, Duplikat) is Nonactive
      if (status === "aktif") {
        activeCount += count;
      } else {
        inactiveCount += count;
      }
    });

    return NextResponse.json({
      total: totalCount,
      active: activeCount,
      inactive: inactiveCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
