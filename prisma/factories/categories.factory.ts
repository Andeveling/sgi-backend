import { faker } from '@faker-js/faker';

const createRandomCategory = (storeId: string) => {
  const newCategory = {
    name: faker.commerce.department(),
    storeId,
  };
  return newCategory;
};


export const fCategories = (storeI: string) =>
  faker.helpers.multiple(() => createRandomCategory(storeI), { count: 20 });
