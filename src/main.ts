import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Es un prefijo para todas las rutas
  app.setGlobalPrefix('api');
  // Validar las peticiones
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(envs.port, () => {
    logger.log(`Application is running on port ${envs.port}`);
  });
}
bootstrap();
