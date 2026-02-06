import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = `${process.env.DIRECT_URL || process.env.DATABASE_URL}`;

const pool = new Pool({ 
  connectionString,
  // Supabase transaction poolers (port 6543) often don't support prepared statements? 
  // But standard session (5432) does.
  // We'll trust default settings first, but add ssl rejectUnauthorized false just in case.
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ 
    adapter,
    log: ["query"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;