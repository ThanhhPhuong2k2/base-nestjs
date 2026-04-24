import { Prisma, PrismaClient } from 'src/generated/prisma/client';
import { BaseStore } from './base';
import { IProduct } from 'src/interface/products';

export class PrismaProductStore extends BaseStore<IProduct, 'products'> {
  constructor(db: PrismaClient) {
    super(db, 'products');
  }

  findMany(args?: Prisma.productsWhereInput) {
    this.model.findMany();
  }
}
