import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @Get('test')
  async test() {
    return { message: 'test' };
  }

  @Patch(':id')
  async updateIsNew(@Param('id') userId: string) {
    return this.usersService.updateIsNew(userId);
  }
}
