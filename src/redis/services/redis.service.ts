import { Injectable } from '@nestjs/common';
import { envs } from '@/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;

  constructor() {
    const redisHost = envs.redisHost;
    const redisPort = envs.redisPort;
    const redisUrl = `redis://${redisHost}:${redisPort}`;
    this.client = createClient({ url: redisUrl });
    this.client.connect();
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }

  // Métodos adicionales
  async delProductsCache() {
    // Eliminar el cache de todos los productos
    await this.del('products');
  }

  async delProductCacheById(productId: string) {
    // Eliminar el cache de un producto específico
    await this.del(`product_${productId}`);
  }
}
