import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import to from 'await-to-js';
import { ConfigService } from 'src/config';
import { PrismaProductStore } from './prisma/product';
import { CustomLogger } from 'src/logger/logger';

class PrismaStores {
  product?: PrismaProductStore;
}

@Injectable()
export default class PrismaStore
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly client: PrismaClient;
  readonly stores: PrismaStores;

  constructor(
    private readonly configService: ConfigService,
    private logger: CustomLogger,
  ) {
    const config = this.configService.getPrisma();

    const url = `postgresql://${config.prismaUsername}:${config.prismaPassword}@${config.prismaUri}/${config.prismaDatabase}`;
    const adapter = new PrismaPg({ connectionString: url });
    this.client = new PrismaClient({ adapter });
    this.stores = new PrismaStores();
  }

  async onModuleInit() {
    await this.start();
  }

  async onApplicationShutdown(signal?: string) {
    await this.disconnect();
  }

  private async setup(maxAttempts = 5, delayMs = 3000) {
    for (let i = 0; i < maxAttempts; i++) {
      const [error] = await to(this.client.$queryRaw`SELECT 1`);

      if (!error) {
        this.logger.info('Connect Postgres successfully!');
        return;
      }

      this.logger.error(
        `Connect Postgres fail at time ${i + 1}: ${error.message}`,
      );

      if (i === maxAttempts - 1)
        throw new Error(
          `Cannot connect to Postgres after ${maxAttempts} attempts`,
        );

      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  private async start() {
    this.logger.info('Setting store ...');
    await this.setup();
    this.stores.product = new PrismaProductStore(this.client);
    this.logger.info('Setting store success!');
  }

  async disconnect() {
    this.logger.info('Disconnect store ');
    await this.client.$disconnect();
  }

  products() {
    if (!this.stores.product) throw new Error('Product Store is not setup yet');
    return this.stores.product;
  }
}
