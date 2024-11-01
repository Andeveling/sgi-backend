import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  private defaultMessage = 'Something went wrong';

  public catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      let message: string | string[] = exception.message;

      // Manejo específico para errores de validación
      if (
        exception instanceof BadRequestException &&
        this.isValidationError(exception)
      ) {
        const validationErrors = (exception.getResponse() as any).message;
        message = Array.isArray(validationErrors)
          ? validationErrors
          : [message];
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    } else if (this.isHttpError(exception)) {
      // Manejar errores que no son HttpException pero tienen los atributos de un error HTTP
      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
    } else if (this.isExceptionObject(exception)) {
      // Si es un objeto Error, manejar como error del servidor
      this.handleUnknownError(exception, host);
    } else {
      // Para cualquier otro tipo de error desconocido
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: this.defaultMessage,
      });
    }
  }

  public handleUnknownError(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.defaultMessage;

    this.logger.error(`Unknown error: ${exception}`, `URL: ${request.url}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  public isExceptionObject(err: unknown): err is Error {
    return err instanceof Error;
  }

  public isHttpError(err: any): err is { statusCode: number; message: string } {
    return (
      err &&
      typeof err.statusCode === 'number' &&
      typeof err.message === 'string'
    );
  }

  // Nuevo método para verificar si la excepción es de validación
  public isValidationError(exception: HttpException): boolean {
    const response = exception.getResponse();
    return (
      typeof response === 'object' &&
      response !== null &&
      'message' in response &&
      Array.isArray((response as any).message)
    );
  }
}
