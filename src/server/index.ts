import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import compression from 'compression';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';
import { CustomLogger } from 'src/logger/logger';

export default class Server {
  private app: INestApplication;
  private logger: CustomLogger;

  async setup() {
    this.app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    this.app.useLogger(this.app.get(WINSTON_MODULE_NEST_PROVIDER));
    this.logger = this.app.get(CustomLogger);

    this.app.setGlobalPrefix('/nest/api/v1');
    this.app.useGlobalPipes(new ValidationPipe());
    this.app.enableCors({
      credentials: true,
    });
    this.app.use(helmet());
    this.app.use(
      compression({
        threshold: 1024,
      }),
    );
    // this.app.useGlobalFilters(new HttpExceptionFilter(this.logger));
    // this.app.useGlobalInterceptors(new ResponseInterceptor());
  }

  async start() {
    const port = 3000;
    await this.app.listen(port);
    this.logger.info(`Server is running on port ${port}`);
  }

  async stop() {
    this.logger.info(`Server is disconnect`);
    await this.app.close();
  }
}
