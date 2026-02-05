import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [provinces, regencies, districts, villages] = await Promise.all([
      prisma.business_locations.findMany({
        distinct: ['nmprov'],
        select: { nmprov: true, kdprov: true },
        where: { nmprov: { not: '' } }
      }),
      prisma.business_locations.findMany({
        distinct: ['nmkab'],
        select: { nmkab: true, kdkab: true },
        where: { nmkab: { not: '' } }
      }),
      prisma.business_locations.findMany({
        distinct: ['nmkec'],
        select: { nmkec: true, kdkec: true },
        where: { nmkec: { not: null } }
      }),
      prisma.business_locations.findMany({
        distinct: ['nmdesa'],
        select: { nmdesa: true, kddesa: true },
        where: { nmdesa: { not: null } }
      }),
    ]);

    return NextResponse.json({
      provinces: provinces.map(p => ({ label: p.nmprov, value: p.kdprov })),
      regencies: regencies.map(r => ({ label: r.nmkab, value: r.kdkab })),
      districts: districts.map(d => ({ label: d.nmkec, value: d.kdkec })),
      villages: villages.map(v => ({ label: v.nmdesa, value: v.kddesa })),
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json({ error: "Failed to fetch filter options" }, { status: 500 });
  }
}
