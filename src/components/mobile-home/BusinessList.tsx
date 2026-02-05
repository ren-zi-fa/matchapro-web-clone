"use client";

import { useEffect, useState } from "react";
import { BusinessCard, BusinessData } from "./BusinessCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BusinessListProps {
  filters?: any;
  page: number;
  onPageChange: (page: number) => void;
}

export function BusinessList({ filters, page, onPageChange }: BusinessListProps) {
  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "10"); // Hardcoded limit as requested

        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value as string);
          });
        }

        const response = await fetch(`/api/businesses?${params.toString()}`);
        const result = await response.json();
        
        // Handle new API response format { data, meta }
        const data = result.data || []; 
        setTotalPages(result.meta?.totalPages || 1);

        if (Array.isArray(data)) {
          const mappedData: BusinessData[] = data.map((item: any) => {
             // Determine GC status based on latlong_status presence AND valid coordinates
             const isGC = item.latlong_status != null && item.latlong_status !== "" && item.latitude && item.longitude;

             return {
              id: item.idsbr.toString(),
              name: item.nama_usaha || "Tanpa Nama",
              // Use DB status or default to Aktif if missing
              status: (item.status_perusahaan as "Aktif" | "Nonaktif") || "Aktif",
              address: item.alamat_usaha || "Alamat tidak tersedia",
              isGC: isGC,
              details: {
                idsbr: item.idsbr.toString(),
                kodeWilayah: `${item.kdprov || ''}${item.kdkab || ''}${item.kdkec || ''}`,
                kegiatanUsaha: "-", 
                skalaUsaha: "UMKM", 
                sumberData: "-", 
                historyProfiling: "-",
                geotagging: (item.latitude && item.longitude)
                  ? `Latitude: ${item.latitude} | Longitude: ${item.longitude}` 
                  : "Latitude: - | Longitude: -"
              },
              gcData: isGC ? {
                status: "Ditemukan",
                petugas: "Petugas Lapangan",
                latitude: item.latitude?.toString() ?? "",
                longitude: item.longitude?.toString() ?? "",
              } : undefined,
              initialLatitude: item.latitude ? item.latitude.toString() : undefined,
              initialLongitude: item.longitude ? item.longitude.toString() : undefined
            };
          });

          setBusinesses(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch businesses", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filters, page]); // Re-fetch when page changes

  if (loading) {
    return <div className="p-8 text-center text-gray-500 text-sm">Memuat data usaha...</div>;
  }

  if (businesses.length === 0) {
     return <div className="p-8 text-center text-gray-500 text-sm">Belum ada data usaha yang tersedia.</div>;
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-24">
      {businesses.map((business) => (
        <BusinessCard key={business.id} data={business} />
      ))}

      {/* Pagination Controls */}
      <div className="pt-4 pb-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {/* Simple Page Indicator */}
            <PaginationItem>
              <span className="px-4 text-sm font-medium text-gray-600">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }} 
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
