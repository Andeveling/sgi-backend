import { Module } from '@nestjs/common';
import { MovementsService } from './services/movements.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [],
  providers: [ MovementsService ],
  exports: [ MovementsService ]
})
export class MovementsModule {}
