import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class StoreProductResponseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  stock!: number;

  @IsBoolean()
  isFeatured!: boolean;

  @IsBoolean()
  isOnSale!: boolean;

  @IsString()
  imageUrl!: string;

  category!: {
    id: number;
    name: string;
  };
}
