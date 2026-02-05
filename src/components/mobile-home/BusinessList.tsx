import { BusinessCard, BusinessData } from "./BusinessCard";

const dummyData: BusinessData[] = [
  {
    id: "1",
    name: "TK NURUL ILMI",
    status: "Aktif",
    address: "JORONG KARTINI MUARA KIAWAI",
    isGC: true,
    gcData: {
      status: "Ditemukan",
      petugas: "sayyid.shabir",
      latitude: "0.212667832557970",
      longitude: "99.7727810960101",
    }
  },
  {
    id: "2",
    name: "POLINDES IDOLA F.MARION",
    status: "Aktif",
    address: "JORONG KARTINI MUARA KIAWAI",
    details: {
      idsbr: "95510676",
      kodeWilayah: "1312060001",
      kegiatanUsaha: "[Kegiatan Usaha: -, Kategori: Q, KBLI: 86102]",
      skalaUsaha: "UMKM",
      sumberData: "-",
      historyProfiling: "Pernah Profiling", 
      geotagging: "Latitude: - | Longitude: -"
    }
  },
  {
    id: "6",
    name: "COUNTER PULSA",
    status: "Duplikat",
    address: "JORONG KARTINI MUARA KIAWAI"
  },
  {
    id: "3",
    name: "TIRTA MUARO",
    status: "Aktif",
    address: "JORONG KARTINI MUARA KIAWAI"
  },
  {
    id: "4",
    name: "TOKO DUA PUTRI",
    status: "Aktif",
    address: "JORONG KARTINI MUARA KIAWAI"
  },
  {
    id: "5",
    name: "JASA SERVIS HP (NASRUN)",
    status: "Aktif",
    address: "JORONG KARTINI MUARA KIAWAI"
  },
];

export function BusinessList() {
  return (
    <div className="flex flex-col gap-3 px-4 pb-24">
      {dummyData.map((business) => (
        <BusinessCard key={business.id} data={business} />
      ))}
    </div>
  );
}
