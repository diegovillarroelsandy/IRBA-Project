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

  findAll() {
    return this.movementRepo.find({
      relations: ['product'],
    });
  }
}
