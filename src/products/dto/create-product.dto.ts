import { IsString, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  public buy_price: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  public sell_price: number;

  @IsString()
  public description: string;

  @IsString()
  public image: string;

  @IsString()
  public category: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  public stock: number;
}
