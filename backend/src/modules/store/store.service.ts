import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from 'src/modules/products/entities/product.entity';
import { Category } from 'src/modules/categories/entity/category.entity';
import { StoreProductsFilterDto } from './dto/store-products-filter.dto';

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
      featured: featured.map((p) => this.mapProduct(p)),
      offers: offers.map((p) => this.mapProduct(p)),
      categories,
    };
  }

  async getProducts(filters: StoreProductsFilterDto) {
    const query = this.productRepo.createQueryBuilder('product');

    query.leftJoinAndSelect('product.category', 'category');

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

    const limit = Number(filters.limit) || 12;

    query.skip((page - 1) * limit);

    query.take(limit);

    query.orderBy('product.id', 'DESC');

    const [products, total] = await query.getManyAndCount();

    return {
      data: products.map((product) => this.mapProduct(product)),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getProduct(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 🔥 relacionados
    const related = await this.productRepo.find({
      where: {
        category: {
          id: product.category?.id,
        },
      },
      relations: ['category'],
      take: 4,
    });

    return {
      product: this.mapProduct(product),

      related: related
        .filter((p) => p.id !== product.id)
        .map((p) => this.mapProduct(p)),
    };
  }

  async getOffers() {
    const products = await this.productRepo.find({
      where: {
        isOnSale: true,
      },
      relations: ['category'],
    });

    return products.map((product) => this.mapProduct(product));
  }

  async getCategories() {
    return this.categoryRepo.find({
      relations: ['children'],
    });
  }
  private mapProduct(product: Product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      imageUrl: product.imageUrl,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : null,
    };
  }
}
