import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CartDTO } from '../models/cart.dto';
import { CartEntity } from '../repositories/entities/product.entity';
import { AbstractCartService } from './abstract-cart.service';
import { AbstractRepositoryCartService } from '../repositories/abstract-repository-cart.service';

@Injectable()
export class CartService implements AbstractCartService {
    constructor(
        private readonly repositoryCartService: AbstractRepositoryCartService,
    ) { }

    addToCart(createCartItemDto: CartDTO): Promise<CartEntity> {
        return this.repositoryCartService.addToCart(createCartItemDto);
    }

    getCartItems(userEmail: string): Promise<CartEntity[]> {
        return this.repositoryCartService.getCartItems(userEmail);
    }

    updateCartItem(updateCartItemDto: CartDTO): Promise<CartEntity> {
        return this.repositoryCartService.updateCartItem(updateCartItemDto);
    }

    removeFromCart(productId: string, userEmail: string, provider: 'brazilian' | 'european'): Promise<void> {
        return this.repositoryCartService.removeFromCart(productId, userEmail, provider);
    }

    clearCart(userEmail: string): Promise<void> {
        return this.repositoryCartService.clearCart(userEmail);
    }

    finalizePurchase(userEmail: string): Promise<void> {
        return this.repositoryCartService.finalizePurchase(userEmail);
    }
}
