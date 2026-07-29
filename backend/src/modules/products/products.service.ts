import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOneBy({
        id: dto.categoryId,
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      product.category = category;
    }

    Object.assign(product, {
      name: dto.name ?? product.name,
      description: dto.description ?? product.description,
      price: dto.price ?? product.price,
      stock: dto.stock ?? product.stock,
      imageUrl: dto.imageUrl ?? product.imageUrl,
      isFeatured: dto.isFeatured ?? product.isFeatured,
      isOnSale: dto.isOnSale ?? product.isOnSale,
    });

    return this.productRepository.save(product);
  }

  async findAll(filters: FilterProductsDto) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (filters.search) {
      const search = filters.search.trim();

      query.andWhere(
        `(LOWER(product.name) LIKE LOWER(:search)
      OR CAST(product.id AS TEXT) LIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
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
    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(product);

    return {
      message: 'Product deleted successfully',
    };
  }
}
