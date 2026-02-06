"use client";

import dynamic from "next/dynamic";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBusinessAction } from "@/lib/business-actions";

const MapPicker = dynamic(
  () => import("@/components/ui/MapPicker").then((mod) => mod.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] w-full bg-gray-100 flex items-center justify-center text-gray-400">
        Loading Map...
      </div>
    ),
  },
);

const initialState = {
  success: false,
  message: "",
};

export function CreateBusinessModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(
    createBusinessAction,
    initialState,
  );
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Close modal on success
  useEffect(() => {
    if (state.success) {
      if (open) {
        onOpenChange(false);
      }
    }
  }, [state.success, open, onOpenChange]);

  const handleSubmit = (payload: FormData) => {
    if (!latitude || !longitude) {
      toast.error("Lokasi wajib dipilih pada peta!");
      return;
    }
    formAction(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto w-[95vw] rounded-lg">
        <DialogHeader>
          <DialogTitle>Tambah Usaha Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail usaha baru di sini. ID akan digenerate otomatis.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nama Usaha */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="nama_usaha" className="text-left sm:text-right">
                Nama Usaha
              </Label>
              <Input
                id="nama_usaha"
                name="nama_usaha"
                placeholder="Contoh: Toko Maju Jaya"
                className="col-span-1 sm:col-span-3"
                required
              />
            </div>

            {/* Alamat Usaha */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="alamat_usaha" className="text-left sm:text-right">
                Alamat
              </Label>
              <Input
                id="alamat_usaha"
                name="alamat_usaha"
                placeholder="Jl. Sudirman No. 12"
                className="col-span-1 sm:col-span-3"
              />
            </div>

            {/* Status Perusahaan */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label
                htmlFor="status_perusahaan"
                className="text-left sm:text-right"
              >
                Status
              </Label>
              <div className="col-span-1 sm:col-span-3">
                <select
                  id="status_perusahaan"
                  name="status_perusahaan"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="Aktif"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Ditemukan">Tidak Ditemukan</option>
                  <option value="Tutup">Tutup</option>
                  <option value="Duplikat">Duplikat</option>
                </select>
              </div>
            </div>

            {/* Map Picker for Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
              <Label className="text-left sm:text-right mt-0 sm:mt-2">
                Lokasi
              </Label>
              <div className="col-span-1 sm:col-span-3">
                <MapPicker
                  latitude={latitude}
                  longitude={longitude}
                  onLocationSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                />
                {/* Hidden inputs to submit data */}
                <input type="hidden" name="latitude" value={latitude} />
                <input type="hidden" name="longitude" value={longitude} />
              </div>
            </div>

            {/* Kode Kecamatan */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="kdkec" className="text-left sm:text-right">
                Kode Kec
              </Label>
              <Input
                id="kdkec"
                name="kdkec"
                type="number"
                placeholder="Kode Kecamatan"
                className="col-span-1 sm:col-span-3"
              />
            </div>

            {/* Read Only Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="nmkec" className="text-left sm:text-right">
                Kecamatan
              </Label>
              <Input
                id="nmkec"
                name="nmkec"
                placeholder="Nama Kecamatan"
                className="col-span-1 sm:col-span-3"
              />
            </div>

            {/* Kode Desa */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="kddesa" className="text-left sm:text-right">
                Kode Desa
              </Label>
              <Input
                id="kddesa"
                name="kddesa"
                type="number"
                placeholder="Kode Desa"
                className="col-span-1 sm:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="nmdesa" className="text-left sm:text-right">
                Desa/Kel
              </Label>
              <Input
                id="nmdesa"
                name="nmdesa"
                placeholder="Nama Desa/Kelurahan"
                className="col-span-1 sm:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="kdprov" className="text-left sm:text-right">
                Kode Prov
              </Label>
              <Input
                id="kdprov"
                name="kdprov"
                value="13"
                className="col-span-1 sm:col-span-3 bg-gray-100"
                readOnly
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="kdkab" className="text-left sm:text-right">
                Kode Kab
              </Label>
              <Input
                id="kdkab"
                name="kdkab"
                value="12"
                className="col-span-1 sm:col-span-3 bg-gray-100"
                readOnly
              />
            </div>

            {state.message && (
              <div
                className={`text-sm ${state.success ? "text-green-600" : "text-red-600"} col-span-1 sm:col-span-4 text-center`}
              >
                {state.message}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
