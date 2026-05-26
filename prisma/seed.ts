import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  const regions = [
    "Bara",
    "Babakan Tengah",
    "Cibanteng",
    "Perwira",
    "Belakang IPB",
  ];

  for (const name of regions) {
    await prisma.region.upsert({
      where: {
        slug: slugify(name),
      },
      update: {},
      create: {
        name,
        slug: slugify(name),
      },
    });
  }

  const facilities = [
    "AC",
    "Lemari",
    "Meja Belajar",
    "Kasur",
    "Kamar Mandi Dalam",
    "Kamar Mandi Luar",
    "Water Heater",
    "Wifi",
    "Kulkas",
    "Dapur",
    "Parkir Mobil",
    "CCTV",
  ];

  for (const name of facilities) {
    await prisma.facility.upsert({
      where: {
        slug: slugify(name),
      },
      update: {},
      create: {
        name,
        slug: slugify(name),
      },
    });
  }

  const email = process.env.ADMIN_EMAIL ?? "admin@kosta.dev";
  const password = process.env.ADMIN_PASSWORD ?? "admin12345";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
    },
    create: {
      name: "Super Admin",
      email,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  const allRegions = await prisma.region.findMany();
  const allFacilities = await prisma.facility.findMany();

  const regionBySlug = new Map(
    allRegions.map((region) => [region.slug, region])
  );

  const facilityBySlug = new Map(
    allFacilities.map((facility) => [facility.slug, facility])
  );

  const kosts = [
    {
      name: "Kost Mamang Syauqi 3",
      description:
        "Kost nyaman di area Bara dengan akses mudah ke kampus dan tempat makan.",
      contactWhatsapp: "6281234567890",
      roomSize: "3m x 3m",
      distanceToCampusInMeters: 650,
      googleMapsUrl: "https://maps.google.com",
      genderType: "PUTRI" as const,
      waterFeeType: "INCLUDED" as const,
      electricityType: "TOKEN" as const,
      status: "PUBLISHED" as const,
      isFeatured: true,
      regionSlug: "bara",
      prices: [
        {
          type: "MONTHLY" as const,
          price: 850000,
        },
        {
          type: "SIX_MONTHS" as const,
          price: 4800000,
        },
        {
          type: "YEARLY" as const,
          price: 9000000,
        },
      ],
      facilitySlugs: [
        "kasur",
        "lemari",
        "meja-belajar",
        "wifi",
        "kamar-mandi-dalam",
      ],
    },
    {
      name: "Kost Papah Rafi",
      description:
        "Kost strategis dekat pusat kuliner Babakan Tengah, cocok untuk mahasiswa.",
      contactWhatsapp: "6289876543210",
      roomSize: "3m x 4m",
      distanceToCampusInMeters: 900,
      googleMapsUrl: "https://maps.google.com",
      genderType: "PUTRA" as const,
      waterFeeType: "NOT_INCLUDED" as const,
      electricityType: "SEPARATE" as const,
      status: "PUBLISHED" as const,
      isFeatured: false,
      regionSlug: "babakan-tengah",
      prices: [
        {
          type: "MONTHLY" as const,
          price: 750000,
        },
        {
          type: "YEARLY" as const,
          price: 8200000,
        },
      ],
      facilitySlugs: [
        "kasur",
        "lemari",
        "wifi",
        "dapur",
        "kamar-mandi-luar",
      ],
    },
    {
      name: "Kost Bunda Natha",
      description:
        "Kost bersih dan tenang di area Cibanteng dengan fasilitas lengkap.",
      contactWhatsapp: "6281122233344",
      roomSize: "4m x 4m",
      distanceToCampusInMeters: 1400,
      googleMapsUrl: "https://maps.google.com",
      genderType: "CAMPUR" as const,
      waterFeeType: "INCLUDED" as const,
      electricityType: "INCLUDED" as const,
      status: "PUBLISHED" as const,
      isFeatured: true,
      regionSlug: "cibanteng",
      prices: [
        {
          type: "MONTHLY" as const,
          price: 1200000,
        },
        {
          type: "SIX_MONTHS" as const,
          price: 6800000,
        },
      ],
      facilitySlugs: [
        "ac",
        "kasur",
        "lemari",
        "meja-belajar",
        "wifi",
        "kamar-mandi-dalam",
        "water-heater",
        "cctv",
      ],
    },
    {
      name: "Kost Ishana",
      description:
        "Kost sederhana dengan harga terjangkau di wilayah Perwira.",
      contactWhatsapp: "6285566677788",
      roomSize: "3m x 3m",
      distanceToCampusInMeters: 1100,
      googleMapsUrl: null,
      genderType: "PUTRA" as const,
      waterFeeType: "NOT_INCLUDED" as const,
      electricityType: "TOKEN" as const,
      status: "DRAFT" as const,
      isFeatured: false,
      regionSlug: "perwira",
      prices: [
        {
          type: "MONTHLY" as const,
          price: 650000,
        },
      ],
      facilitySlugs: ["kasur", "lemari", "parkir-mobil"],
    },
    {
      name: "Kost Abah Tana 4",
      description:
        "Kost dekat area belakang IPB, cocok untuk mahasiswa yang mencari akses cepat ke kampus.",
      contactWhatsapp: "6287711122233",
      roomSize: "3.5m x 3.5m",
      distanceToCampusInMeters: 450,
      googleMapsUrl: "https://maps.google.com",
      genderType: "PUTRI" as const,
      waterFeeType: "INCLUDED" as const,
      electricityType: "SEPARATE" as const,
      status: "PUBLISHED" as const,
      isFeatured: true,
      regionSlug: "belakang-ipb",
      prices: [
        {
          type: "MONTHLY" as const,
          price: 950000,
        },
        {
          type: "SIX_MONTHS" as const,
          price: 5400000,
        },
        {
          type: "YEARLY" as const,
          price: 10200000,
        },
      ],
      facilitySlugs: [
        "ac",
        "kasur",
        "lemari",
        "meja-belajar",
        "wifi",
        "kulkas",
        "dapur",
        "cctv",
      ],
    },
  ];

  for (const kost of kosts) {
    const region = regionBySlug.get(kost.regionSlug);

    if (!region) {
      throw new Error(`Region ${kost.regionSlug} tidak ditemukan`);
    }

    const slug = slugify(kost.name);

    await prisma.kost.upsert({
      where: {
        slug,
      },
      update: {
        name: kost.name,
        description: kost.description,
        contactWhatsapp: kost.contactWhatsapp,
        roomSize: kost.roomSize,
        distanceToCampusInMeters: kost.distanceToCampusInMeters,
        googleMapsUrl: kost.googleMapsUrl,
        genderType: kost.genderType,
        waterFeeType: kost.waterFeeType,
        electricityType: kost.electricityType,
        status: kost.status,
        isFeatured: kost.isFeatured,
        publishedAt: kost.status === "PUBLISHED" ? new Date() : null,
        regionId: region.id,

        prices: {
          deleteMany: {},
          create: kost.prices,
        },

        facilities: {
          deleteMany: {},
          create: kost.facilitySlugs
            .map((facilitySlug) => {
              const facility = facilityBySlug.get(facilitySlug);

              if (!facility) {
                throw new Error(`Facility ${facilitySlug} tidak ditemukan`);
              }

              return {
                facility: {
                  connect: {
                    id: facility.id,
                  },
                },
              };
            }),
        },
      },
      create: {
        name: kost.name,
        slug,
        description: kost.description,
        contactWhatsapp: kost.contactWhatsapp,
        roomSize: kost.roomSize,
        distanceToCampusInMeters: kost.distanceToCampusInMeters,
        googleMapsUrl: kost.googleMapsUrl,
        genderType: kost.genderType,
        waterFeeType: kost.waterFeeType,
        electricityType: kost.electricityType,
        status: kost.status,
        isFeatured: kost.isFeatured,
        publishedAt: kost.status === "PUBLISHED" ? new Date() : null,
        regionId: region.id,

        prices: {
          create: kost.prices,
        },

        facilities: {
          create: kost.facilitySlugs.map((facilitySlug) => {
            const facility = facilityBySlug.get(facilitySlug);

            if (!facility) {
              throw new Error(`Facility ${facilitySlug} tidak ditemukan`);
            }

            return {
              facility: {
                connect: {
                  id: facility.id,
                },
              },
            };
          }),
        },
      },
    });
  }

  console.log("Seed selesai.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });