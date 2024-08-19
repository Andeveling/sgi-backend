import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(0) // Offset puede ser 0 si es necesario, dependiendo de tu lógica
  @Type(() => Number)
  public offset: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100) // Limita el máximo de resultados por página a 100
  @Type(() => Number)
  public limit: number = 5;
}
