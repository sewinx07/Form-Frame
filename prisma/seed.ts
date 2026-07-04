import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgresql://localhost:5432/postgres",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "ceo@formandframe.com" },
    update: {},
    create: {
      name: "Alice Chen",
      email: "ceo@formandframe.com",
      password: hashed,
      role: "super_user",
    },
  });
  const hashed2 = await bcrypt.hash("team123", 12);
  await prisma.user.upsert({
    where: { email: "team@formandframe.com" },
    update: {},
    create: {
      name: "Jordan Lee",
      email: "team@formandframe.com",
      password: hashed2,
      role: "team_member",
    },
  });

  const statData = [
    { label: "Projects Delivered", value: "50+", order: 0 },
    { label: "Years Experience", value: "8+", order: 1 },
    { label: "Global Partners", value: "15+", order: 2 },
    { label: "Client Satisfaction", value: "100%", order: 3 },
  ];
  await prisma.stat.deleteMany();
  for (const s of statData) {
    await prisma.stat.create({ data: s });
  }

  console.log("Seeded successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
