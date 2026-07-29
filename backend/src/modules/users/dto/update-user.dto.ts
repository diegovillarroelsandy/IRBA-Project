import { IsBoolean, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
