import { Board } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateColumnDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUUID()
  boardId: Board['id'];
}
