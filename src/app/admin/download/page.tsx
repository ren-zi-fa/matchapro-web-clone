"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Download, Search } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce"; 

// Create a simple hook if not exists, or just use setTimeout logic inside component for simplicity first.
// I will implement a simple debounce inside component to avoid extra deps if possible, or create the hook.
// Let's create the component first.

function AdminDownloadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Initialize from URL to prevent sync issues on reload
  const initialSearch = searchParams.get("nama_usaha") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  // Custom Debounce
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync Debounce -> URL
  useEffect(() => {
    // Check if the URL needs to be updated.
    // We only update if the current URL param differs from the debounced value.
    const currentName = searchParams.get("nama_usaha") || "";
    
    if (debouncedSearch !== currentName) {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedSearch) {
            params.set("nama_usaha", debouncedSearch);
        } else {
            params.delete("nama_usaha");
        }
        params.set("page", "1"); // Reset to page 1 on search change
        router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router]); // Intentionally exclude searchParams to avoid loop, we read it inside

  // Data Fetching
  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try {
            const params = new URLSearchParams(searchParams.toString());
            params.set("limit", "10");
            
            const res = await fetch(`/api/businesses?${params.toString()}`);
            const result = await res.json();
            
            setData(result.data || []);
            setTotalPages(result.meta?.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [searchParams.toString()]); // Depend on stringified params to be stable

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Data Usaha (Admin)</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                    placeholder="Cari Nama Usaha..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/api/download" target="_blank">
                    <Download className="mr-2 h-4 w-4" />
                    Download XLSX
                </Link>
            </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>IDSBR</TableHead>
              <TableHead className="min-w-[200px]">Nama Usaha</TableHead>
              <TableHead className="min-w-[250px]">Alamat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>LatLong Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">Loading...</TableCell>
                </TableRow>
            ) : data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">No results.</TableCell>
                </TableRow>
            ) : (
                data.map((item) => (
                    <TableRow key={item.idsbr}>
                        <TableCell>{item.idsbr}</TableCell>
                        <TableCell className="font-medium">{item.nama_usaha}</TableCell>
                        <TableCell>{item.alamat_usaha}</TableCell>
                        <TableCell>{item.status_perusahaan}</TableCell>
                        <TableCell>{item.latitude || "-"}</TableCell>
                        <TableCell>{item.longitude || "-"}</TableCell>
                        <TableCell>{item.latlong_status || "-"}</TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) handlePageChange(page - 1);
                        }}
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="px-4 text-sm font-medium">Page {page} of {totalPages}</span>
                </PaginationItem>
                <PaginationItem>
                     <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) handlePageChange(page + 1);
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

export default function AdminDownloadPage() {
    return (
        <Suspense fallback={<div>Loading Page...</div>}>
            <AdminDownloadContent />
        </Suspense>
    )
}
