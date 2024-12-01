import {
  EventsGateway,
  SingleProductDataNotification,
} from '@/events/events.gateway';
import { PrismaService } from '@/prisma/services/prisma.service';
import { RedisService } from '@/redis/services/redis.service';
import { Injectable } from '@nestjs/common';
import { MovementType, Prisma, Product } from '@prisma/client';
import { ErrorHandler } from 'src/core/errors/error.handler';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { MovementsService } from '../../movements/services/movements.service';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly PRODUCTS_KEY = 'products';
  private readonly CACHE_TTL = 3600;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly movementsService: MovementsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // Crear un producto
  public async createProduct(createProductDto: CreateProductDto) {
    const {
      storeId,
      name,
      buyPrice,
      sellPrice,
      stock,
      description,
      expiration,
      minStock,
      maxStock,
      categoryId,
    } = createProductDto;

    try {
      // Verificar existencia de tienda y categoría
      const storeExists = await this.prisma.store.findUnique({
        where: { id: storeId },
      });
      if (!storeExists) {
        ErrorHandler.notFound(`Store with ID ${storeId} not found`);
      }
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        ErrorHandler.notFound(`Category with ID ${categoryId} not found`);
      }

      // Transacción para crear producto y movimiento inicial
      await this.prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            name,
            buyPrice,
            sellPrice,
            stock,
            description,
            expiration,
            minStock,
            categoryId,
            maxStock,
            storeId,
          },
        });

        if (!product) {
          ErrorHandler.createSignatureError('The product could not be created');
        }

        // Crear el movimiento de stock inicial
        await this.movementsService.createInitialStockMovementInTransaction(
          tx,
          product.id,
          product.stock,
          storeId
        );

        // Eliminar la caché de productos y productos específicos
        await this.redis.delProductsCache();

        return product;
      });

      return { message: 'Product created successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los productos con caché
  public async findAllProducts(): Promise<Product[]> {
    try {
      const cachedProducts = await this.redis.get(this.PRODUCTS_KEY);
      if (cachedProducts) {
        return JSON.parse(cachedProducts);
      }

      const products = await this.prisma.product.findMany({
        include: {
          category: true,
          store: true,
        },
      });

      await this.redis.set(
        this.PRODUCTS_KEY,
        JSON.stringify(products),
        this.CACHE_TTL,
      );
      return products;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un producto por ID con caché
  public async findOneProduct(id: Product['id']): Promise<Product> {
    try {
      const cachedProduct = await this.redis.get(`product_${id}`);
      if (cachedProduct) {
        return JSON.parse(cachedProduct);
      }

      const product = await this.prisma.product.findUnique({
        where: { id: id },
        include: {
          category: true,
          store: true,
        },
      });

      if (!product) {
        ErrorHandler.notFound('No product found');
      }

      // Cachear el producto individualmente
      await this.redis.set(
        `product_${id}`,
        JSON.stringify(product),
        this.CACHE_TTL,
      );

      return product;
    } catch (error) {
      throw error;
    }
  }

  public async updateProduct(
    id: Product['id'],
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      // Verificamos si el producto existe
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!existingProduct) {
        ErrorHandler.notFound(`Product with ID ${id} not found`);
      }

      // Actualizamos el producto con los datos proporcionados
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      // Opcional: Aquí podrías actualizar la caché si es necesario
      const cachedProducts = await this.redis.get(this.PRODUCTS_KEY);
      if (cachedProducts) {
        const products: Product[] = JSON.parse(cachedProducts);
        const productIndex = products.findIndex((product) => product.id === id);
        if (productIndex !== -1) {
          products[productIndex] = updatedProduct;
          await this.redis.set(
            this.PRODUCTS_KEY,
            JSON.stringify(products),
            this.CACHE_TTL,
          );
        }
      }

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  public async removeProduct(id: Product['id']): Promise<Product> {
    try {
      // Verificamos si el producto existe
      const productToDelete = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!productToDelete) {
        ErrorHandler.notFound(`Product with ID ${id} not found`);
      }

      // Eliminamos el producto de la base de datos
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });

      // Opcional: Aquí podrías eliminar el producto de la caché
      const cachedProducts = await this.redis.get(this.PRODUCTS_KEY);
      if (cachedProducts) {
        let products: Product[] = JSON.parse(cachedProducts);
        products = products.filter((product) => product.id !== id);
        await this.redis.set(
          this.PRODUCTS_KEY,
          JSON.stringify(products),
          this.CACHE_TTL,
        );
      }

      return deletedProduct;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar el stock de un producto y manejar la caché
  public async updateProductStock(
    tx: Prisma.TransactionClient,
    productId: string,
    quantity: number,
    type: MovementType,
  ) {
    const currentProduct = await tx.product.findUnique({
      where: { id: productId },
      select: { stock: true, name: true },
    });

    if (!currentProduct) {
      ErrorHandler.notFound(`Product with ID ${productId} not found`);
    }

    const isStockIncrease =
      type === MovementType.INITIAL_STOCK || type === MovementType.PURCHASE;

    if (!isStockIncrease && currentProduct.stock < quantity) {
      ErrorHandler.createSignatureError(
        `Insufficient stock for product ${currentProduct.name}`,
      );
    }

    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        stock: isStockIncrease
          ? { increment: quantity }
          : { decrement: quantity },
      },
    });

    // Actualizamos la caché del producto específico
    const dataProduct: SingleProductDataNotification = {
      productId,
      newStock: updatedProduct.stock,
    };
    await this.redis.delProductCacheById(productId);

    // Emitir evento
    this.eventsGateway.server.emit('productStockUpdated', dataProduct);

    return updatedProduct;
  }
}
