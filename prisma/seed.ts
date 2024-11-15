import { faker } from '@faker-js/faker';
import {
  OrderStatus,
  MovementType,
  NotificationType,
  PrismaClient,
  Role,
  StatusEnum,
} from '@prisma/client';
import { hash } from 'bcrypt';
import { fCategories } from './factories/categories.factory';
import { fCustomers } from './factories/customers.factory';
import {
  createManyInvoiceItems,
  createManyOrders,
} from './factories/orders.factory';
import { fProducts } from './factories/products.factory';

const prisma = new PrismaClient();

console.time('seed');
async function main() {
  await prisma.$transaction(async (prisma) => {
    try {
      console.log('Seeding data 🌱');
      const admin = await prisma.user.create({
        data: {
          name: 'Andres Parra',
          email: 'andeveling@gmail.com',
          cellphone: '987654321',
          password: await hash('A123456B', 10),
          roles: [Role.ADMIN, Role.SUPER_ADMIN, Role.USER],
          isNew: false,
        },
      });

      const user1 = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          cellphone: '123456789',
          password: await hash('US12345B', 10),
          roles: [Role.USER],
          isNew: false,
        },
      });

      // Crear tienda
      const mainStore = await prisma.store.create({
        data: {
          name: 'Main Store',
          description: 'Main store description',
          cellphone: '111222333',
          address: '123 Main St',
          status: StatusEnum.ACTIVE,
          users: { connect: [{ id: user1.id }, { id: admin.id }] },
        },
      });

      const categories = await prisma.category.createManyAndReturn({
        data: fCategories(mainStore.id),
      });

      const products = await prisma.product.createManyAndReturn({
        data: fProducts(categories, mainStore.id),
      });

      // Crear movimientos de inventario
      await prisma.movement.create({
        data: {
          type: MovementType.INITIAL_STOCK,
          quantity: 20,
          productId: faker.helpers.arrayElement(products).id,
        },
      });

      await prisma.movement.create({
        data: {
          type: MovementType.PURCHASE,
          quantity: 10,
          productId: faker.helpers.arrayElement(products).id,
        },
      });

      const customers = await prisma.customer.createManyAndReturn({
        data: fCustomers,
      });

      const fOrders = createManyOrders(mainStore.id, customers, 20);

      const orders = await prisma.order.createManyAndReturn({
        data: fOrders,
      });

      const fOrderItems = createManyInvoiceItems(orders, products, 200);

      const ordersItems = await prisma.orderItem.createManyAndReturn({
        data: fOrderItems,
      });

      const productOrderItem = faker.helpers.arrayElement(products);
      await prisma.order.create({
        data: {
          totalAmount: 500,
          customer: {
            connect: { id: faker.helpers.arrayElement(customers).id },
          },
          store: { connect: { id: mainStore.id } },
          date: new Date(),
          status: OrderStatus.PENDING,
          orderItems: {
            create: [
              {
                productId: productOrderItem.id,
                price: productOrderItem.sellPrice,
                quantity: 1,
              },
            ],
          },
        },
      });

      await prisma.notification.create({
        data: {
          title: 'Stock Alert',
          message: 'Low stock for Sofa',
          type: NotificationType.WARNING,
          storeId: mainStore.id,
          userId: user1.id,
        },
      });

      console.timeEnd('seed');
      console.log('Database seeded successfully!');
    } catch (error) {
      console.error(`Error during seeding: ${error}`);
      throw error;
    }
  });
}

main()
  .then(() => {
    console.log('Seeding completed successfully');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
