import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { AbstractProductsService } from '../services/abstract-products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: AbstractProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Retrieve all products' })
    @ApiResponse({ status: 200, description: 'List of all products' })
    async getAllProducts() {
        return this.productsService.getAllProducts();
    }

    @Get(':provider/:id')
    @ApiOperation({ summary: 'Retrieve a product by ID' })
    @ApiResponse({ status: 200, description: 'The product with the specified ID' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async getProductById(@Param('id') id: string, @Param('provider') provider: string) {
        return await this.productsService.getProductById(id, provider);
    }
}
