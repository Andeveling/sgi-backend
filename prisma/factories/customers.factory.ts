import { faker } from '@faker-js/faker';

const createRandomCustomer = () => {
  const customer = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cellphone: faker.helpers.fromRegExp(/\+1-\d{3}-\d{3}-\d{4}/),
    identification: faker.vehicle.vin(),
  };
  return customer;
};

export const fCustomers = faker.helpers.multiple(createRandomCustomer, { count: 20 });
