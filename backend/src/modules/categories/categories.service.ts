import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    let parent: Category | undefined;

    if (dto.parentId !== undefined) {
      const found = await this.repo.findOneBy({ id: dto.parentId });
      parent = found ?? undefined;
    }

    const category = this.repo.create({
      name: dto.name,
      parent,
    });

    return this.repo.save(category);
  }
  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.repo.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.parentId !== undefined) {
      const parent = await this.repo.findOneBy({
        id: dto.parentId,
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }

      category.parent = parent;
    }

    if (dto.name !== undefined) {
      category.name = dto.name;
    }

    return this.repo.save(category);
  }

  async remove(id: number) {
    const category = await this.repo.findOne({
      where: { id },
      relations: ['products', 'children'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.products.length > 0) {
      throw new BadRequestException(
        'Cannot delete category because it has products.',
      );
    }

    if (category.children.length > 0) {
      throw new BadRequestException(
        'Cannot delete category because it has subcategories.',
      );
    }

    await this.repo.remove(category);

    return {
      message: 'Category deleted successfully',
    };
  }

  findAll() {
    return this.repo.find({
      relations: ['parent', 'children'],
    });
  }
}
