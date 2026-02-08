"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PaginationWithLinks } from "@/shared/ui/PaginationWithLinks";

interface URLPaginationProps {
  page: number;
  totalPages: number;
}

export function URLPagination({ page, totalPages }: URLPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    // Create a new URL with the updated params, preserving the current path
    // We can use window.location.pathname if we want to be strictly generic,
    // but typically just pushing the search params to the current route is fine.
    // However, router.push with just ?params works relative to current path?
    // Safer to construct full path or use existing path.
    // Since this is a client component, we might not know the exact path easily without usePathname.
    // But we can just use the query string update if we are on the same page.

    // safe way:
    router.push(`?${params.toString()}`);
  };

  return (
    <PaginationWithLinks
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
