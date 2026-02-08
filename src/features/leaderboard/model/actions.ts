"use server";

import type { Prisma } from "@/prisma/generated/prisma/client";
import { prisma } from "@/shared/lib/db";

export type LeaderboardUser = {
  id: string;
  username: string;
  points: number;
  rank: number;
};

export async function getLeaderboardData({
  page = 1,
  limit = 10,
  query = "",
}: {
  page?: number;
  limit?: number;
  query?: string;
}) {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = query
    ? {
        username: {
          contains: query,
          mode: "insensitive",
        },
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        points: true,
      },
      orderBy: {
        points: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  // Calculate rank based on global position if no query, otherwise just list
  // If query is present, rank calculation is complex without a raw query or fetching all.
  // For simplicity, we'll just return the fetched users.
  // If we want accurate global rank even with search, we'd need a more complex query.
  // Let's stick to simple pagination for now.

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    totalPages,
    currentPage: page,
    totalUsers: total,
  };
}
