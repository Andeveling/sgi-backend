import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { AllExceptionFilter } from './core/errors/all-exeption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger('Bootstrap');

  // Es un prefijo para todas las rutas
  app.setGlobalPrefix('api');
  // Validar las peticiones
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Habilitar CORS
  app.enableCors({
    origin: envs.origin,
  });

  // Filtro de excepciones
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(envs.port, () => {
    logger.log(`Application is running on port ${envs.port}`);
    logger.log(`Origin: ${envs.origin}`);
    logger.log(`url: http://localhost:${envs.port}/api`);
  });
}
bootstrap();
