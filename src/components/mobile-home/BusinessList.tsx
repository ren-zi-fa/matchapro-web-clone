"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import { PaginationWithLinks } from "@/components/ui/PaginationWithLinks";
import { BusinessCard, type BusinessData } from "./BusinessCard";

interface BusinessListProps {
  // biome-ignore lint/suspicious/noExplicitAny: Complex filter state
  filters?: any;
  page: number;
  onPageChange: (page: number) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function BusinessList({
  filters,
  page,
  onPageChange,
}: BusinessListProps) {
  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Construct URL for SWR key
  const getKey = () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", "10");

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
    }
    return `/api/businesses?${params.toString()}`;
  };

  const {
    data: result,
    error,
    isLoading,
  } = useSWR(getKey(), fetcher, {
    keepPreviousData: true, // Keep showing previous page data while loading new page
  });

  useEffect(() => {
    if (result) {
      // Handle new API response format { data, meta }
      const data = result.data || [];
      setTotalPages(result.meta?.totalPages || 1);

      if (Array.isArray(data)) {
        // biome-ignore lint/suspicious/noExplicitAny: Raw data mapping
        const mappedData: BusinessData[] = data.map((item: any) => {
          // Determine GC status based on latlong_status presence AND valid coordinates
          const isGC =
            item.latlong_status != null &&
            item.latlong_status !== "" &&
            item.latitude &&
            item.longitude;

          return {
            id: item.idsbr.toString(),
            name: item.nama_usaha || "Tanpa Nama",
            // Use DB status or default to Aktif if missing
            status: (item.status_perusahaan as "Aktif" | "Nonaktif") || "Aktif",
            address: item.alamat_usaha || "Alamat tidak tersedia",
            isGC: isGC,
            details: {
              idsbr: item.idsbr.toString(),
              kodeWilayah: `${item.kdprov || ""}${item.kdkab || ""}${item.kdkec || ""}`,
              kegiatanUsaha: "-",
              skalaUsaha: "UMKM",
              sumberData: "-",
              historyProfiling: "-",
              geotagging:
                item.latitude && item.longitude
                  ? `Latitude: ${item.latitude} | Longitude: ${item.longitude}`
                  : "Latitude: - | Longitude: -",
            },
            gcData: isGC
              ? {
                  status: "Ditemukan",
                  petugas: "Petugas Lapangan",
                  latitude: item.latitude?.toString() ?? "",
                  longitude: item.longitude?.toString() ?? "",
                }
              : undefined,
            initialLatitude: item.latitude
              ? item.latitude.toString()
              : undefined,
            initialLongitude: item.longitude
              ? item.longitude.toString()
              : undefined,
          };
        });

        setBusinesses(mappedData);
      }
    }
  }, [result]);

  if (isLoading && !businesses.length) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        Memuat data usaha...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm text-red-500">
        Gagal memuat data.
      </div>
    );
  }

  if (businesses.length === 0 && !isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        Belum ada data usaha yang tersedia.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-24">
      {businesses.map((business) => (
        <BusinessCard key={business.id} data={business} />
      ))}

      {/* Pagination Controls */}
      <div className="pt-4 pb-2">
        <PaginationWithLinks
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
