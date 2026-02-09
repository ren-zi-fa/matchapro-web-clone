"use client";

import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PaginationWithLinks } from "@/shared/ui/PaginationWithLinks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MarkedLocationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // SWR Key Generator
  const getKey = () => {
    const params = new URLSearchParams({
      source: "user_marked",
      page: page.toString(),
      limit: "10",
    });

    if (debouncedSearch) {
      params.append("nama_usaha", debouncedSearch);
    }
    return `/api/businesses?${params.toString()}`;
  };

  const {
    data: result,
    error,
    isLoading,
    mutate: refresh,
  } = useSWR(getKey(), fetcher);

  const data = result?.data || [];
  const totalPages = result?.meta?.totalPages || 1;

  const refresher = () => refresh();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lokasi yang Ditandai
            </h1>
            <p className="text-gray-500">
              Daftar usaha yang telah Anda verifikasi lokasinya
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Input
                placeholder="Cari Nama Usaha..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full sm:w-[300px]"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={refresher}
                disabled={isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="whitespace-nowrap bg-gray-50/50">
                  <TableHead className="w-[100px]">IDSBR</TableHead>
                  <TableHead>Nama Usaha</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[200px]">Koordinat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        <span>Memuat data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-red-500"
                    >
                      Gagal memuat data. Silakan coba lagi.
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-gray-500"
                    >
                      Belum ada data usaha yang ditandai.
                    </TableCell>
                  </TableRow>
                ) : (
                  // biome-ignore lint/suspicious/noExplicitAny: Data structure varies
                  data.map((item: any) => (
                    <TableRow
                      key={item.idsbr}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {item.idsbr}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.nama_usaha}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px] text-gray-500">
                        {item.alamat_usaha || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            item.status_perusahaan === "Aktif"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {item.status_perusahaan}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm font-mono">
                        {item.latitude && item.longitude ? (
                          <div className="flex flex-col text-xs">
                            <span>Lat: {Number(item.latitude).toFixed(5)}</span>
                            <span>
                              Long: {Number(item.longitude).toFixed(5)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">
                            Belum ada
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-4 border-t">
              <PaginationWithLinks
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
