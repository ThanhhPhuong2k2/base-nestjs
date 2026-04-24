import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: res.statusCode ?? HttpStatus.OK,
        message: 'OK',
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
