"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
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

interface UserAddedBusinessesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UserAddedBusinessesModal({
  open,
  onOpenChange,
}: UserAddedBusinessesModalProps) {
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
    if (!open) return null; // Don't fetch if modal is closed

    const params = new URLSearchParams({
      source: "user_added",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] rounded-lg flex flex-col"
      >
        <DialogHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <DialogTitle>Hasil Tambah Usaha</DialogTitle>
              <DialogDescription>
                Daftar usaha yang ditambahkan manual
              </DialogDescription>
            </div>

            <div className="flex w-full sm:w-auto items-center gap-2">
              <Input
                placeholder="Cari Nama Usaha..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full sm:w-[200px]"
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
        </DialogHeader>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="whitespace-nowrap">
                <TableHead>IDSBR</TableHead>
                <TableHead>Nama Usaha</TableHead>
                <TableHead>Alamat</TableHead>

                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-red-500"
                  >
                    Gagal memuat data.
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    Belum ada data usaha yang ditambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                // biome-ignore lint/suspicious/noExplicitAny: Data structure varies
                data.map((item: any) => (
                  <TableRow key={item.idsbr}>
                    <TableCell className="font-medium">{item.idsbr}</TableCell>
                    <TableCell>{item.nama_usaha}</TableCell>
                    <TableCell className="truncate max-w-[150px]">
                      {item.alamat_usaha || "-"}
                    </TableCell>

                    <TableCell>{item.status_perusahaan}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <PaginationWithLinks
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
