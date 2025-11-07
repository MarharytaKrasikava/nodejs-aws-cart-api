import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartItemEntity } from './cart-item.entity';

export enum CartStatus {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}
@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.OPEN,
  })
  status: CartStatus;

  @OneToMany(() => CartItemEntity, (item) => item.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItemEntity[];
}
