import { IsEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateProductDto {
  @MinLength(5)
  name: string;

  @IsEmpty()
  category: string;

  @IsNumber()
  price: number;
}
