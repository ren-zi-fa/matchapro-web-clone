"use server";

import { prisma } from "@/shared/lib/db";

export async function getNewBusinessesForExport() {
  const businesses = await prisma.business_locations.findMany({
    where: {
      NOT: {
        createdById: null,
      },
    },
    include: {
      createdBy: {
        select: {
          username: true,
          email: true,
        },
      },
    },
    orderBy: {
      idsbr: "desc",
    },
  });

  return businesses.map((b) => ({
    IDSBR: b.idsbr,
    "Nama Usaha": b.nama_usaha,
    "Alamat Usaha": b.alamat_usaha,
    "Ditambahkan Oleh": b.createdBy?.username || "-",
    "Email Pembuat": b.createdBy?.email || "-",
    Status: b.status_perusahaan,
  }));
}
