import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { MovementType } from '../entities/stock-movement.entity';

export class CreateMovementDto {
  @IsNumber()
  productId!: number;

  @IsEnum(MovementType)
  type!: MovementType;

  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
