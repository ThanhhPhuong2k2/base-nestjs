import { Global, Module } from '@nestjs/common';
import { ConfigService } from '.';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
