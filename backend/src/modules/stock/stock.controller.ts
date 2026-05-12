import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { StockService } from './stock.service';
import { CreateMovementDto } from './dto/create-movement.dto';

import { JwtAuthGuard } from '../auth/guards/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@Controller('stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @Post()
  create(@Body() dto: CreateMovementDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
