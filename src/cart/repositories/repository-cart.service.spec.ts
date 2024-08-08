import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { RepositoryCartService } from './repository-cart.service';
import { CartEntity } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { CartDTO } from '../models/cart.dto';

const mockCartEntity = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn(),
};

describe('RepositoryCartService', () => {
    let service: RepositoryCartService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RepositoryCartService,
                {
                    provide: getModelToken(CartEntity),
                    useValue: mockCartEntity,
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
            mockCartEntity.findOne.mockResolvedValue(null);
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian' };
            mockCartEntity.create.mockResolvedValue(dto);

            expect(await service.addToCart(dto)).toEqual(dto);
            expect(mockCartEntity.findOne).toHaveBeenCalledWith({
                where: { productId: dto.productId, userEmail: dto.userEmail, purchased: false, provider: dto.provider },
            });
            expect(mockCartEntity.create).toHaveBeenCalledWith(dto);
        });

        it('should increase quantity if item already exists in the cart', async () => {
            const existingCartItem = { ...mockCartEntity, quantity: 1, save: jest.fn().mockResolvedValue(true) };
            mockCartEntity.findOne.mockResolvedValue(existingCartItem);
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 1, provider: 'brazilian' };

            await service.addToCart(dto);
            expect(existingCartItem.quantity).toBe(2);
            expect(existingCartItem.save).toHaveBeenCalled();
        });
    });

    // Testes para a função getCartItems
    describe('getCartItems', () => {
        it('should return cart items for a user', async () => {
            const cartItems = [{ productId: '1', userEmail: 'test@test.com', quantity: 1 }];
            mockCartEntity.findAll.mockResolvedValue(cartItems);

            expect(await service.getCartItems('test@test.com')).toEqual(cartItems);
        });

        it('should throw NotFoundException if no cart items are found', async () => {
            mockCartEntity.findAll.mockResolvedValue([]);

            await expect(service.getCartItems('test@test.com')).rejects.toThrow(NotFoundException);
        });
    });

    // Testes para a função updateCartItem
    describe('updateCartItem', () => {
        it('should update the quantity of a cart item', async () => {
            const existingCartItem = { ...mockCartEntity, quantity: 1, save: jest.fn().mockResolvedValue(true) };
            mockCartEntity.findOne.mockResolvedValue(existingCartItem);
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 2, provider: 'brazilian' };

            await service.updateCartItem(dto);
            expect(existingCartItem.quantity).toBe(2);
            expect(existingCartItem.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if cart item is not found', async () => {
            mockCartEntity.findOne.mockResolvedValue(null);
            const dto: CartDTO = { productId: '1', userEmail: 'test@test.com', quantity: 2, provider: 'brazilian' };

            await expect(service.updateCartItem(dto)).rejects.toThrow(NotFoundException);
        });
    });

    // Testes para a função removeFromCart
    describe('removeFromCart', () => {
        it('should remove an item from the cart', async () => {
            const cartItem = { ...mockCartEntity, destroy: jest.fn().mockResolvedValue(true) };
            mockCartEntity.findOne.mockResolvedValue(cartItem);

            await service.removeFromCart('1', 'test@test.com', 'brazilian');
            expect(cartItem.destroy).toHaveBeenCalled();
        });

        it('should throw NotFoundException if cart item is not found', async () => {
            mockCartEntity.findOne.mockResolvedValue(null);

            await expect(service.removeFromCart('1', 'test@test.com', 'brazilian')).rejects.toThrow(NotFoundException);
        });
    });

    // Testes para a função clearCart
    describe('clearCart', () => {
        it('should clear all items in the cart for a user', async () => {
            mockCartEntity.destroy.mockResolvedValue(true);

            await service.clearCart('test@test.com');
            expect(mockCartEntity.destroy).toHaveBeenCalledWith({ where: { userEmail: 'test@test.com', purchased: false }, truncate: true });
        });
    });

    // Testes para a função finalizePurchase
    describe('finalizePurchase', () => {
        it('should mark all cart items as purchased', async () => {
            const cartItems = [{ ...mockCartEntity, purchased: false, save: jest.fn().mockResolvedValue(true) }];
            mockCartEntity.findAll.mockResolvedValue(cartItems);

            await service.finalizePurchase('test@test.com');
            for (const item of cartItems) {
                expect(item.purchased).toBe(true);
                expect(item.save).toHaveBeenCalled();
            }
        });
    });
});
