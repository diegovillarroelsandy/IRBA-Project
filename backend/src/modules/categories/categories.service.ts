import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    let parent: Category | undefined;

    if (dto.parentId) {
      const found = await this.repo.findOneBy({ id: dto.parentId });
      parent = found ?? undefined;
    }

    const category = this.repo.create({
      name: dto.name,
      parent,
    });

    return this.repo.save(category);
  }

  findAll() {
    return this.repo.find({
      relations: ['children'],
    });
  }
}
