import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity.js';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true, length: 30 })
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  image: string | null;

  @Column({ default: true })
  is_show: boolean;

  @Column({ type: 'integer', nullable: true })
  parent_id: number | null;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
