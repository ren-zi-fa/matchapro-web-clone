"use client"
import { useState } from "react";
import { Header } from "./Header";
import { Stats } from "./Stats";
import { SearchFilter } from "./SearchFilter";
import { BusinessList } from "./BusinessList";
import { BottomNav } from "./BottomNav";

export function MobileHome() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <Stats />
        <SearchFilter onFilterChange={handleFilterChange} />
        <BusinessList filters={filters} page={page} onPageChange={setPage} />
      </div>
      <BottomNav />
    </div>
  );
}
