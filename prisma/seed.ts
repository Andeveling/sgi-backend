import { faker } from '@faker-js/faker';
import {
  InvoiceStatus,
  MovementType,
  NotificationType,
  PrismaClient,
  Role,
  StatusEnum,
} from '@prisma/client';
import { hash } from 'bcrypt';
import { fCategories } from './factories/categories.factory';
import { fProducts } from './factories/products.factory';
import { fCustomers } from './factories/customers.factory';

const prisma = new PrismaClient();

console.time('seed');
async function main() {
  await prisma.$transaction(async (prisma) => {
    await prisma.notification.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.movement.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.store.deleteMany();
    await prisma.user.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.income.deleteMany();

    try {
      console.log('Seeding data 🌱');
      const admin = await prisma.user.create({
        data: {
          name: 'Andres Parra',
          email: 'andeveling@gmail.com',
          cellphone: '987654321',
          password: await hash('A123456B', 10),
          roles: [Role.ADMIN, Role.SUPER_ADMIN],
          isNew: false,
        },
      });

      // Crear usuarios
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

      // Crear cliente
      const customers = await prisma.customer.createManyAndReturn({
        data: fCustomers,
      });


      // Crear factura e ítems de factura
      await prisma.invoice.create({
        data: {
          invoiceNumber: 'INV001',
          totalAmount: 500,
          customer: { connect: { id: faker.helpers.arrayElement(customers).id } },
          store: { connect: { id: mainStore.id } },
          date: new Date(),
          status: InvoiceStatus.PENDING,
          InvoiceItem: {
            create: [
              {
                description: 'Smartphone',
                quantity: 1,
                price: 500,
              },
            ],
          },
        },
      });

      // Crear notificación
      await prisma.notification.create({
        data: {
          title: 'Stock Alert',
          message: 'Low stock for Sofa',
          type: NotificationType.WARNING,
          storeId: mainStore.id,
          userId: user1.id,
        },
      });

      // Crear gastos
      await prisma.expense.create({
        data: {
          description: 'Electricity Bill',
          amount: 100,
        },
      });

      // Crear ingresos
      await prisma.income.create({
        data: {
          description: 'Product Sale',
          amount: 500,
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
