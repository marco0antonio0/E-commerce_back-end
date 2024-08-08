import { CartDTO } from '../models/cart.dto';
import { CartEntity } from '../repositories/entities/product.entity';

export abstract class AbstractCartService {
    abstract addToCart(createCartItemDto: CartDTO): Promise<CartEntity>;

    abstract getCartItems(userEmail: string): Promise<CartEntity[]>;

    abstract updateCartItem(updateCartItemDto: CartDTO): Promise<CartEntity>;

    abstract removeFromCart(productId: string, userEmail: string, provider: string): Promise<void>;

    abstract clearCart(userEmail: string): Promise<void>;

    abstract finalizePurchase(userEmail: string): Promise<void>;
}
