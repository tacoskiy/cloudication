import { PrismaClient } from "../../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱| Seeding database...");

  const sampleCount = await prisma.sample.count();

  if ( sampleCount === 0 ){
    await prisma.sample.createMany({
      data: [
        {
          content: "sample-1 - This is a test entry",
        },
        {
          content: "sample-2 - Another test entry",
        },
      ],
    });

    console.log("✅| sample seeded!");
  } else {
    console.log("ℹ️| sample already exists. skipped");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });