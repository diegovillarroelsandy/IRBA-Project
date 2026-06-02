import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { Category } from '../categories/entity/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOneBy({
      id: dto.categoryId,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const product = this.productRepository.create({ ...dto, category });
    return this.productRepository.save(product);
  }

  async findAll(filters: FilterProductsDto) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (filters.search) {
      query.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.featured === 'true') {
      query.andWhere('product.isFeatured = true');
    }

    if (filters.onSale === 'true') {
      query.andWhere('product.isOnSale = true');
    }

    if (filters.category) {
      query.andWhere('category.id = :categoryId', {
        categoryId: Number(filters.category),
      });
    }

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;

    query.skip((page - 1) * limit).take(limit);

    return query.getMany();
  }

  findOne(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
