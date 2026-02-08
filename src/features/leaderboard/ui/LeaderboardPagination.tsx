"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PaginationWithLinks } from "@/shared/ui/PaginationWithLinks";

interface LeaderboardPaginationProps {
  page: number;
  totalPages: number;
}

export function LeaderboardPagination({
  page,
  totalPages,
}: LeaderboardPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/leaderboard?${params.toString()}`);
  };

  return (
    <PaginationWithLinks
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
