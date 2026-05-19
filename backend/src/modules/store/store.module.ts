import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StoreController } from './store.controller';
import { StoreService } from './store.service';

import { Product } from 'src/modules/products/entities/product.entity';
import { Category } from 'src/modules/categories/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
