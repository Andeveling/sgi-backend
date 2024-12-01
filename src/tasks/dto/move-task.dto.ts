import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class MoveTaskDto {
  @IsNotEmpty()
  @IsString()
  taskId: string; // ID de la tarea a mover

  @IsNotEmpty()
  @IsString()
  targetColumnId: string; // Columna destino (puede ser la misma)

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  targetPosition: number; // Nueva posición en la columna destino
}
