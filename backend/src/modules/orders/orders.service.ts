import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
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
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const customer = await queryRunner.manager.findOne(Customer, {
        where: {
          id: dto.customerId,
        },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      const order = queryRunner.manager.create(Order, {
        customer,
        items: [],
        total: 0,
      });

      const savedOrder = await queryRunner.manager.save(order);

      let total = 0;

      for (const item of dto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: {
            id: item.productId,
          },
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

        await queryRunner.manager.save(product);

        const movement = queryRunner.manager.create(StockMovement, {
          product,
          type: MovementType.OUT,
          quantity: item.quantity,
          reason: `Order #${savedOrder.id}`,
        });

        await queryRunner.manager.save(movement);

        const orderItem = queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          product,
          quantity: item.quantity,
          price: product.price,
          subtotal,
        });

        await queryRunner.manager.save(orderItem);
      }

      savedOrder.total = total;

      const finalOrder = await queryRunner.manager.save(savedOrder);

      await queryRunner.commitTransaction();

      return finalOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.orderRepo.find({
      relations: ['customer', 'items', 'items.product'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
  private async getOrderWithItems(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'customer'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async complete(id: number) {
    const order = await this.getOrderWithItems(id);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be completed');
    }

    order.status = OrderStatus.COMPLETED;

    return this.orderRepo.save(order);
  }

  async cancel(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
        relations: ['items', 'items.product'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Only pending orders can be cancelled');
      }

      for (const item of order.items) {
        item.product.stock += item.quantity;

        await queryRunner.manager.save(item.product);

        const movement = queryRunner.manager.create(StockMovement, {
          product: item.product,
          type: MovementType.IN,
          quantity: item.quantity,
          reason: `Cancelled Order #${order.id}`,
        });

        await queryRunner.manager.save(movement);
      }

      order.status = OrderStatus.CANCELLED;

      const updatedOrder = await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
