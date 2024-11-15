import { faker } from '@faker-js/faker';
import {
  Customer,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  Store,
} from '@prisma/client';

const createRandomInvoice = (storeId: Store['id'], customers: Customer[]) => {
  const totalAmount = Math.floor(
    faker.number.float({ min: 10, max: 1000, multipleOf: 0.01 }),
  );
  return {
    invoiceNumber: `INV${faker.string.alphanumeric({ length: 10 })}`,
    totalAmount,
    customerId: faker.helpers.arrayElement(customers).id,
    storeId,
    date: new Date(),
    status: InvoiceStatus.PENDING,
  };
};

export const createManyInvoices = (
  storeId: Store['id'],
  customers: Customer[],
  count: number,
) => {
  return Array.from({ length: count }, () =>
    createRandomInvoice(storeId, customers),
  );
};

interface CreateInvoiceItem extends Omit<InvoiceItem, 'id'> {}

export const createRandomInvoiceItem = (
  invoices: Invoice[] = [],
): CreateInvoiceItem => {
  return {
    description: faker.string.alpha(20),
    price: faker.number.int({ min: 10, max: 500 }),
    quantity: faker.number.int({ min: 1, max: 20 }),
    invoiceId: faker.helpers.arrayElement(invoices).id,
  };
};

export const createManyInvoiceItems = (
  invoices: Invoice[],
  count: number,
): CreateInvoiceItem[] => {
  return Array.from({ length: count }, () => createRandomInvoiceItem(invoices));
};
