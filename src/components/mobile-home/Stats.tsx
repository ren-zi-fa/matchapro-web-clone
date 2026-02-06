"use client";

import { LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function Stats() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/businesses/stats");
        const data = await res.json();
        if (!data.error) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

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
              Perhatikan Titik Koordinat jangan langsung Input
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
