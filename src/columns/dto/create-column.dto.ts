import { Board } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateColumnDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUUID()
  boardId: Board['id'];

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  position: number;
}
