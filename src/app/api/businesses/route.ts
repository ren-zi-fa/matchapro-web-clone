import { type NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsbr = searchParams.get("idsbr");
    const nama_usaha = searchParams.get("nama_usaha");
    const alamat_usaha = searchParams.get("alamat_usaha");
    const kdprov = searchParams.get("kdprov");
    const kdkab = searchParams.get("kdkab");
    const kdkec = searchParams.get("kdkec");
    const kddesa = searchParams.get("kddesa");
    const status_perusahaan = searchParams.get("status"); // 'active', 'inactive', or undefined/'all'
    const source = searchParams.get("source"); // 'user_added' or undefined

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: Prisma.business_locationsWhereInput = {};

    if (source === "user_added") {
      const { auth } = await import("@/auth");
      const session = await auth();
      if (!session?.user?.id) {
          return NextResponse.json({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
      }
      
      // Filter by createdById if it exists, otherwise fallback to empty or legacy
      // But user requested "bukan berdasarkan angka belakang 69"
      where.createdById = session.user.id;
    } else if (idsbr) {
      where.idsbr = idsbr;
    }

    // Standard filters (apply regardless of source, or conditionally if desired)
    // If user_added is on, we might still want to search by name/address within that subset.
    if (nama_usaha) {
      where.nama_usaha = { contains: nama_usaha, mode: "insensitive" };
    }
    if (alamat_usaha) {
      where.alamat_usaha = { contains: alamat_usaha, mode: "insensitive" };
    }
    if (kdprov) {
      where.kdprov = parseInt(kdprov, 10);
    }
    if (kdkab) {
      where.kdkab = parseInt(kdkab, 10);
    }
    if (kdkec) {
      where.kdkec = parseInt(kdkec, 10);
    }
    if (kddesa) {
      where.kddesa = parseInt(kddesa, 10);
    }

    // Status Filter Logic
    if (status_perusahaan === "active") {
      where.status_perusahaan = "Aktif";
    } else if (status_perusahaan === "inactive") {
      where.status_perusahaan = { not: "Aktif" };
    }
    // If 'all' or undefined, do nothing (fetch all)

    const [total, businesses] = await prisma.$transaction([
      prisma.business_locations.count({ where }),
      prisma.business_locations.findMany({
        take: limit,
        skip: skip,
        where,
        orderBy: {
          idsbr: "desc", // Newest first? Or default ASC? User added might be better desc
        },
      }),
    ]);

    return NextResponse.json({
      data: businesses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
