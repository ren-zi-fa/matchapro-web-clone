"use client";

import type { Session } from "next-auth";
import { useState } from "react";
import { BusinessList } from "@/features/business-list/ui/BusinessList";
import { UserAddedBusinessesModal } from "@/features/business-list/ui/UserAddedBusinessesModal";
import { SearchFilter } from "@/features/business-search/ui/SearchFilter";
import { Stats } from "@/features/business-stats/ui/Stats";
import { CreateBusinessModal } from "@/features/create-business/ui/CreateBusinessModal";
import { BottomNav } from "@/widgets/layout/ui/BottomNav";
import { Header } from "@/widgets/layout/ui/Header";

export function HomePage({ session }: { session: Session | null }) {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  // biome-ignore lint/suspicious/noExplicitAny: Complex filter state
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [showUserAddedModal, setShowUserAddedModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <Header session={session} />
      <div className="flex-1 overflow-y-auto">
        <Stats />
        <SearchFilter onFilterChange={handleFilterChange} />
        <BusinessList filters={filters} page={page} onPageChange={setPage} />
        {session && (
          <>
            <CreateBusinessModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              key={modalOpen ? "open" : "closed"}
            />
            <UserAddedBusinessesModal
              open={showUserAddedModal}
              onOpenChange={setShowUserAddedModal}
            />
          </>
        )}
      </div>
      <BottomNav
        onAddClick={() => setModalOpen(true)}
        onViewResults={() => setShowUserAddedModal(true)}
      />
    </div>
  );
}
