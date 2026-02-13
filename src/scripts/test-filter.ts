
import "dotenv/config";
import { prisma } from "@/shared/lib/db";

async function main() {
  const kdkec = 10; // Sungai Beremas
  const nmdesa = "aia bangih"; // Testing case insensitivity

  console.log(`Testing filter with kdkec=${kdkec} and nmdesa=${nmdesa}...`);

  const where = {
    kdkec: kdkec,
    nmdesa: {
      contains: nmdesa,
      mode: "insensitive" as const,
    }
  };

  const count = await prisma.business_locations.count({ where });
  console.log(`Found ${count} records matching the filter.`);

  if (count > 0) {
    const sample = await prisma.business_locations.findFirst({ where });
    console.log("Sample record:", {
      idsbr: sample?.idsbr,
      nama_usaha: sample?.nama_usaha,
      kdkec: sample?.kdkec,
      nmdesa: sample?.nmdesa
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
