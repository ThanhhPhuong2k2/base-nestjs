import { Global, Module } from '@nestjs/common';
import { RedisServices } from './redis.service';

@Global()
@Module({
  providers: [RedisServices],
  exports: [RedisServices],
})
export class RedisModule {}
