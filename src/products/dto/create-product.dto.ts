import {
  IsString,
  IsInt,
  IsOptional,
  IsPositive,
  IsDate,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  buyPrice: number;

  @IsInt()
  @IsPositive()
  sellPrice: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  expiration?: Date;

  @IsInt()
  @IsOptional()
  @Min(0)
  minStock?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  storeId?: string;
}
