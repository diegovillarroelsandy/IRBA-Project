import {
  IsOptional,
  IsString,
  IsBooleanString,
  IsNumberString,
} from 'class-validator';

export class FilterProductsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBooleanString()
  featured?: string;

  @IsOptional()
  @IsBooleanString()
  onSale?: string;

  @IsOptional()
  @IsNumberString()
  category?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
