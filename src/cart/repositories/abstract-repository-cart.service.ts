import { CartDTO } from '../models/cart.dto';
import { CartEntity } from './entities/product.entity';

export abstract class AbstractRepositoryCartService {
    abstract addToCart(createCartItemDto: CartDTO): Promise<CartEntity>;
    abstract getCartItems(userEmail: string): Promise<CartEntity[]>;
    abstract updateCartItem(updateCartItemDto: CartDTO): Promise<CartEntity>;
    abstract removeFromCart(productId: string, userEmail: string, provider: 'brazilian' | 'european'): Promise<void>;
    abstract clearCart(userEmail: string): Promise<void>;
    abstract finalizePurchase(userEmail: string): Promise<void>;
}