import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

import { Product } from 'src/modules/products/entities/product.entity';
import { Customer } from 'src/modules/customers/entity/customer.entity';

import {
  StockMovement,
  MovementType,
} from 'src/modules/stock/entities/stock-movement.entity';

import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,

    @InjectRepository(StockMovement)
    private movementRepo: Repository<StockMovement>,
  ) {}

  async create(dto: CreateOrderDto) {
    const customer = await this.customerRepo.findOneBy({
      id: dto.customerId,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // 🔹 crear order vacía
    const order = this.orderRepo.create({
      customer,
      items: [],
      total: 0,
    });

    const savedOrder = await this.orderRepo.save(order);

    let total = 0;

    for (const item of dto.items) {
      const product = await this.productRepo.findOneBy({
        id: item.productId,
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for ${product.name}`);
      }

      const subtotal = Number(product.price) * item.quantity;

      total += subtotal;

      product.stock -= item.quantity;

      await this.productRepo.save(product);

      const movement = this.movementRepo.create({
        product,
        type: MovementType.OUT,
        quantity: item.quantity,
        reason: `Order #${savedOrder.id}`,
      });

      await this.movementRepo.save(movement);

      const orderItem = this.orderItemRepo.create({
        order: savedOrder,
        product,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      await this.orderItemRepo.save(orderItem);
    }

    savedOrder.total = total;

    return this.orderRepo.save(savedOrder);
  }

  async findAll() {
    return this.orderRepo.find({
      relations: ['customer', 'items', 'items.product'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
