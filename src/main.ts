import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { AllExceptionFilter } from './core/errors/all-exception.filter';
import helmet from 'helmet';
import { RedisIoAdapter } from './adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const logger = new Logger('Bootstrap');
  
  // Redis with adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Helmet para seguridad
  app.use(helmet());

  // Prefijo para todas las rutas
  app.setGlobalPrefix('api');

  // Validar las peticiones
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Pipe, Middleware y Filter, Interceptors, Guards

  // Habilitar CORS con origen específico
  app.enableCors({
    origin: envs.origin,
  });

  // Filtro de excepciones personalizado
  app.useGlobalFilters(new AllExceptionFilter());

  // Inicia la aplicación en el puerto especificado
  await app.listen(envs.port, () => {
    logger.log(`Application is running on port ${envs.port}`);
    logger.log(`Origin: ${envs.origin}`);
    logger.log(`url: http://localhost:${envs.port}/api`);
  });
}

bootstrap();
