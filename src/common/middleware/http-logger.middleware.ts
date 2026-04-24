import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from 'src/logger/logger';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const ip = req.ip || req.socket.remoteAddress;
    const start = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - start).toFixed(3);
      const { statusCode } = res;
      this.logger.info(
        `[HTTP] ${method} ${originalUrl} ${statusCode} ${duration}ms - ip=${ip}`,
      );
    });

    next();
  }
}
