import { Controller, Get, Param } from '@nestjs/common';
import { MovementsService } from '../services/movements.service';

@Controller('movements')
export class MovementsController {

    constructor(private readonly movementsService: MovementsService) {}

    @Get(":storeId")
    findAll(@Param('storeId') storeId: string) {
        return this.movementsService.findAll(storeId);
    }
}
