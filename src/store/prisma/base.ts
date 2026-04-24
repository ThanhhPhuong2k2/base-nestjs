import { PrismaClient, Prisma } from 'src/generated/prisma/client';

export class BaseStore<T, M extends Prisma.ModelName> {
  protected readonly model: PrismaClient[M];

  constructor(db: PrismaClient, modelName: M) {
    this.model = db[modelName];
  }

  baseFind(args?: any): Promise<T[]> {
    return (this.model as any).findMany(args);
  }

  // findFirst(args?: any): Promise<T | null> {
  //   return (this.model as any).findFirst(args);
  // }

  // create(args: any): Promise<T> {
  //   return (this.model as any).create(args);
  // }

  // update(args: any): Promise<T> {
  //   return (this.model as any).update(args);
  // }

  // delete(args: any): Promise<T> {
  //   return (this.model as any).delete(args);
  // }

  // count(args?: any): Promise<number> {
  //   return (this.model as any).count(args);
  // }
}
