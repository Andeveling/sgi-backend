import { faker } from '@faker-js/faker';
import {
  Customer,
  Order,
  OrderItem,
  OrderStatus,
  Store,
} from '@prisma/client';

const orderStatuses = Object.values(OrderStatus);
const getRandomOrderStatus = () => faker.helpers.arrayElement(orderStatuses);

const createRandomOrder = (storeId: Store['id'], customers: Customer[]) => {
  const totalAmount = Math.floor(
    faker.number.float({ min: 10, max: 1000, multipleOf: 0.01 }),
  );
  return {
    totalAmount,
    customerId: faker.helpers.arrayElement(customers).id,
    storeId,
    date: new Date(),
    status: getRandomOrderStatus(),
  };
};

export const createManyOrders = (
  storeId: Store['id'],
  customers: Customer[],
  count: number,
) => {
  return Array.from({ length: count }, () =>
    createRandomOrder(storeId, customers),
  );
};

interface CreateOrderItem extends Omit<OrderItem, 'id'> {}

export const createRandomOrderItem = (orders: Order[] = []): CreateOrderItem => {
  return {
    description: faker.string.alpha(20),
    price: faker.number.int({ min: 10, max: 500 }),
    quantity: faker.number.int({ min: 1, max: 20 }),
    orderId: faker.helpers.arrayElement(orders).id,
  };
};

export const createManyInvoiceItems = (
  orders: Order[],
  count: number,
): CreateOrderItem[] => {
  return Array.from({ length: count }, () => createRandomOrderItem(orders));
};
