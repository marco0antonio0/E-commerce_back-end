import { CartDTO } from "src/cart/models/cart.dto";
import { CartEntity } from "../entities/product.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

export class MockRepositoryCartService {
    private cartItems = [];

    async addToCart(createCartItemDto: CartDTO): Promise<CartEntity> {
        const cartItem = this.cartItems.find(
            item =>
                item.productId === createCartItemDto.productId &&
                item.userEmail === createCartItemDto.userEmail &&
                item.provider === createCartItemDto.provider &&
                !item.purchased,
        );

        if (cartItem) {
            cartItem.quantity += createCartItemDto.quantity;
            return cartItem;
        }

        if (!createCartItemDto.name || createCartItemDto.name.length === 0) {
            throw new BadRequestException("Informações de nome do produto obrigatórias estão faltando.");
        }

        if (createCartItemDto.price == null || createCartItemDto.price === 0) {
            throw new BadRequestException("Informações de preço obrigatórias estão faltando.");
        }

        const newCartItem = {
            ...createCartItemDto,
            purchased: false,
        };
        this.cartItems.push(newCartItem);
        return newCartItem as CartEntity;
    }

    async getCartItems(userEmail: string): Promise<CartEntity[]> {
        const cartItems = this.cartItems.filter(item => item.userEmail === userEmail && !item.purchased);

        if (!cartItems || cartItems.length === 0) {
            throw new NotFoundException('Cart items not found');
        }

        return cartItems;
    }

    async getCartItemsHasBuy(userEmail: string): Promise<CartEntity[]> {
        const cartItems = this.cartItems.filter(item => item.userEmail === userEmail && item.purchased);

        if (!cartItems || cartItems.length === 0) {
            throw new NotFoundException('Cart items not found');
        }

        return cartItems;
    }

    async updateCartItem(updateCartItemDto: CartDTO): Promise<CartEntity> {
        const cartItem = this.cartItems.find(
            item =>
                item.productId === updateCartItemDto.productId &&
                item.userEmail === updateCartItemDto.userEmail &&
                item.provider === updateCartItemDto.provider &&
                !item.purchased,
        );

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        cartItem.quantity += updateCartItemDto.quantity;
        return cartItem;
    }

    async removeFromCart(productId: string, userEmail: string, provider: 'brazilian' | 'european'): Promise<void> {
        const index = this.cartItems.findIndex(
            item =>
                item.productId === productId &&
                item.userEmail === userEmail &&
                item.provider === provider &&
                !item.purchased,
        );

        if (index === -1) {
            throw new NotFoundException('Cart item not found');
        }

        this.cartItems.splice(index, 1);
    }

    async clearCart(userEmail: string): Promise<void> {
        this.cartItems = this.cartItems.filter(item => !(item.userEmail === userEmail && !item.purchased));
    }

    async finalizePurchase(userEmail: string): Promise<void> {
        const cartItems = this.cartItems.filter(item => item.userEmail === userEmail && !item.purchased);

        for (const item of cartItems) {
            item.purchased = true;
        }
    }
}
