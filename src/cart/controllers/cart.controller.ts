import { Controller, Post, Body, Get, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartDTO } from '../models/cart.dto';
import { CartEntity } from '../repositories/entities/product.entity';
import { AbstractCartService } from '../services/abstract-cart.service';
import { JwtAuthGuard } from './../../guard/jwt-auth.guard';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: AbstractCartService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBody({
        schema: {
            properties: {
                productId: { type: 'string', example: '1' },
                name: { type: 'string', example: 'Lorem Ipsum Dolor' },
                price: { type: 'string', example: '4.99' },
                provider: { type: 'string', example: 'brazilian' },
                quantity: { type: 'number', example: '1' }
            }
        }
    })
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiResponse({ status: 201, description: 'Item added to cart successfully.', type: CartEntity })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addToCart(@Body() createCartItemDto: CartDTO, @Req() req: Request): Promise<CartEntity> {
        createCartItemDto['userEmail'] = req['token']['sub'];
        if (!createCartItemDto.userEmail) {
            throw new UnauthorizedException("campo email não pode ser nulo");
        }
        return this.cartService.addToCart(createCartItemDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all items in cart' })
    @ApiResponse({ status: 200, description: 'Cart items retrieved successfully.', type: [CartEntity] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getCartItems(@Req() req: Request): Promise<CartEntity[]> {
        const userEmail = req['token']['sub'];
        return this.cartService.getCartItems(userEmail);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/purchased')
    @ApiOperation({ summary: 'Get all items in cart of the has buy' })
    @ApiResponse({ status: 200, description: 'Cart items retrieved successfully.', type: [CartEntity] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getCartHasBuyItems(@Req() req: Request): Promise<CartEntity[]> {
        const userEmail = req['token']['sub'];
        return this.cartService.getCartItems(userEmail);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':productId')
    @ApiBody({
        schema: {
            properties: {
                productId: { type: 'string', example: '1' },
                provider: { type: 'string', example: 'brazilian' },
                quantity: { type: 'number', example: 1 }
            }
        }
    })
    @ApiOperation({ summary: 'Update item in cart' })
    @ApiResponse({ status: 200, description: 'Cart item updated successfully.', type: CartEntity })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateCartItem(

        @Body() updateCartItemDto: CartDTO,
        @Req() req: Request
    ): Promise<CartEntity> {
        updateCartItemDto['userEmail'] = req['token']['sub'];
        if (!updateCartItemDto.userEmail) {
            throw new UnauthorizedException("campo email não pode ser nulo");
        }
        const productId = updateCartItemDto.productId
        return this.cartService.updateCartItem({ ...updateCartItemDto, productId });
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':provider/:productId')
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiResponse({ status: 204, description: 'Cart item removed successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async removeFromCart(@Param('productId') productId: string, @Param('provider') provider: string, @Req() req: Request): Promise<void> {
        const userEmail = req['token']['sub'];
        return this.cartService.removeFromCart(productId, userEmail, provider);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('clear')
    @ApiOperation({ summary: 'Clear all items in cart' })
    @ApiResponse({ status: 204, description: 'Cart cleared successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async clearCart(@Req() req: Request): Promise<void> {
        const userEmail = req['token']['sub'];
        return this.cartService.clearCart(userEmail);
    }

    @UseGuards(JwtAuthGuard)
    @Post('finalize')
    @ApiOperation({ summary: 'Finalize purchase' })
    @ApiResponse({ status: 200, description: 'Purchase finalized successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async finalizePurchase(@Req() req: Request): Promise<void> {
        const userEmail = req['token']['sub'];
        return this.cartService.finalizePurchase(userEmail);
    }
}
