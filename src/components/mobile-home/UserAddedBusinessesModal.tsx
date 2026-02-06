"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";

interface UserAddedBusinessesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserAddedBusinessesModal({ open, onOpenChange }: UserAddedBusinessesModalProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
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

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, page, refreshKey, debouncedSearch]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        source: 'user_added',
        page: page.toString(),
        limit: '10'
      });
      
      if (debouncedSearch) {
          params.append("nama_usaha", debouncedSearch);
      }

      const res = await fetch(`/api/businesses?${params.toString()}`);
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        setTotalPages(json.meta.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch user added businesses", error);
    } finally {
      setLoading(false);
    }
  };

  const refresher = () => setRefreshKey(prev => prev + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] rounded-lg flex flex-col">
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
                 <Button variant="ghost" size="icon" onClick={refresher} disabled={loading} className="shrink-0">
                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Belum ada data usaha yang ditambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.idsbr}>
                    <TableCell className="font-medium">{item.idsbr}</TableCell>
                    <TableCell>{item.nama_usaha}</TableCell>
                    <TableCell className="truncate max-w-[150px]">{item.alamat_usaha || "-"}</TableCell>
                  
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
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 1) setPage(page - 1);
                                }}
                                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="px-4 text-sm font-medium">
                                Page {page} of {totalPages}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page < totalPages) setPage(page + 1);
                                }}
                                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
             </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
