export const kecamatan: { key: number; label: string }[] = [
  {
    key: 10,
    label: "Sungai Beremas",
  },
  {
    key: 20,
    label: "Ranah Batahan",
  },
  {
    key: 30,
    label: "Koto Balingka",
  },
  {
    key: 40,
    label: "Sungai Aur",
  },
  {
    key: 50,
    label: "Lembah Melintang",
  },
  {
    key: 60,
    label: "Gunung Tuleh",
  },
  {
    key: 70,
    label: "Talamau",
  },
  {
    key: 80,
    label: "Pasaman",
  },
  {
    key: 90,
    label: "Luhak Nan Duo",
  },
  {
    key: 100,
    label: "Sasak Ranah Pasisie",
  },
  {
    key: 110,
    label: "Kinali",
  },
];

type Nagari = {
  nama: string;
};
export type Wilayah = {
  kecamatan: string;
  nagari: Nagari[];
};

export const wilayah: Wilayah[] = [
  {
    kecamatan: "SUNGAI BEREMAS",
    nagari: [{ nama: "AIA BANGIH" }],
  },
  {
    kecamatan: "RANAH BATAHAN",
    nagari: [
      { nama: "BATAHAN" },
      { nama: "BATAHAN BARAT" },
      { nama: "BATAHAN SELATAN" },
      { nama: "BATAHAN TENGAH" },
      { nama: "BATAHAN UTARA" },
      { nama: "DESA BARU" },
      { nama: "DESA BARU BARAT" },
    ],
  },
  {
    kecamatan: "KOTO BALINGKA",
    nagari: [
      { nama: "KOTO NAN DUO" },
      { nama: "KOTO TANGAH" },
      { nama: "KOTO TUO" },
      { nama: "PAMATANG PANJANG" },
      { nama: "PARIK" },
      { nama: "RANAH KOTO TINGGI" },
    ],
  },
  {
    kecamatan: "SUNGAI AUR",
    nagari: [
      { nama: "AUA SARUMPUN" },
      { nama: "KASIK PUTIH SUNGAI TANANG" },
      { nama: "RANAH AIR HAJI" },
      { nama: "RANAH MALINTANG" },
      { nama: "SELINGKA MUARO" },
      { nama: "SIKILANG SUNGAI AUR SELATAN" },
      { nama: "SUNGAI AUA" },
    ],
  },
  {
    kecamatan: "LEMBAH MELINTANG",
    nagari: [
      { nama: "BRASTAGI UJUNG GADING" },
      { nama: "KOTO GUNUNG UJUNG GADING" },
      { nama: "KOTO SAWAH UJUNG GADING" },
      { nama: "KUAMANG ALAI UJUNG GADING" },
      { nama: "SALIDO SAROHA UJUNG GADING" },
      { nama: "SITUAK UJUNG GADING" },
      { nama: "TALUAK AMBUN UJUNG GADING" },
      { nama: "TAMPUS DAMAI UJUNG GADING" },
      { nama: "UJUANG GADIANG" },
    ],
  },
  {
    kecamatan: "GUNUNG TULEH",
    nagari: [
      { nama: "BAHORAS" },
      { nama: "MUARO KIAWAI" },
      { nama: "MUARO KIAWAI BARAT" },
      { nama: "MUARO KIAWAI HILIR" },
      { nama: "RABI JONGGOR" },
      { nama: "SEBERANG KENAIKAN" },
      { nama: "SUNGAI MAGELANG" },
    ],
  },
  {
    kecamatan: "TALAMAU",
    nagari: [
      { nama: "KAJAI" },
      { nama: "KAJAI SELATAN" },
      { nama: "SIMPANG TIMBO ABU KAJAI" },
      { nama: "SINURUIK" },
      { nama: "SUNGAI JANIAH TALU" },
      { nama: "TABEK SIRAH TALU" },
      { nama: "TALU" },
    ],
  },
  {
    kecamatan: "PASAMAN",
    nagari: [
      { nama: "AIA GADANG" },
      { nama: "AIA GADANG BARAT" },
      { nama: "AIA GADANG TIMUR" },
      { nama: "AUA KUNIANG" },
      { nama: "LEMBAH BINUANG AUA KUNIANG" },
      { nama: "LINGKUANG AUA" },
      { nama: "LINGKUANG AUA BANDARAJO" },
      { nama: "LINGKUANG AUA BARAT" },
      { nama: "LINGKUANG AUA BARU" },
      { nama: "LINGKUANG AUA HILIA" },
      { nama: "LINGKUANG AUA JAMBAK" },
      { nama: "LINGKUANG AUA KOTO DALAM" },
      { nama: "LINGKUANG AUA TIMUR" },
      { nama: "LUBUAK LANDUA AUA KUNIANG" },
      { nama: "PINAGA AUA KUNIANG" },
      { nama: "SUKOMANANTI AUA KUNIANG" },
    ],
  },
  {
    kecamatan: "LUHAK NAN DUO",
    nagari: [
      { nama: "GIRI MAJU" },
      { nama: "JAMBAK SELATAN" },
      { nama: "KAPA" },
      { nama: "KOTO BARU" },
      { nama: "MAHA KARYA" },
      { nama: "OPHIR" },
      { nama: "PUJO RAHAYU" },
      { nama: "SARIAK" },
      { nama: "SUNGAI TALANG" },
    ],
  },
  {
    kecamatan: "SASAK RANAH PASISIE",
    nagari: [
      { nama: "MALIGI" },
      { nama: "PADANG HARAPAN" },
      { nama: "RANAH PASISIE" },
      { nama: "SASAK" },
    ],
  },
  {
    kecamatan: "KINALI",
    nagari: [
      { nama: "AMPEK KOTO" },
      { nama: "AMPEK KOTO BARAT" },
      { nama: "ANAM KOTO SELATAN" },
      { nama: "ANAM KOTO UTARA" },
      { nama: "BANCAH KARIANG" },
      { nama: "BANDUA BALAI" },
      { nama: "BUNUIK" },
      { nama: "KATIAGAN" },
      { nama: "KINALI" },
      { nama: "KOTO GADANG JAYA" },
      { nama: "LANGGAM SAIYO" },
      { nama: "LANGGAM SEPAKAT" },
      { nama: "LIMAU PURUIK" },
      { nama: "MUDIAK LABUAH" },
      { nama: "PADANG CANDUAH" },
      { nama: "SIGUNANTI" },
      { nama: "TANDIKEK" },
    ],
  },
];
