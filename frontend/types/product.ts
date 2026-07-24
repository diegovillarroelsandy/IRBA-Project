import type { Category } from "./category";

export interface Product {
  id: number;

  name: string;

  description: string;

  price: number;

  stock: number;

  imageUrl: string;

  isFeatured: boolean;

  isOnSale: boolean;

  category: Category;
}
