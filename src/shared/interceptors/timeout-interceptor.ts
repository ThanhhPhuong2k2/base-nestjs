import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { catchError, Observable, throwError, timeout } from 'rxjs';
import { ConfigService } from 'src/config';

@Injectable()
export class TimeOutInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      timeout(10000),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          return throwError(
            () => new RequestTimeoutException('Request timeout'),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
