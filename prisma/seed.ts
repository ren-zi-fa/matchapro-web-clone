import * as XLSX from "xlsx";
import path from "path";
import { prisma } from "@/lib/db";

/* =========================
   Helper normalisasi data
========================= */

const cleanString = (v: any): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

const cleanNumber = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;

  let s = String(v).trim();

  // hapus pemisah ribuan Indonesia: 2.027.422 → 2027422
  s = s.replace(/\./g, "");

  // ubah koma desimal jadi titik: 12,5 → 12.5
  s = s.replace(",", ".");

  const n = Number(s);
  return Number.isNaN(n) ? null : n;
};

/* =========================
   Mapping Excel → Prisma
========================= */

const toRow = (row: any) => ({
  idsbr: cleanNumber(row.idsbr)!, // primary key wajib ada

  nama_usaha: cleanString(row.nama_usaha) ?? "",

  alamat_usaha: cleanString(row.alamat_usaha),

  kdprov: cleanNumber(row.kdprov) ?? 0,
  kdkab: cleanNumber(row.kdkab) ?? 0,
  kdkec: cleanNumber(row.kdkec),
  kddesa: cleanNumber(row.kddesa),

  nmprov: cleanString(row.nmprov) ?? "",
  nmkab: cleanString(row.nmkab) ?? "",
  nmkec: cleanString(row.nmkec),
  nmdesa: cleanString(row.nmdesa),

  status_perusahaan: cleanString(row.status_perusahaan) ?? "",

  // Gunakan raw string untuk koordinat agar format seperti "2.027.422" tidak berubah
  latitude: null, // row.latitude ? String(row.latitude) : null,
  longitude: null, // row.longitude ? String(row.longitude) : null,

  latlong_status: cleanString(row.latlong_status) ?? "",
});

/* =========================
   Main seed process
========================= */

async function main() {
  const filePath = path.join(process.cwd(), "data-excel/data-seed.xlsx");

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

  console.log(`Total baris Excel: ${rows.length}`);

  const cleaned = rows
    .map(toRow)
    .filter((r) => r.idsbr !== null && r.idsbr !== undefined);

  console.log(`Baris valid setelah cleaning: ${cleaned.length}`);

  const chunkSize = 1000;

  for (let i = 0; i < cleaned.length; i += chunkSize) {
    const batch = cleaned.slice(i, i + chunkSize);

    await prisma.business_locations.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(
      `Inserted ${Math.min(i + chunkSize, cleaned.length)} / ${cleaned.length}`,
    );
  }

  console.log("Seed selesai. Database kini sinkron dengan realitas Excel.");
}

main()
  .catch((err) => {
    console.error("Seed gagal:");
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
