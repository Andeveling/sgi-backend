import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class MoveColumnDto {
  @IsNotEmpty()
  @IsString()
  columnId: string; // ID de la columna a mover

  @IsNotEmpty()
  @IsString()
  targetBoardId: string; // ID del tablero destino (puede ser la misma)

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  targetPosition: number; // Nueva posición en el tablero destino
}
