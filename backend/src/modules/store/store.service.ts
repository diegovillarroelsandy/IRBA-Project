import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from 'src/modules/products/entities/product.entity';
import { Category } from 'src/modules/categories/entity/category.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async getHome() {
    const featured = await this.productRepo.find({
      where: {
        isFeatured: true,
      },
      take: 8,
    });

    const offers = await this.productRepo.find({
      where: {
        isOnSale: true,
      },
      take: 8,
    });

    const categories = await this.categoryRepo.find({
      take: 10,
    });

    return {
      featured,
      offers,
      categories,
    };
  }

  async getProducts() {
    return this.productRepo.find({
      relations: ['category'],
      order: {
        id: 'DESC',
      },
    });
  }

  async getProduct(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getOffers() {
    return this.productRepo.find({
      where: {
        isOnSale: true,
      },
      relations: ['category'],
    });
  }

  async getCategories() {
    return this.categoryRepo.find({
      relations: ['children'],
    });
  }
}
