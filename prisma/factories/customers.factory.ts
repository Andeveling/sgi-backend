import { faker } from '@faker-js/faker';

const generateUniquePhoneNumbers = (count: number) => {
  return faker.helpers.uniqueArray(
    () => `57${faker.string.numeric({ length: 10 })}`,
    count,
  );
};
const createRandomCustomer = (phoneNumber: string) => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cellphone: phoneNumber,
    identification: faker.vehicle.vin(),
  };
};

const uniquePhoneNumbers = generateUniquePhoneNumbers(20);

export const fCustomers = uniquePhoneNumbers.map((phone) =>
  createRandomCustomer(phone),
);
