import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  columnId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  position?: number;
}
