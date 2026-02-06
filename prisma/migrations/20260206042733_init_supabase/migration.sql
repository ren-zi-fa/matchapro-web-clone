-- CreateTable
CREATE TABLE "business_locations" (
    "idsbr" TEXT NOT NULL,
    "nama_usaha" TEXT NOT NULL,
    "alamat_usaha" TEXT,
    "kdprov" INTEGER NOT NULL,
    "kdkab" INTEGER NOT NULL,
    "kdkec" INTEGER,
    "kddesa" INTEGER,
    "nmprov" TEXT NOT NULL,
    "nmkab" TEXT NOT NULL,
    "nmkec" TEXT,
    "nmdesa" TEXT,
    "status_perusahaan" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    "latlong_status" TEXT,

    CONSTRAINT "business_locations_pkey" PRIMARY KEY ("idsbr")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
