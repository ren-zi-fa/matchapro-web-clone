import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/shared/lib/db";
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

export const dynamic = "force-dynamic";

export default async function AdminNewBusinessesPage(props: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [total, newBusinesses] = await prisma.$transaction([
    prisma.business_locations.count({
      where: {
        NOT: {
          createdById: null,
        },
      },
    }),
    prisma.business_locations.findMany({
      where: {
        NOT: {
          createdById: null,
        },
      },
      include: {
        createdBy: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        idsbr: "desc",
      },
      skip,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto p-4 pb-20 max-w-5xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-slate-100"
            >
              <ArrowLeft />
            </Button>
          </Link>
          <CardTitle className="text-xl">
            Review Yang Ditambahkan Oleh User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IDSBR</TableHead>
                  <TableHead>Nama Usaha</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Ditambahkan Oleh</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newBusinesses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      Belum ada bisnis baru yang ditambahkan user.
                    </TableCell>
                  </TableRow>
                ) : (
                  newBusinesses.map((business) => (
                    <TableRow key={business.idsbr}>
                      <TableCell className="font-mono text-xs">
                        {business.idsbr}
                      </TableCell>
                      <TableCell className="font-medium">
                        {business.nama_usaha}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={business.alamat_usaha || ""}
                      >
                        {business.alamat_usaha || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {business.createdBy?.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {business.createdBy?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            business.status_perusahaan === "Aktif"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {business.status_perusahaan}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-center">
            <URLPagination page={page} totalPages={totalPages} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
