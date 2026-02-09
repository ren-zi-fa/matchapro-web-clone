"use server";

import { prisma } from "@/shared/lib/db";

interface GetMarkedLocationsParams {
  page?: number;
  limit?: number;
  query?: string;
}

export async function getAllMarkedLocations({
  page = 1,
  limit = 20,
  query = "",
}: GetMarkedLocationsParams) {
  const skip = (page - 1) * limit;

  const whereCondition = {
    latitude: { not: null },
    longitude: { not: null },
    ...(query
      ? {
          nama_usaha: {
            contains: query,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const [total, data] = await prisma.$transaction([
    prisma.business_locations.count({
      where: whereCondition,
    }),
    prisma.business_locations.findMany({
      where: whereCondition,
      include: {
        updatedBy: {
          select: {
            username: true,
            email: true,
          },
        },
        createdBy: {
            select: {
                username: true,
            }
        }
      },
      orderBy: {
        idsbr: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    data,
    metadata: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
}

export async function getAllMarkedLocationsForExport(query = "") {
  const whereCondition = {
    latitude: { not: null },
    longitude: { not: null },
    ...(query
      ? {
          nama_usaha: {
            contains: query,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const data = await prisma.business_locations.findMany({
    where: whereCondition,
    include: {
      updatedBy: {
        select: {
          username: true,
          email: true,
        },
      },
       createdBy: {
            select: {
                username: true,
            }
        }
    },
    orderBy: {
      idsbr: "desc",
    },
  });

  return data.map((item) => ({
    IDSBR: item.idsbr,
    "Nama Usaha": item.nama_usaha,
    Alamat: item.alamat_usaha || "-",
    Status: item.status_perusahaan,
    Latitude: item.latitude,
    Longitude: item.longitude,
    "Updated By": item.updatedBy?.username || item.createdBy?.username || "-",
    "Updated Email": item.updatedBy?.email || "-",
  }));
}
