import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StockMovement, MovementType } from './entities/stock-movement.entity';
import { Product } from '../products/entities/product.entity';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockMovement)
    private movementRepo: Repository<StockMovement>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateMovementDto) {
    const product = await this.productRepo.findOneBy({ id: dto.productId });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 🔥 lógica de stock
    if (dto.type === MovementType.OUT && product.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock');
    }

    if (dto.type === MovementType.IN) {
      product.stock += dto.quantity;
    } else {
      product.stock -= dto.quantity;
    }

    await this.productRepo.save(product);

    const movement = this.movementRepo.create({
      product,
      type: dto.type,
      quantity: dto.quantity,
      reason: dto.reason,
    });

    return this.movementRepo.save(movement);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const query = this.movementRepo
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product');

    if (search) {
      query.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    query
      .orderBy('movement.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
