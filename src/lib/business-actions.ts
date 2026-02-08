"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";

const createBusinessSchema = z.object({
  nama_usaha: z.string().min(1, "Nama usaha wajib diisi"),
  alamat_usaha: z.string().optional(),
  status_perusahaan: z.string().min(1, "Status perusahaan wajib diisi"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  nmkec: z.string().optional(),
  nmdesa: z.string().optional(),
  kdkec: z.string().optional(),
  kddesa: z.string().optional(),
  kdprov: z.string().optional(),
  kdkab: z.string().optional(),
});

function generateIdsbr() {
  // Generate 8 random digits
  const random8 = Math.floor(10000000 + Math.random() * 90000000)
    .toString()
    .substring(0, 8);
  // Append "69"
  return `${random8}69`;
}

export async function createBusinessAction(
  // biome-ignore lint/suspicious/noExplicitAny: Server Action state
  _prevState: any,
  formData: FormData,
) {
  try {
    const rawData = {
      nama_usaha: formData.get("nama_usaha"),
      alamat_usaha: formData.get("alamat_usaha"),
      status_perusahaan: formData.get("status_perusahaan"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
      nmkec: formData.get("nmkec"),
      nmdesa: formData.get("nmdesa"),
      kdkec: formData.get("kdkec"),
      kddesa: formData.get("kddesa"),
      kdprov: formData.get("kdprov"),
      kdkab: formData.get("kdkab"),
    };

    const validatedData = createBusinessSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: validatedData.error.issues[0].message,
      };
    }

    const {
      nama_usaha,
      alamat_usaha,
      status_perusahaan,
      latitude,
      longitude,
      nmkec,
      nmdesa,
      kdkec,
      kddesa,
      kdprov,
      kdkab,
    } = validatedData.data;

    // Retry loop for unique ID
    let idsbr = generateIdsbr();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const existing = await prisma.business_locations.findUnique({
        where: { idsbr },
      });
      if (!existing) {
        isUnique = true;
      } else {
        idsbr = generateIdsbr();
        attempts++;
      }
    }

    if (!isUnique) {
      return {
        success: false,
        message: "Gagal membuat ID unik, silakan coba lagi.",
      };
    }

    // Determine latlong_status based on coordinates
    let latlong_status = null;
    if (latitude && longitude) {
      latlong_status = "valid";
    }

    // Award points to the user if session exists
    // Using dynamic import or standard import
    const { auth } = await import("@/auth");
    const session = await auth();
    let userId = null;

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });
        
        if (user) {
            userId = user.id;
            await prisma.user.update({
                where: { email: session.user.email },
                data: { points: { increment: 1 } }
            });
        }
    }

    await prisma.business_locations.create({
      data: {
        idsbr,
        nama_usaha,
        alamat_usaha: alamat_usaha || null,
        status_perusahaan,
        latitude: latitude || null,
        longitude: longitude || null,
        latlong_status: latlong_status,
        createdById: userId,

        // Use parsed integer values
        kdprov: kdprov ? parseInt(kdprov, 10) : 13,
        kdkab: kdkab ? parseInt(kdkab, 10) : 12,
        nmprov: "SUMATERA BARAT",
        nmkab: "PASAMAN BARAT",

        // Optional Nulls
        kdkec: kdkec ? parseInt(kdkec, 10) : null,
        kddesa: kddesa ? parseInt(kddesa, 10) : null,
        nmkec: nmkec || null,
        nmdesa: nmdesa || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/api/businesses"); // Update API cache if any

    return { success: true, message: "Usaha berhasil ditambahkan!" };
  } catch (error) {
    console.error("Create business error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menyimpan data.",
    };
  }
}
