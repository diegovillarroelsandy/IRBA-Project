import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

import { Order } from './order.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  order!: Order;

  @ManyToOne(() => Product)
  product!: Product;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ type: 'decimal' })
  subtotal!: number;
}
