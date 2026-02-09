import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { URLPagination } from "@/shared/ui/URLPagination";
import { SearchInput } from "./SearchInput";
import { ExportButton } from "./ExportButton";
import { getAllMarkedLocations } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMarkedLocationsPage(props: {
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const pageSize = 20;

  const { data, metadata } = await getAllMarkedLocations({
    page,
    limit: pageSize,
    query,
  });

  return (
    <div className="container mx-auto p-4 pb-20 max-w-6xl">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100"
                >
                  <ArrowLeft />
                </Button>
              </Link>
              <div>
                <CardTitle className="text-xl">
                  Semua Lokasi Ditandai
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Daftar usaha yang telah diverifikasi lokasinya oleh user
                </p>
              </div>
            </div>
            <ExportButton />
          </div>
          
          <div className="flex w-full">
            <SearchInput />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">IDSBR</TableHead>
                  <TableHead className="min-w-[200px]">Nama Usaha</TableHead>
                  <TableHead className="min-w-[200px]">Alamat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Koordinat</TableHead>
                  <TableHead>Updated By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      {query
                        ? "Tidak ada data yang cocok dengan pencarian."
                        : "Belum ada lokasi yang ditandai."}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow key={item.idsbr}>
                      <TableCell className="font-mono text-xs">
                        {item.idsbr}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.nama_usaha}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={item.alamat_usaha || ""}
                      >
                        {item.alamat_usaha || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status_perusahaan === "Aktif"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.status_perusahaan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        <div>Lat: {item.latitude}</div>
                        <div>Lon: {item.longitude}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">
                          {item.updatedBy?.username || item.createdBy?.username || "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.updatedBy?.email}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-center">
            <URLPagination
              page={page}
              totalPages={metadata.totalPages}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
