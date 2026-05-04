import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from 'src/logger/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const body =
      typeof exceptionResponse === 'object' ? (exceptionResponse as any) : null;

    const message =
      body?.message ??
      (exception instanceof Error
        ? exception.message
        : 'Internal server error');

    const where = body?.where;
    const id = body?.id;

    if (status >= 500) {
      this.logger.error(`[${status}] ${req.method} ${req.originalUrl}`, {
        stack: exception instanceof Error ? exception.stack : undefined,
        where,
      });
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      ...(where && { where }),
      ...(id !== undefined && { id }),
      timestamp: new Date().toISOString(),
    });
  }
}
