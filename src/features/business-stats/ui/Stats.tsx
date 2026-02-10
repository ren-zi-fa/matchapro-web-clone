"use client";

import { LayoutGrid } from "lucide-react";
import useSWR from "swr";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Stats() {
  const { data, isLoading } = useSWR("/api/businesses/stats", fetcher, {
    revalidateOnFocus: false, // User requested no refetch on focus
    revalidateOnReconnect: false, // Also disable on reconnect to be safe
    revalidateIfStale: false,
    keepPreviousData: true,
  });

  const stats = data || { total: 0, active: 0, inactive: 0 };
  const loading = isLoading;

  return (
    <div className="px-4 pt-4">
      <Card className="bg-[#FFF8F0] border-none shadow-none">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-400 text-white shadow-orange-200">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">
                Direktori Usaha
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {loading
                  ? "Memuat..."
                  : `${stats.total.toLocaleString("id-ID")}+ Usaha Terdaftar`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 hover:bg-green-100 font-medium border-0 px-2.5 py-0.5 text-[10px]"
              >
                ● Aktif:{" "}
                {loading ? "..." : stats.active.toLocaleString("id-ID")}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-700 hover:bg-red-100 font-medium border-0 px-2.5 py-0.5 text-[10px]"
              >
                ● Nonaktif:{" "}
                {loading ? "..." : stats.inactive.toLocaleString("id-ID")}
              </Badge>
            </div>
            <p className="text-xs text-yellow-500 mt-1">
              Perhatikan Titik koordinat sebelum submit
            </p>
            <p className="text-xs text-red-500 mt-1">
              jika menemukan bug (kesalahan) segera lapor ke 082383246251
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
