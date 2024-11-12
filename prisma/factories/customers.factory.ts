import { faker } from '@faker-js/faker';

const generateUniquePhoneNumbers = (count: number) => {
  return faker.helpers.uniqueArray(
    () => faker.helpers.fromRegExp(/\+57 3\d{2} \d{3} \d{4}/), // Usa el patrón de Colombia (+57 3## ### ####)
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
