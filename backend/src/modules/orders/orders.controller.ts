import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { OrdersService } from './orders.service';

import { CreateOrderDto } from './dto/create-order.dto';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

import { Role } from 'src/modules/users/enums/role.enum';
import { Patch, Param } from '@nestjs/common';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto);
  }

  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles(Role.ADMIN)
  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.service.complete(Number(id));
  }

  @Roles(Role.ADMIN)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(Number(id));
  }
}
