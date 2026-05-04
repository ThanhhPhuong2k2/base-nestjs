import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from 'src/config';
import { CustomLogger } from 'src/logger/logger';
import Redis, { Callback, RedisKey } from 'ioredis';

@Injectable()
export class RedisServices implements OnModuleInit, OnApplicationShutdown {
  private client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: CustomLogger,
  ) {}

  async onModuleInit() {
    const config = this.configService.getRedis();
    console.log({
      config,
    });
    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db || 0,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 5) {
          this.logger.error('❌ Redis retry quá 5 lần, dừng');
          return null;
        }
        return 1000;
      },
    });

    this.registerEvents();
    await this.client.connect();
  }

  async onApplicationShutdown(signal?: string) {
    await this.client.quit();
    this.logger.info('Redis disconnect!', { signal });
  }

  private registerEvents() {
    this.client.on('connect', () => {
      this.logger.info('✅ Redis connected');
    });

    this.client.on('ready', () => {
      this.logger.info('🚀 Redis ready');
    });

    this.client.on('error', (err) => {
      this.logger.error('❌ Redis error', err);
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('🔄 Redis reconnecting...');
    });

    this.client.on('close', () => {
      this.logger.warn('⚠️ Redis connection closed');
    });
  }

  get(key: RedisKey, callback?: Callback<string | null>) {
    return this.client.get(key, callback);
  }

  set(key: RedisKey, value: string | Buffer | number, ttlSeconds?: number) {
    if (ttlSeconds) return this.client.set(key, value, 'EX', ttlSeconds);
    return this.client.set(key, value);
  }

  del(key: string) {
    return this.client.del(key);
  }

  getClient() {
    return this.client;
  }
}
