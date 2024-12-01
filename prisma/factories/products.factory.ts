import { faker } from '@faker-js/faker';
import { Category, Store } from '@prisma/client';

export const createRandomProduct = (
  fCategories: Array<Category>,
  storeId: string,
) => {
  const buyPrice = parseInt(faker.commerce.price({ min: 10, max: 500 }));
  const sellPrice = buyPrice / (1 - 0.2);
  const minStock = faker.number.int({ min: 1, max: 10 });
  const maxStock = faker.number.int({ min: minStock, max: minStock + 10 });

  const product = {
    name: faker.commerce.productName(),
    buyPrice,
    sellPrice,
    stock: faker.number.int({ min: 0, max: 100 }),
    minStock,
    maxStock,
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    categoryId: faker.helpers.arrayElement(fCategories).id,
    storeId,
  };
  return product;
};

export const fProducts = (categories: Array<Category>, storeId: Store['id']) =>
  faker.helpers.multiple(() => createRandomProduct(categories, storeId), {
    count: 20,
  });
