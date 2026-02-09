import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";
import dotenv from "dotenv";

dotenv.config();

const idsbrList = [
  "37292991",
  "37291145",
  "37287867",
  "37287563",
  "37285890",
  "37285596",
  "37283632",
  "37272073",
  "37268901",
  "37263960",
  "37263958",
  "37249173",
  "37237793",
  "37236388",
  "37235829",
  "37231218",
  "37224716",
  "37223483",
  "37222519",
  "37221139",
  "37217946",
  "37213549",
  "37210806",
  "37210559",
  "37195162"
];


async function main() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log(`Updating ${idsbrList.length} businesses...`);

  try {
    const result = await prisma.business_locations.updateMany({
      where: {
        idsbr: {
          in: idsbrList,
        },
      },
      data: {
        createdById: null,
      },
    });

    console.log(`Successfully updated ${result.count} records.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
