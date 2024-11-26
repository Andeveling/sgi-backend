import { IsNotEmpty, IsUUID, IsInt } from 'class-validator';

export class MoveTaskDto {
  @IsNotEmpty()
  @IsUUID()
  taskId: string; // ID de la tarea a mover

  @IsNotEmpty()
  @IsUUID()
  targetColumnId: string; // Columna destino (puede ser la misma)

  @IsNotEmpty()
  @IsInt()
  targetPosition: number; // Nueva posición en la columna destino
}
