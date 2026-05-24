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
  const regions = ["Bara", "Babakan Tengah", "Perwira"];

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

  const email = process.env.ADMIN_EMAIL ?? "admin@kostapp.local";
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