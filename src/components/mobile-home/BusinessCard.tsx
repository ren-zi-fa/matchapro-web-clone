"use client";

import { CheckCircle2, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { LocationModal } from "./LocationModal";
import { TandaiModal } from "./TandaiModal";

export type BusinessData = {
  id: string;
  name: string;
  status: "Aktif" | "Nonaktif" | "Duplikat";
  address: string;
  isGC?: boolean;
  details?: {
    idsbr: string;
    kodeWilayah: string;
    kegiatanUsaha: string;
    skalaUsaha: string;
    sumberData: string;
    historyProfiling: string;
    geotagging?: string;
  };
  gcData?: {
    status: string;
    petugas: string;
    latitude: string;
    longitude: string;
  };
  initialLatitude?: string;
  initialLongitude?: string;
};

interface BusinessCardProps {
  data: BusinessData;
}

export function BusinessCard({ data }: BusinessCardProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const isGreen = data.isGC; // Green theme if Already GC (Ground Checked)

  return (
    <>
      <TandaiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        onSuccess={() => {
            mutate("/api/user/points");
            router.refresh();
        }}
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <Card
          className={cn(
            "overflow-hidden border-0 shadow-sm transition-all duration-200",
            isOpen ? "ring-1 ring-orange-200 shadow-md" : "",
          )}
        >
          <div className="flex h-full">
            {/* Left colored stripe */}
            <div
              className={cn(
                "w-1.5 shrink-0",
                isGreen ? "bg-green-500" : "bg-orange-500",
                "rounded-l-lg",
              )}
            />

            <div className="flex-1">
              <CollapsibleTrigger asChild>
                <div className="flex w-full cursor-pointer items-start justify-between p-4 bg-white hover:bg-gray-50/50">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-800 text-sm uppercase">
                        {data.name}
                      </h3>
                      {data.isGC && (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white text-[10px] h-5 px-1.5 gap-1 shadow-none">
                          <CheckCircle2 className="h-3 w-3" /> SUDAH GC
                        </Badge>
                      )}
                    </div>

                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 pointer-events-none rounded-md",
                        data.status === "Duplikat"
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-700",
                      )}
                    >
                      {data.status}
                    </Badge>

                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {data.address}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 shrink-0 -mr-2"
                  >
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4">
                  {/* Separator Line */}
                  <div className="h-px w-full bg-gray-100 mb-4" />

                  {/* Content based on type */}
                  {data.isGC && data.gcData ? (
                    <>
                      <div className="space-y-4 bg-green-50/50 rounded-xl p-4 border border-green-100">
                        <div className="flex items-center gap-2 text-green-700 font-semibold text-xs uppercase mb-2">
                          <CheckCircle2 className="h-4 w-4" /> HASIL GROUND
                          CHECK
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">
                            Status
                          </span>
                          <div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 shadow-none">
                              {data.gcData.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">
                            Petugas
                          </span>
                          <div className="font-medium text-sm text-gray-900">
                            {data.gcData.petugas}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm space-y-1">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">
                              Latitude
                            </span>
                            <div className="font-medium text-xs text-gray-900 break-all">
                              {data.gcData.latitude}
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm space-y-1">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">
                              Longitude
                            </span>
                            <div className="font-medium text-xs text-gray-900 break-all">
                              {data.gcData.longitude}
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => setIsLocationModalOpen(true)}
                          className="w-full bg-white border-green-200 text-green-700 hover:bg-green-50 h-9 text-xs font-semibold"
                        >
                          <MapPin className="h-3 w-3 mr-2" /> Lihat Lokasi GC
                        </Button>
                      </div>

                      <LocationModal
                        isOpen={isLocationModalOpen}
                        onClose={() => setIsLocationModalOpen(false)}
                        latitude={data.gcData.latitude}
                        longitude={data.gcData.longitude}
                      />
                    </>
                  ) : (
                    // Regular Details
                    <div className="space-y-4">
                      <div className="grid grid-cols-[100px_1fr] gap-y-3 text-xs">
                        <span className="text-gray-400 font-medium">
                          #IDSBR
                        </span>
                        <span className="text-gray-900 font-medium">
                          {data.details?.idsbr || "-"}
                        </span>

                        <span className="text-gray-400 font-medium">
                          Kode Wilayah
                        </span>
                        <span className="text-gray-900 font-medium">
                          {data.details?.kodeWilayah || "-"}
                        </span>

                        <span className="text-gray-400 font-medium">
                          Kegiatan Usaha
                        </span>
                        <span className="text-gray-900 font-medium leading-relaxed">
                          {data.details?.kegiatanUsaha || "-"}
                        </span>

                        <span className="text-gray-400 font-medium">
                          Skala Usaha
                        </span>
                        <span className="text-gray-900 font-medium">
                          {data.details?.skalaUsaha || "-"}
                        </span>

                        <span className="text-gray-400 font-medium">
                          Sumber Data
                        </span>
                        <span className="text-gray-900 font-medium">
                          {data.details?.sumberData || "-"}
                        </span>

                        <span className="text-gray-400 font-medium">
                          History Profiling
                        </span>
                        <div>
                          {data.details?.historyProfiling ? (
                            <Badge
                              variant="secondary"
                              className="bg-green-50 text-green-700 border border-green-100"
                            >
                              {data.details.historyProfiling}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </div>

                        <span className="text-gray-400 font-medium">
                          Geotagging
                        </span>
                        <span className="text-gray-900 font-medium">
                          {data.details?.geotagging ||
                            "Latitude: - | Longitude: -"}
                        </span>
                      </div>

                      {data.status === "Aktif" && (
                        <Button
                          onClick={() => setIsModalOpen(true)}
                          className="w-full bg-white border border-yellow-400 text-yellow-600 hover:bg-yellow-50 font-semibold h-10 shadow-sm"
                        >
                          ⚑ Tandai
                        </Button>
                      )}

                      <div className="text-center">
                        <button
                          type="button"
                          className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto"
                        >
                          Details information not available in dummy data
                        </button>
                      </div>
                    </div>
                  )}

                  {!data.isGC && (
                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        className="flex items-center text-xs text-gray-400 hover:text-gray-600"
                      >
                        <span className="mr-1">i</span> Lihat Detail Lengkap
                      </button>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </div>
        </Card>
      </Collapsible>
    </>
  );
}
