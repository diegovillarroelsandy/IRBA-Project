import { Controller, Post, Body, Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Role } from '../users/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.service.create(dto);
  }
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
