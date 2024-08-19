import {
  IsString,
  IsNumber,
  IsPositive,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

// id          String    @id @default(uuid())
// name        String
// buy_price   Int
// sell_price  Int
// stock       Int       @default(0)
// description String?   @db.VarChar(500)
// image       String
// available   Boolean   @default(true)
// category_id String?
// category    Category? @relation(fields: [category_id], references: [id])
// createdAt   DateTime  @default(now())
// updatedAt   DateTime  @updatedAt

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
  @IsOptional()
  public description: string;

  @IsString()
  public image: string;

  @IsString()
  @IsOptional()
  public category_id?: string | null;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  public stock: number;
}
