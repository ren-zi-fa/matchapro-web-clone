import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { Pool } from "pg";
import * as XLSX from "xlsx";
import { PrismaClient } from "./generated/prisma/client";

/* =========================
   Utils
========================= */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// biome-ignore lint/suspicious/noExplicitAny: Seed utility
const cleanString = (v: any): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

// biome-ignore lint/suspicious/noExplicitAny: Seed utility
const cleanNumber = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;

  let s = String(v).trim();
  s = s.replace(/\./g, ""); // Remove thousands separator
  s = s.replace(",", "."); // Comma to dot

  const n = Number(s);
  return Number.isNaN(n) ? null : n;
};

/* =========================
   Mapping Excel -> Prisma
========================= */

// biome-ignore lint/suspicious/noExplicitAny: Row mapping
const toRow = (row: any) => ({
  // biome-ignore lint/style/noNonNullAssertion: Known data structure
  idsbr: String(cleanNumber(row.idsbr)!),
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
  latitude: null,
  longitude: null,
  latlong_status: cleanString(row.latlong_status) ?? "",
});

/* =========================
   Main
========================= */

async function main() {
  console.log("Seeding users...");

  const { users: constantUsers } = require("@/shared/const/user");
  const seededUsers = [];

  // Hash passwords first
  for (const user of constantUsers) {
    const hashedPassword = await hash(user.password, 10);
    seededUsers.push({ ...user, password: hashedPassword });
  }

  // Initialize Prisma Client (Standard TCP connection)
  // Use DIRECT_URL for Supabase to avoid Transaction Pooler issues with prepared statements
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    //  connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });

  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
  });

  /* =========================
     Seed Users
  ========================= */

  const userChunkSize = 10;
  const delayMs = 100;

  for (let i = 0; i < seededUsers.length; i += userChunkSize) {
    const batch = seededUsers.slice(i, i + userChunkSize);
    await prisma.user.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(
      `Seeded users ${Math.min(i + userChunkSize, seededUsers.length)} / ${seededUsers.length}`,
    );
    await sleep(delayMs);
  }

  console.log("Users seeding completed.");

  /* =========================
     Seed Business Locations
  ========================= */

  const filePath = path.join(process.cwd(), "data-excel/data-seed.xlsx");

  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // biome-ignore lint/suspicious/noExplicitAny: External library return type
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    console.log(`Total Excel rows: ${rows.length}`);

    const cleaned = rows
      .map(toRow)
      .filter((r) => r.idsbr !== null && r.idsbr !== undefined);

    console.log(`Valid rows: ${cleaned.length}`);

    const chunkSize = 200;
    const delayBusinessMs = 200;

    for (let i = 0; i < cleaned.length; i += chunkSize) {
      const batch = cleaned.slice(i, i + chunkSize);
      await prisma.business_locations.createMany({
        data: batch,
        skipDuplicates: true,
      });
      console.log(
        `Inserted ${Math.min(i + chunkSize, cleaned.length)} / ${cleaned.length}`,
      );
      await sleep(delayBusinessMs);
    }
    console.log("Business locations seeding completed.");
  } catch (_e) {
    console.log(
      "Excel file not found or error reading, skipping business seed.",
    );
  }

  await prisma.$disconnect();
  console.log("Seed finished successfully.");
}

main().catch((err) => {
  console.error("Seed failed:");
  console.error(err);
  process.exit(1);
});
