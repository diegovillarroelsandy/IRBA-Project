import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';
import { Query } from '@nestjs/common';
import { StoreProductsFilterDto } from './dto/store-products-filter.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('home')
  getHome() {
    return this.storeService.getHome();
  }

  @Get('products')
  getProducts(
    @Query()
    filters: StoreProductsFilterDto,
  ) {
    return this.storeService.getProducts(filters);
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.storeService.getProduct(Number(id));
  }

  @Get('offers')
  getOffers() {
    return this.storeService.getOffers();
  }

  @Get('categories')
  getCategories() {
    return this.storeService.getCategories();
  }
}
