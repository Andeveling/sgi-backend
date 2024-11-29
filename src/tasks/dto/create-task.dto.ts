import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  columnId: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  position?: number;
}
