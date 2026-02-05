
import 'dotenv/config';
import { prisma } from './src/lib/db';

// const prisma = new PrismaClient(); // Removed as we import the instance

async function main() {
  console.log("Resetting latlong_status for all business locations...");
  try {
    const result = await prisma.business_locations.updateMany({
      data: {
        latlong_status: null,
      },
    });
    console.log(`Successfully updated ${result.count} records. All statuses cleared.`);
  } catch (e) {
    console.error("Error resetting data:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
