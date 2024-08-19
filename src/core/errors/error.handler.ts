import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorHandler extends Error {
  constructor({
    type,
    message,
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    // Crea un mensaje de error con el tipo de error y el mensaje proporcionado
    super(`${HttpStatus[type]} :: ${message}`);
  }

  // Método estático para crear y lanzar errores de firma
  public static createSignatureError(message: string) {
    // Extrae el nombre del error del mensaje
    const name = message.split('::')[0].trim();

    // Verifica si el nombre del error corresponde a un código de estado HTTP válido
    if (name && HttpStatus[name as keyof typeof HttpStatus]) {
      throw new HttpException(
        message,
        HttpStatus[name as keyof typeof HttpStatus],
      );
    } else {
      // Si no hay un nombre válido, lanza un error de servidor interno
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public static notFound(message: string) {
    throw new HttpException(message, HttpStatus.NOT_FOUND);
  }

  public static badRequest(message: string) {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }
}
