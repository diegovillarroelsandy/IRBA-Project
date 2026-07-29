import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entity/category.entity';
import { User } from '../users/entities/user.entity';
import { StockMovement } from '../stock/entities/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, User, StockMovement])],

  controllers: [DashboardController],

  providers: [DashboardService],
})
export class DashboardModule {}
