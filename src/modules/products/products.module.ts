import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [StoreModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
