import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entity/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ type: 'boolean', default: false })
  isOnSale!: boolean;

  @Column({ type: 'varchar', nullable: true })
  imageUrl!: string;

  @ManyToOne(() => Category, { nullable: true })
  category!: Category;
}
