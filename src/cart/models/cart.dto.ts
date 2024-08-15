import { IsString, IsNumber, IsEmail, IsOptional, IsIn, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartDTO {
    @ApiProperty({
        description: 'ID of the product',
        example: '1'
    })
    @IsString()
    productId: string;

    @ApiProperty({
        description: 'Quantity of the product',
        example: 1
    })
    @IsNumberString()
    quantity: number;

    @ApiProperty({
        description: 'price of the product',
        example: 4.99
    })
    @IsOptional()
    @IsNumberString()
    price?: number;

    @ApiProperty({
        description: 'Name of the product',
        example: 'Lorem ipsum dollor',
        required: false
    })
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    userEmail?: string;

    @ApiProperty({
        description: 'Provider of the product',
        example: 'brazilian',
        enum: ['brazilian', 'european']
    })
    @IsString()
    @IsIn(['brazilian', 'european'])
    provider: 'brazilian' | 'european';
}
