import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../DB/cart.entity';
import { CartItemEntity } from '../DB/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    // @InjectRepository(CartItemEntity)
    // private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}
  // private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<CartEntity> {
    return await this.cartRepository.findOne({ where: { userId } });
  }

  async createByUserId(userId: string): Promise<CartEntity> {
    const userCart = this.cartRepository.create({ userId, items: [] });
    this.cartRepository.save(userCart);
    return userCart;
    // const timestamp = Date.now();

    // const userCart = {
    //   id: randomUUID(),
    //   user_id,
    //   created_at: timestamp,
    //   updated_at: timestamp,
    //   status: CartStatuses.OPEN,
    //   items: [],
    // };

    // this.userCarts[user_id] = userCart;

    // return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    payload: { product: CartItemEntity; count: number },
  ): Promise<CartEntity> {
    const userCart = await this.findOrCreateByUserId(userId);
    const index = userCart.items.findIndex(
      (item) => item.productId === payload.product.productId,
    );

    if (index === -1) {
      userCart.items.push(payload.product);
    } else if (payload.count === 0) {
      userCart.items.splice(index, 1);
    } else {
      userCart.items[index] = payload.product;
    }

    return userCart;
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.cartRepository.delete({ userId });
  }
}
