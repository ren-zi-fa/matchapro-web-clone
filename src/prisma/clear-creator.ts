import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";
import dotenv from "dotenv";
dotenv.config();
async function main() {
     const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }
   const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

    console.log("Starting to clear createdById and updatedById from business_locations...");

  const result = await prisma.business_locations.updateMany({
    data: {
      createdById: null,
      updatedById: null,
    },
  });

  console.log(`Successfully updated ${result.count} records.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
