import { CartItemEntity } from '../DB/cart-item.entity';

export function calculateCartTotal(items: CartItemEntity[]): number {
  return items.length
    ? items.reduce((acc: number, { count }: CartItemEntity) => {
        return (acc += 20 * count);
      }, 0)
    : 0;
}
