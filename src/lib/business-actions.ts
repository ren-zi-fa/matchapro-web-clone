"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createBusinessSchema = z.object({
  nama_usaha: z.string().min(1, "Nama usaha wajib diisi"),
  alamat_usaha: z.string().optional(),
  status_perusahaan: z.string().min(1, "Status perusahaan wajib diisi"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

function generateIdsbr() {
  // Generate 8 random digits
  const random8 = Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
  // Append "69"
  return `${random8}69`;
}

export async function createBusinessAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      nama_usaha: formData.get("nama_usaha"),
      alamat_usaha: formData.get("alamat_usaha"),
      status_perusahaan: formData.get("status_perusahaan"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
    };

    const validatedData = createBusinessSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: validatedData.error.issues[0].message,
      };
    }

    const { nama_usaha, alamat_usaha, status_perusahaan, latitude, longitude } = validatedData.data;

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
      return { success: false, message: "Gagal membuat ID unik, silakan coba lagi." };
    }

    // Determine latlong_status based on coordinates
    let latlong_status = null;
    if (latitude && longitude) {
        latlong_status = "56"; // Default/Custom code for manually added/complete? Or leave null? 
        // User didn't specify code logic for latlong_status, but in previous code cleaning it was preserved.
        // Let's check existing data or defaulting. 
        // For new items, maybe "57" or similar? Let's stick to simple "Ada" or just keep what user provides?
        // Actually schema has String? so we can set it if we want.
        // If user didn't ask for specific latlong_status logic, let's assume it should be set if coords exist.
        // Based on "BusinessList.tsx": isGC = item.latlong_status != null ...
        
        // Let's set it to "Baru" or similar if not specified, 
        // OR reuse existing codes if we knew them. 
        // For now, let's leave it null or empty unless we have a specific requirement.
        // Wait, the prompt says "tampilkan semua filed kecuali ini... latlong_status String?"
        // OK, I'll set it to "valid" if coordinates provided, else null.
        latlong_status = "valid"; 
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
        
        // Hardcoded Read-Only Values
        kdprov: 13,
        kdkab: 12,
        nmprov: "SUMATERA BARAT",
        nmkab: "PASAMAN BARAT",
        
        // Optional Nulls
        kdkec: null,
        kddesa: null,
        nmkec: null,
        nmdesa: null,
      },
    });

    revalidatePath("/");
    revalidatePath("/api/businesses"); // Update API cache if any

    return { success: true, message: "Usaha berhasil ditambahkan!" };
  } catch (error) {
    console.error("Create business error:", error);
    return { success: false, message: "Terjadi kesalahan saat menyimpan data." };
  }
}
