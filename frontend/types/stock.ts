import { Product } from "./product";

export enum MovementType {
  IN = "in",
  OUT = "out",
}

export interface StockMovement {
  id: number;
  type: MovementType;
  quantity: number;
  reason: string;
  createdAt: string;

  product: Product;
}
