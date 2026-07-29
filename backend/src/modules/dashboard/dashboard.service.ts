import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entity/category.entity';
import { User } from '../users/entities/user.entity';
import { StockMovement } from '../stock/entities/stock-movement.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(StockMovement)
    private movementRepository: Repository<StockMovement>,
  ) {}
  async getDashboard() {
    const products = await this.productRepository.count();

    const categories = await this.categoryRepository.count();

    const users = await this.userRepository.count();

    const stock = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.stock)', 'total')
      .getRawOne();

    const productsByCategory = await this.categoryRepository
      .createQueryBuilder('category')
      .innerJoin('category.products', 'product')
      .select('category.name', 'category')
      .addSelect('COUNT(product.id)', 'total')
      .groupBy('category.id')
      .getRawMany();

    const featuredProducts = await this.productRepository
      .createQueryBuilder('product')
      .select(
        `
    CASE
      WHEN product.isFeatured = true
      THEN 'Destacados'
      ELSE 'Normales'
    END
    `,
        'name',
      )
      .addSelect('COUNT(product.id)::int', 'value')
      .groupBy('product.isFeatured')
      .getRawMany();

    const recentMovements = await this.movementRepository.find({
      relations: {
        product: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });
    const movements = recentMovements.map((movement) => ({
      id: movement.id,
      product: movement.product.name,
      type: movement.type,
      quantity: movement.quantity,
      date: movement.createdAt,
    }));
    const lowStock = await this.productRepository
      .createQueryBuilder('product')
      .where('product.stock > 0')
      .andWhere('product.stock <= :limit', {
        limit: 5,
      })
      .select(['product.id', 'product.name', 'product.stock'])
      .take(5)
      .getMany();

    return {
      kpis: {
        products,
        categories,
        users,
        stock: Number(stock.total ?? 0),
      },

      productsByCategory,

      featuredProducts,

      recentMovements: movements,

      lowStock,
    };
  }
}
