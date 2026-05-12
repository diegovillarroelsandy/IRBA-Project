import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

import { Product } from 'src/modules/products/entities/product.entity';
import { Customer } from 'src/modules/customers/entity/customer.entity';
import { StockMovement } from 'src/modules/stock/entities/stock-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product,
      Customer,
      StockMovement,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
