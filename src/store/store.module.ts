import { Module } from '@nestjs/common';
import PrismaStore from '.';

@Module({
  providers: [PrismaStore],
  exports: [PrismaStore],
})
export class StoreModule {}
