import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";
import dotenv from "dotenv";

dotenv.config();

const idsbrList = [
  "37335575",
  "37330498",
  "37329450",
  "37323958",
  "37316054",
  "37299588",
  "37298550",
  "37292991",
  "37291145",
  "37287867",
  "37287563",
  "37285890",
  "37283632",
  "37272073",
  "37268901",
  "37263960",
  "37263958",
  "37249173",
  "37237793",

  "95511969",
  "5542734",
  "37285596",
  "37236388",
  "37235829",
  "37231218",
  "37224716",
  "37223483",
  "37222519",
  "37221139",
  "37217946",
  "37213659",
  "37213549",
  "37210806",
  "37210559",
  "37203560",
  "37195162",
  "37192555",
  "37191699",
  "37186431",
  "37185117",
  "37184007",
  "37178904",
  "37178805",
  "37172674",
  "37172115",
  "37167983",
  "37167973",
  "37167108",
  "37161097",
  "37156722",
  "37151759",
  "37150451",
  "37148764",
  "37129865",
  "37128327",
  "37120898",
  "37115303",
  "37112718",
  "37111396",
  "37109967",
  "37105439",
  "37103418",
  "37098885",
  "37097513",
  "37096229",
  "37095182",
  "37075480",
  "3131885"
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
        updatedById: "cmladwzb0001eb6ik8vwgorjh",
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
