"use client";

import type { Session } from "next-auth";
import { useState } from "react";
import { BottomNav } from "./BottomNav";
import { BusinessList } from "./BusinessList";
import { CreateBusinessModal } from "./CreateBusinessModal";
import { Header } from "./Header";
import { SearchFilter } from "./SearchFilter";
import { Stats } from "./Stats";

export function MobileHome({ session }: { session: Session | null }) {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  // biome-ignore lint/suspicious/noExplicitAny: Complex filter state
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <Header session={session} />
      <div className="flex-1 overflow-y-auto">
        <Stats />
        <SearchFilter onFilterChange={handleFilterChange} />
        <BusinessList filters={filters} page={page} onPageChange={setPage} />
        {session && (
          <CreateBusinessModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            key={modalOpen ? "open" : "closed"}
          />
        )}
      </div>
      <BottomNav onAddClick={() => setModalOpen(true)} />
    </div>
  );
}
