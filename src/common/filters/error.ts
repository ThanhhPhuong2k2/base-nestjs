import { HttpException, HttpStatus } from '@nestjs/common';

interface AppErrorParams {
  message: string;
  where?: string;
  id?: any;
  statusCode?: HttpStatus;
}

export class AppError extends HttpException {
  constructor({
    message,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    where,
    id,
  }: AppErrorParams) {
    super({ message, where, id }, statusCode);
  }

  static notFound(message: string, where?: string, id?: string) {
    return new AppError({ message, statusCode: HttpStatus.NOT_FOUND, where });
  }

  static badRequest(message: string, where?: string) {
    return new AppError({ message, statusCode: HttpStatus.BAD_REQUEST, where });
  }

  static forbidden(message: string, where?: string) {
    return new AppError({ message, statusCode: HttpStatus.FORBIDDEN, where });
  }

  static unauthorized(message: string, where?: string) {
    return new AppError({
      message,
      statusCode: HttpStatus.UNAUTHORIZED,
      where,
    });
  }
}
