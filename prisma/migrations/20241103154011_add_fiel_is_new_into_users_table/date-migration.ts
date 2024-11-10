import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.$transaction(async (tx) => {
        const products = await tx.product.findMany();
        for (const product of products) { 
            await tx.product.update({
                where: { id: product.id },
                data: {
                    minStock: product.minStock ?? 0,
                    maxStock: product.maxStock ?? 10,
                }
            })
        }
  })
}


main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());