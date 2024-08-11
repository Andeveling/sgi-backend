import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createRandomProduct = () => {
  const product = {
    name: faker.commerce.productName(),
    buy_price: Number(faker.commerce.price()),
    sell_price: Number(faker.commerce.price()),
    stock: faker.number.int({ min: 0, max: 100 }),
    image: faker.image.url(),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    category: faker.commerce.department(),
  };
  return product;
};

const products = faker.helpers.multiple(createRandomProduct, { count: 20 });

export const ProductSeeder = async () => {
  await prisma.product.createMany({ data: products });
};
