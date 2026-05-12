import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';

export enum MovementType {
  IN = 'in',
  OUT = 'out',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product!: Product;

  @Column({ type: 'enum', enum: MovementType })
  type!: MovementType;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'varchar', nullable: true })
  reason!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
