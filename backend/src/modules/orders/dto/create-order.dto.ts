import { IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  customerId!: number;

  @IsArray()
  items!: {
    productId: number;
    quantity: number;
  }[];
}
