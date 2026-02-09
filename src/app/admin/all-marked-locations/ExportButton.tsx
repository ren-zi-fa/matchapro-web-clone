"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { getAllMarkedLocationsForExport } from "./actions";

export function ExportButton() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const handleExport = async () => {
    try {
      setLoading(true);
      const data = await getAllMarkedLocationsForExport(query);

      if (data.length === 0) {
        toast.error("Tidak ada data untuk diexport");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Lokasi Ditandai");

      // Auto-width columns
      const max_width = data.reduce((w, r) => Math.max(w, r["Nama Usaha"]?.length || 10), 10);
      worksheet["!cols"] = [
        { wch: 15 }, // IDSBR
        { wch: 30 }, // Nama Usaha
        { wch: 40 }, // Alamat
        { wch: 10 }, // Status
        { wch: 15 }, // Lat
        { wch: 15 }, // Long
        { wch: 20 }, // User
        { wch: 25 }, // Email
      ];

      XLSX.writeFile(workbook, `Marked_Locations_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Berhasil export data");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Gagal melakukan export");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExport} 
      disabled={loading}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {loading ? "Exporting..." : "Export Excel"}
    </Button>
  );
}
