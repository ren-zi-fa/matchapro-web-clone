-- CreateTable
CREATE TABLE "business_locations" (
    "idsbr" SERIAL NOT NULL,
    "nama_usaha" TEXT NOT NULL,
    "alamat_usaha" TEXT NOT NULL,
    "kdprov" INTEGER NOT NULL,
    "kdkab" INTEGER NOT NULL,
    "kdkec" INTEGER NOT NULL,
    "kddesa" INTEGER NOT NULL,
    "nmprov" TEXT NOT NULL,
    "nmkab" TEXT NOT NULL,
    "nmkec" TEXT NOT NULL,
    "nmdesa" TEXT NOT NULL,
    "status_perusahaan" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "latlong_status" TEXT,

    CONSTRAINT "business_locations_pkey" PRIMARY KEY ("idsbr")
);
