import { IPagination } from './pagination.interface';

export enum StatusResponse {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

// Interface base para todas las respuestas
export interface BaseResponse {
  status: StatusResponse;
  message: string;
  timestamp?: string; // Opcional, para incluir la hora de la respuesta si es necesario
}

// Respuesta para obtener todos los elementos con paginación
export interface GetAllResponse<T> extends BaseResponse {
  data: T[];
  pagination: IPagination; // Datos de paginación
}

// Respuesta para crear o actualizar un elemento
export interface PostResponse<T> extends BaseResponse {
  data: T; // El elemento creado o actualizado
}

// Respuesta para eliminar un elemento
export interface RemoveResponse extends BaseResponse {
  deleted_id: string; // ID del elemento eliminado, si es necesario
}

// Respuesta para obtener un solo elemento
export interface GetOneResponse<T> extends BaseResponse {
  data: T; // El elemento solicitado
}

// Respuesta para un error específico
export interface ErrorResponse extends BaseResponse {
  errorCode?: number; // Código de error específico
  details?: string; // Detalles adicionales sobre el error
}

// Respuesta para un update
export interface UpdateResponse<T> extends BaseResponse {
  data: T; // Datos del update
}
