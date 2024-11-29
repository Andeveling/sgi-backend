import { Board } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateColumnDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  boardId: Board['id'];

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  position: number;
}
