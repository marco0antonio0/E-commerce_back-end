import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryCartService } from './repository-cart.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CartDTO } from '../models/cart.dto';
import { MockRepositoryCartService } from './__mock__/MockRepositoryCartService';

describe('RepositoryCartService', () => {
    let service: RepositoryCartService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: RepositoryCartService,
                    useClass: MockRepositoryCartService, // Usando o mock criado
                },
            ],
        }).compile();

        service = module.get<RepositoryCartService>(RepositoryCartService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Testes para a função addToCart
    describe('addToCart', () => {
        it('should add a new item to the cart if it does not exist', async () => {
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian', name: 'Product 1', price: 100 };

            const result = await service.addToCart(dto);
            expect(result).toEqual(expect.objectContaining(dto));
        });

        it('should increase quantity if item already exists in the cart', async () => {
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian', name: 'Product 1', price: 100 };

            await service.addToCart(dto); // Adiciona o item pela primeira vez
            const updatedItem = await service.addToCart(dto); // Adiciona novamente, deve aumentar a quantidade

            expect(updatedItem.quantity).toBe(2); // Quantidade deve ser 2
        });

        it('should throw BadRequestException if name is missing', async () => {
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian', name: '', price: 100 };

            await expect(service.addToCart(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if price is missing or zero', async () => {
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian', name: 'Product 1', price: 0 };

            await expect(service.addToCart(dto)).rejects.toThrow(BadRequestException);
        });
    });

    // Testes para a função getCartItems
    describe('getCartItems', () => {
        it('should return cart items for a user', async () => {
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian', name: 'Product 1', price: 100 };
            await service.addToCart(dto);

            const cartItems = await service.getCartItems('test@test.com');
            expect(cartItems.length).toBe(1);
            expect(cartItems[0]).toEqual(expect.objectContaining(dto));
        });

        it('should throw NotFoundException if no cart items are found', async () => {
            await expect(service.getCartItems('nonexistent@test.com')).rejects.toThrow(NotFoundException);
        });
    });

    // Testes para a função updateCartItem
    describe('updateCartItem', () => {
        it('should update the quantity of a cart item', async () => {
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian', name: 'Product 1', price: 100 };
            await service.addToCart(dto);

            const updateDto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 2, provider: 'brazilian', name: 'Product 1', price: 100 };
            const updatedItem = await service.updateCartItem(updateDto);

            expect(updatedItem.quantity).toBe(3); // 1 existente + 2 atualizado
        });

        it('should throw NotFoundException if cart item is not found', async () => {
            const updateDto: CartDTO = { productId: '999', userEmail: 'test@test.com', quantity: 2, provider: 'brazilian', name: 'Product 1', price: 100 };

            await expect(service.updateCartItem(updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    // Testes para a função removeFromCart
    describe('removeFromCart', () => {
        it('should remove an item from the cart', async () => {
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian', name: 'Product 1', price: 100 };
            await service.addToCart(dto);

            await service.removeFromCart('1', 'test@test.com', 'brazilian');

            await expect(service.getCartItems('test@test.com')).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if cart item is not found', async () => {
            await expect(service.removeFromCart('999', 'test@test.com', 'brazilian')).rejects.toThrow(NotFoundException);
        });
    });

    // Testes para a função clearCart
    describe('clearCart', () => {
        it('should clear all items in the cart for a user', async () => {
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian', name: 'Product 1', price: 100 };
            await service.addToCart(dto);

            await service.clearCart('test@test.com');

            await expect(service.getCartItems('test@test.com')).rejects.toThrow(NotFoundException);
        });
    });

    // Testes para a função finalizePurchase
    describe('finalizePurchase', () => {
        it('should mark all cart items as purchased', async () => {
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian', name: 'Product 1', price: 100 };
            await service.addToCart(dto);

            await service.finalizePurchase('test@test.com');
            const purchasedItems = await service.getCartItemsHasBuy('test@test.com');

            expect(purchasedItems.length).toBe(1);
            expect(purchasedItems[0].purchased).toBe(true);
        });
    });
});
