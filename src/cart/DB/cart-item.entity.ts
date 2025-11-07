import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity('cart_items')
export class CartItemEntity {
  @Column({ name: 'product_id', nullable: false })
  productId: string;

  @Column({ type: 'integer' })
  count: number;

  @ManyToOne(() => CartEntity, (cart: any) => cart.items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;
}
