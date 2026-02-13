
import "dotenv/config";
import { prisma } from "@/shared/lib/db";

async function main() {
  console.log("Fetching distinct Kecamatan...");
  const kecamatans = await prisma.business_locations.findMany({
    distinct: ['kdkec', 'nmkec'],
    select: {
      kdkec: true,
      nmkec: true,
    },
    orderBy: {
      kdkec: 'asc',
    },
  });

  console.log("\nKecamatan in DB:");
  kecamatans.forEach(k => {
    console.log(`ID: ${k.kdkec}, Name: ${k.nmkec}`);
  });

  console.log("\nFetching distinct Desa/Nagari...");
  const desas = await prisma.business_locations.findMany({
    distinct: ['kdkec', 'nmdesa'],
    select: {
      kdkec: true,
      nmdesa: true,
    },
    orderBy: {
      nmdesa: 'asc',
    },
  });

  console.log("\nDesa in DB (Grouped by Kecamatan ID):");
  const desaByKec: Record<string, string[]> = {};
  
  desas.forEach(d => {
    const kId = d.kdkec?.toString() || 'unknown';
    if (!desaByKec[kId]) desaByKec[kId] = [];
    if (d.nmdesa) desaByKec[kId].push(d.nmdesa);
  });

  Object.entries(desaByKec).forEach(([kId, nms]) => {
    // Find kec name
    const kName = kecamatans.find(k => k.kdkec?.toString() === kId)?.nmkec || 'Unknown';
    console.log(`\nKecamatan ID ${kId} (${kName}):`);
    nms.forEach(n => console.log(`  - ${n}`));
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
