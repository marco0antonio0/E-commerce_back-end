import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartDTO } from '../models/cart.dto';
import { CartEntity } from './entities/product.entity';
import { AbstractRepositoryCartService } from './abstract-repository-cart.service';

@Injectable()
export class RepositoryCartService extends AbstractRepositoryCartService {
    constructor(
        @InjectModel(CartEntity)
        private readonly cartItemModel: typeof CartEntity,
    ) {
        super();
    }

    async addToCart(createCartItemDto: CartDTO): Promise<CartEntity> {
        const cartItem = await this.cartItemModel.findOne({
            where: { productId: createCartItemDto.productId, price: createCartItemDto.price, userEmail: createCartItemDto.userEmail, purchased: false, provider: createCartItemDto.provider },
        });

        if (cartItem) {
            cartItem.quantity += createCartItemDto.quantity;
            return cartItem.save();
        }

        return this.cartItemModel.create(createCartItemDto);
    }

    async getCartItems(userEmail: string): Promise<CartEntity[]> {
        const cartItems = await this.cartItemModel.findAll({ where: { userEmail, purchased: false } });

        if (!cartItems || cartItems.length === 0) {
            throw new NotFoundException('Cart items not found');
        }

        return cartItems;
    }

    async updateCartItem(updateCartItemDto: CartDTO): Promise<CartEntity> {
        const cartItem = await this.cartItemModel.findOne({
            where: { productId: updateCartItemDto.productId, price: updateCartItemDto.price, userEmail: updateCartItemDto.userEmail, purchased: false, provider: updateCartItemDto.provider },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        cartItem.quantity = updateCartItemDto.quantity;
        return cartItem.save();
    }

    async removeFromCart(productId: string, userEmail: string, provider: 'brazilian' | 'european'): Promise<void> {
        const cartItem = await this.cartItemModel.findOne({
            where: { productId, userEmail, purchased: false, provider },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        await cartItem.destroy();
    }

    async clearCart(userEmail: string): Promise<void> {
        await this.cartItemModel.destroy({ where: { userEmail, purchased: false }, truncate: true });
    }

    async finalizePurchase(userEmail: string): Promise<void> {
        const cartItems = await this.cartItemModel.findAll({
            where: { userEmail, purchased: false },
        });

        for (const item of cartItems) {
            item.purchased = true;
            await item.save();
        }
    }
}
