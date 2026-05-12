import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);
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
