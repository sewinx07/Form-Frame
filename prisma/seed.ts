import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
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
  console.log("Seeded successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
