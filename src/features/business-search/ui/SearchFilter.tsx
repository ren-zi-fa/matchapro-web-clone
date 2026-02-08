"use client";

import {
  Briefcase,
  ChevronDown,
  Hash,
  Map as MapIcon,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface FilterOptions {
  provinces: { label: string; value: number }[];
  regencies: { label: string; value: number }[];
  districts: { label: string; value: number }[];
  villages: { label: string; value: number }[];
}

interface FilterState {
  idsbr?: string;
  nama_usaha?: string;
  alamat_usaha?: string;
  kdprov?: string;
  kdkab?: string;
  kdkec?: string;
  kddesa?: string;
  status?: string;
}

interface SearchFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export function SearchFilter({ onFilterChange }: SearchFilterProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [options, setOptions] = useState<FilterOptions>({
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
  });

  const [filters, setFilters] = useState<FilterState>({
    idsbr: "",
    nama_usaha: "",
    alamat_usaha: "",
    kdprov: "",
    kdkab: "",
    kdkec: "all",
    kddesa: "all",
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch("/api/businesses/filters");
        const data = await res.json();
        setOptions(data);

        // Auto-select standard values if only one available (common in regional dashboards)
        if (data.provinces?.length === 1)
          setFilters((f) => ({
            ...f,
            kdprov: data.provinces[0].value.toString(),
          }));
        if (data.regencies?.length === 1)
          setFilters((f) => ({
            ...f,
            kdkab: data.regencies[0].value.toString(),
          }));
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    }
    fetchOptions();
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">(
    "all",
  );

  const handleTabChange = (tab: "all" | "active" | "inactive") => {
    setActiveTab(tab);

    // Trigger filter update immediately when tab changes
    const cleanFilters: FilterState = {};
    if (filters.idsbr) cleanFilters.idsbr = filters.idsbr;
    if (filters.nama_usaha) cleanFilters.nama_usaha = filters.nama_usaha;
    if (filters.alamat_usaha) cleanFilters.alamat_usaha = filters.alamat_usaha;
    if (filters.kdprov && filters.kdprov !== "all")
      cleanFilters.kdprov = filters.kdprov;
    if (filters.kdkab && filters.kdkab !== "all")
      cleanFilters.kdkab = filters.kdkab;
    if (filters.kdkec && filters.kdkec !== "all")
      cleanFilters.kdkec = filters.kdkec;
    if (filters.kddesa && filters.kddesa !== "all")
      cleanFilters.kddesa = filters.kddesa;

    // Add status filter
    if (tab !== "all") {
      cleanFilters.status = tab;
    }

    onFilterChange(cleanFilters);
  };

  const handleApplyFilter = () => {
    const cleanFilters: FilterState = {};
    if (filters.idsbr) cleanFilters.idsbr = filters.idsbr;
    if (filters.nama_usaha) cleanFilters.nama_usaha = filters.nama_usaha;
    if (filters.alamat_usaha) cleanFilters.alamat_usaha = filters.alamat_usaha;
    if (filters.kdprov && filters.kdprov !== "all")
      cleanFilters.kdprov = filters.kdprov;
    if (filters.kdkab && filters.kdkab !== "all")
      cleanFilters.kdkab = filters.kdkab;
    if (filters.kdkec && filters.kdkec !== "all")
      cleanFilters.kdkec = filters.kdkec;
    if (filters.kddesa && filters.kddesa !== "all")
      cleanFilters.kddesa = filters.kddesa;

    if (activeTab !== "all") {
      cleanFilters.status = activeTab;
    }

    onFilterChange(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      idsbr: "",
      nama_usaha: "",
      alamat_usaha: "",
      kdprov:
        options.provinces.length === 1
          ? options.provinces[0].value.toString()
          : "",
      kdkab:
        options.regencies.length === 1
          ? options.regencies[0].value.toString()
          : "",
      kdkec: "all",
      kddesa: "all",
    });
    setActiveTab("all");
    onFilterChange({});
  };

  return (
    <div className="px-4 py-3 space-y-4">
      {/* Top Tabs */}
      <div className="flex gap-2 text-sm overflow-x-auto pb-2 scrollbar-hide">
        <Button
          variant={activeTab === "all" ? "outline" : "ghost"}
          size="sm"
          onClick={() => handleTabChange("all")}
          className={cn(
            "rounded-full font-medium px-4 h-8",
            activeTab === "all"
              ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100",
          )}
        >
          {activeTab === "all" && "✓ "}Semua
        </Button>
        <Button
          variant={activeTab === "active" ? "outline" : "ghost"}
          size="sm"
          onClick={() => handleTabChange("active")}
          className={cn(
            "rounded-full font-medium px-4 h-8",
            activeTab === "active"
              ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100",
          )}
        >
          Aktif
        </Button>
        <Button
          variant={activeTab === "inactive" ? "outline" : "ghost"}
          size="sm"
          onClick={() => handleTabChange("inactive")}
          className={cn(
            "rounded-full font-medium px-4 h-8",
            activeTab === "inactive"
              ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100",
          )}
        >
          Nonaktif
        </Button>
      </div>

      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between hover:bg-gray-50 h-14 px-4 font-semibold text-gray-900"
          >
            <span className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-orange-500" />
              Pencarian & Filter
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-400 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-6 pt-2 space-y-5">
            {/* SEARCH SECTION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Search className="h-3 w-3" /> PENCARIAN
              </div>
              <div className="w-full h-px bg-orange-200/60" />{" "}
              {/* Gold separator line */}
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Masukkan IDSBR..."
                  className="pl-9 h-11 bg-gray-50/50 border-gray-200"
                  value={filters.idsbr}
                  onChange={(e) =>
                    setFilters({ ...filters, idsbr: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama usaha..."
                  className="pl-9 h-11 bg-gray-50/50 border-gray-200"
                  value={filters.nama_usaha}
                  onChange={(e) =>
                    setFilters({ ...filters, nama_usaha: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari alamat usaha..."
                  className="pl-9 h-11 bg-gray-50/50 border-gray-200"
                  value={filters.alamat_usaha}
                  onChange={(e) =>
                    setFilters({ ...filters, alamat_usaha: e.target.value })
                  }
                />
              </div>
            </div>

            {/* REGION SECTION */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <MapIcon className="h-3 w-3" /> WILAYAH
              </div>
              <div className="w-full h-px bg-orange-200/60" />

              <div className="space-y-3">
                <div className="space-y-1">
                  <label
                    htmlFor="provinsi-select"
                    className="text-xs font-semibold text-gray-500"
                  >
                    Provinsi
                  </label>
                  <Select
                    value={filters.kdprov}
                    onValueChange={(val) => handleFilterChange("kdprov", val)}
                    disabled={options.provinces.length <= 1} // Auto-locked if single value
                  >
                    <SelectTrigger
                      id="provinsi-select"
                      className="h-11 bg-gray-50/50 border-gray-200"
                    >
                      <SelectValue placeholder="Pilih Provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.provinces.map((p) => (
                        <SelectItem
                          key={p.value}
                          value={p.value.toString()}
                        >{`[${p.value}] ${p.label}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="kabupaten-select"
                    className="text-xs font-semibold text-gray-500"
                  >
                    Kabupaten/Kota
                  </label>
                  <Select
                    value={filters.kdkab}
                    onValueChange={(val) => handleFilterChange("kdkab", val)}
                    disabled={options.regencies.length <= 1 || !filters.kdprov}
                  >
                    <SelectTrigger
                      id="kabupaten-select"
                      className="h-11 bg-gray-50/50 border-gray-200"
                    >
                      <SelectValue placeholder="Pilih Kabupaten" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.regencies.map((p) => (
                        <SelectItem key={p.value} value={p.value.toString()}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="kecamatan-select"
                      className="text-xs font-semibold text-gray-500"
                    >
                      Kecamatan
                    </label>
                    <Select
                      value={filters.kdkec}
                      onValueChange={(val) => handleFilterChange("kdkec", val)}
                      disabled={!filters.kdkab}
                    >
                      <SelectTrigger
                        id="kecamatan-select"
                        className="h-11 bg-gray-50/50 border-gray-200"
                      >
                        <SelectValue placeholder="-- All --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">-- All --</SelectItem>
                        {options.districts.map((p) => (
                          <SelectItem key={p.value} value={p.value.toString()}>
                            {p.label || `Kec ${p.value}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="desa-select"
                      className="text-xs font-semibold text-gray-500"
                    >
                      Desa/Kel
                    </label>
                    <Select
                      value={filters.kddesa}
                      onValueChange={(val) => handleFilterChange("kddesa", val)}
                      disabled={!filters.kdkec}
                    >
                      <SelectTrigger
                        id="desa-select"
                        className="h-11 bg-gray-50/50 border-gray-200"
                      >
                        <SelectValue placeholder="-- All --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">-- All --</SelectItem>
                        {options.villages.map((p) => (
                          <SelectItem
                            key={`${p.value}-${p.label}`}
                            value={p.value.toString()}
                          >
                            {p.label || `Desa ${p.value}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* ADDITIONAL FILTERS (Placeholders/Disabled since data missing) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <SlidersHorizontal className="h-3 w-3" /> FILTER LANJUTAN
              </div>
              <div className="w-full h-px bg-orange-200/60" />
              <p className="text-[10px] text-gray-400 italic">
                Filter lanjutan (Sumber Data, Skala Usaha) tidak tersedia di
                database
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleApplyFilter}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-xl shadow-orange-200 shadow-md"
              >
                <Search className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-1/3 border-gray-200 text-gray-700 h-12 rounded-xl hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
