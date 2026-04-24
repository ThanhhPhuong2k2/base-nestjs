import 'dotenv/config';
import { Injectable } from '@nestjs/common';

import { IConfig } from 'src/interface';

export const configs: IConfig = {
  httpServer: {
    port: Number(process.env.HTTP_PORT) || 9000,
    timeout: Number(process.env.REQUEST_TIMEOUT_MS) || 5000,
  },
  prismaSettings: {
    prismaDatabase: process.env.PRISMA_DATABASE || '',
    prismaUri: process.env.PRISMA_HOST || '',
    prismaUsername: process.env.PRISMA_USERNAME || '',
    prismaPassword: process.env.PRISMA_PASSWORD || '',
  },
  loggerSettings: {
    level: process.env.LOG_LEVEL || 'info',
    serviceName: process.env.LOG_SERVICENAME || 'base_api',
    dirpath: process.env.LOG_FOLDER || '',
    maxSize: Number(process.env.LOG_SIZE) || 10,
    maxRotate: process.env.LOG_ROTATE || '',
  },
};

@Injectable()
export class ConfigService {
  private readonly config: IConfig = configs;

  get(): IConfig {
    return this.config;
  }

  getPrisma() {
    return this.config.prismaSettings;
  }

  getLogger() {
    return this.config.loggerSettings;
  }

  getHttp() {
    return this.config.httpServer;
  }
}
