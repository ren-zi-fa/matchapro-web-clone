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
