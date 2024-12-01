import { Module } from '@nestjs/common';
import { MovementsService } from './services/movements.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { MovementsController } from './controllers/movements.controller';

@Module({
  imports:[PrismaModule],
  controllers: [MovementsController],
  providers: [ MovementsService ],
  exports: [ MovementsService ]
})
export class MovementsModule {}
