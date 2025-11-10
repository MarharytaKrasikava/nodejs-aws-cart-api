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
    const userCart = await this.cartRepository.create({ userId, items: [] });
    await this.cartRepository.save(userCart);
    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      console.log('Found existing cart for user:', userId);
      return userCart;
    }

    console.log('Creating new cart for user:', userId);
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
    console.log('Updating cart for user:', userId, 'with payload:', payload);

    if (index === -1) {
      userCart.items.push(payload.product);
    } else if (payload.count === 0) {
      userCart.items.splice(index, 1);
    } else {
      userCart.items[index] = payload.product;
    }

    return await this.cartRepository.save(userCart);
  }

  async removeByUserId(userId: string): Promise<string> {
    await this.cartRepository.delete({ userId });
    return userId;
  }
}
