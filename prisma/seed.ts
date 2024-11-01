import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding data 🌱 here');
  } catch (error) {
    console.log(`Error creating products: ${error}`);
  } finally {
    console.timeEnd('Seeding complete 🌱');
  }
}

main()
  .then(async () => {
    console.log('All data has been seeded successfully');
  })
  .catch(async (e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    console.timeEnd('Seeding complete 🌱');
    await prisma.$disconnect();
  });
