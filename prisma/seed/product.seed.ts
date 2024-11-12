// import { faker } from '@faker-js/faker';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const createRandomProduct = () => {
//   const product = {
//     name: faker.commerce.productName(),
//     buyPrice: Number(faker.commerce.price()),
//     sellPrice: Number(faker.commerce.price()),
//     stock: faker.number.int({ min: 0, max: 100 }),
//     minStock: faker.number.int({ min: 1, max: 10 }),
//     maxStock: faker.number.int({ min: 10, max: 30 }),
//     image: faker.image.url(),
//     description: faker.lorem.paragraph({ min: 1, max: 3 }),
//   };
//   return product;
// };

// const products = faker.helpers.multiple(createRandomProduct, { count: 20 });

// export const ProductSeeder = async () => {
//   await prisma.product.createMany({
//     data: products,
//   });
// };
